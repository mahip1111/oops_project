#pragma once
#include <vector>
#include <queue>
#include <functional>
#include <atomic>
#include <iostream>
#include <memory>
#include "Compat.hpp"

class ThreadPool {
private:
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> taskQueue;
    std::mutex queueMutex;
    std::condition_variable condition;
    std::atomic<bool> stop;

public:
    ThreadPool(size_t threads = 4) : stop(false) {
        for (size_t i = 0; i < threads; ++i) {
            workers.emplace_back([this, i] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(this->queueMutex);
                        this->condition.wait(lock, [this] {
                            return this->stop || !this->taskQueue.empty();
                        });

                        if (this->stop && this->taskQueue.empty()) {
                            return;
                        }

                        task = std::move(this->taskQueue.front());
                        this->taskQueue.pop();
                    }
                    task();
                }
            });
        }
    }

#if defined(_WIN32) && defined(__MINGW32__) && !defined(_GLIBCXX_HAS_GTHREADS)
    template<class F, class... Args>
    auto enqueue(F&& f, Args&&... args) -> std::future<decltype(f(args...))> {
        using return_type = decltype(f(args...));

        auto result_val = std::make_shared<return_type>();
        auto ready_flag = std::make_shared<bool>(false);
        auto bound_task = std::bind(std::forward<F>(f), std::forward<Args>(args)...);

        auto wrapper = [bound_task, result_val, ready_flag]() mutable {
            *result_val = bound_task();
            *ready_flag = true;
        };

        {
            std::unique_lock<std::mutex> lock(queueMutex);
            if (stop) {
                throw std::runtime_error("enqueue on stopped ThreadPool");
            }
            taskQueue.emplace(wrapper);
        }
        condition.notify_one();
        return std::future<return_type>(result_val, ready_flag);
    }
#else
    template<class F, class... Args>
    auto enqueue(F&& f, Args&&... args) -> std::future<decltype(f(args...))> {
        using return_type = decltype(f(args...));

        auto task = std::make_shared<std::packaged_task<return_type()>>(
            std::bind(std::forward<F>(f), std::forward<Args>(args)...)
        );

        std::future<return_type> res = task->get_future();
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            if (stop) {
                throw std::runtime_error("enqueue on stopped ThreadPool");
            }
            taskQueue.emplace([task]() { (*task)(); });
        }
        condition.notify_one();
        return res;
    }
#endif

    ~ThreadPool() {
        stop = true;
        condition.notify_all();
        for (std::thread &worker : workers) {
            if (worker.joinable()) {
                worker.join();
            }
        }
    }
};
