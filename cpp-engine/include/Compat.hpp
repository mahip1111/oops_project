#pragma once

#if defined(_WIN32) && defined(__MINGW32__) && !defined(_GLIBCXX_HAS_GTHREADS)
// MinGW 32-bit win32 thread model compatibility layer
#include <windows.h>
#include <functional>
#include <memory>
#include <vector>
#include <queue>
#include <chrono>
#include <stdexcept>
#include <utility>

namespace std {

class mutex {
private:
    CRITICAL_SECTION cs;
public:
    mutex() { InitializeCriticalSection(&cs); }
    ~mutex() { DeleteCriticalSection(&cs); }
    mutex(const mutex&) = delete;
    mutex& operator=(const mutex&) = delete;

    void lock() { EnterCriticalSection(&cs); }
    bool try_lock() { return TryEnterCriticalSection(&cs) != 0; }
    void unlock() { LeaveCriticalSection(&cs); }
    CRITICAL_SECTION* native_handle() { return &cs; }
};

template <typename Mutex>
class lock_guard {
private:
    Mutex& mtx;
public:
    explicit lock_guard(Mutex& m) : mtx(m) { mtx.lock(); }
    ~lock_guard() { mtx.unlock(); }
    lock_guard(const lock_guard&) = delete;
    lock_guard& operator=(const lock_guard&) = delete;
};

template <typename Mutex>
class unique_lock {
private:
    Mutex* mtx;
    bool is_locked;
public:
    unique_lock() : mtx(nullptr), is_locked(false) {}
    explicit unique_lock(Mutex& m) : mtx(&m), is_locked(true) { mtx->lock(); }
    ~unique_lock() { if (is_locked && mtx) mtx->unlock(); }
    unique_lock(const unique_lock&) = delete;
    unique_lock& operator=(const unique_lock&) = delete;

    void lock() {
        if (mtx && !is_locked) {
            mtx->lock();
            is_locked = true;
        }
    }

    void unlock() {
        if (mtx && is_locked) {
            mtx->unlock();
            is_locked = false;
        }
    }

    bool owns_lock() const { return is_locked; }
    Mutex* mutex() const { return mtx; }
};

class condition_variable {
public:
    condition_variable() = default;
    ~condition_variable() = default;
    condition_variable(const condition_variable&) = delete;
    condition_variable& operator=(const condition_variable&) = delete;

    void notify_one() noexcept {}
    void notify_all() noexcept {}

    template <typename Predicate>
    void wait(unique_lock<mutex>& lock, Predicate pred) {
        while (!pred()) {
            lock.unlock();
            Sleep(1);
            lock.lock();
        }
    }
};

namespace this_thread {
    template <typename Rep, typename Period>
    inline void sleep_for(const std::chrono::duration<Rep, Period>& duration) {
        auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(duration).count();
        Sleep(static_cast<DWORD>(ms));
    }
}

template <typename T>
class future {
private:
    std::shared_ptr<T> result_ptr;
    std::shared_ptr<bool> ready_ptr;
public:
    future() : result_ptr(std::make_shared<T>()), ready_ptr(std::make_shared<bool>(false)) {}
    future(std::shared_ptr<T> r, std::shared_ptr<bool> ready) : result_ptr(r), ready_ptr(ready) {}

    T get() {
        while (!(*ready_ptr)) {
            Sleep(1);
        }
        return *result_ptr;
    }

    bool valid() const { return result_ptr != nullptr; }
};

class thread {
private:
    HANDLE handle;
    std::function<void()>* task_func;

    static DWORD WINAPI ThreadProc(LPVOID param) {
        auto func = reinterpret_cast<std::function<void()>*>(param);
        if (func && *func) {
            (*func)();
        }
        delete func;
        return 0;
    }

public:
    thread() : handle(NULL), task_func(nullptr) {}

    template <typename Callable, typename... Args>
    explicit thread(Callable&& f, Args&&... args) {
        auto bound_task = new std::function<void()>(std::bind(std::forward<Callable>(f), std::forward<Args>(args)...));
        task_func = bound_task;
        handle = CreateThread(NULL, 0, ThreadProc, bound_task, 0, NULL);
    }

    ~thread() {
        if (joinable()) {
            join();
        }
    }

    thread(thread&& other) noexcept : handle(other.handle), task_func(other.task_func) {
        other.handle = NULL;
        other.task_func = nullptr;
    }

    thread& operator=(thread&& other) noexcept {
        if (this != &other) {
            if (joinable()) join();
            handle = other.handle;
            task_func = other.task_func;
            other.handle = NULL;
            other.task_func = nullptr;
        }
        return *this;
    }

    bool joinable() const { return handle != NULL; }

    void join() {
        if (handle != NULL) {
            WaitForSingleObject(handle, INFINITE);
            CloseHandle(handle);
            handle = NULL;
        }
    }
};

} // namespace std

#else
// Standard C++ compliant systems (Linux, GCC 11+, Clang, MSVC)
#include <mutex>
#include <thread>
#include <condition_variable>
#include <future>
#endif
