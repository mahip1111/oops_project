#include "core/ThreadPool.hpp"

ThreadPool::ThreadPool(size_t threads) : stop(false) {
    for (size_t i = 0; i < threads; ++i) {
        workers.emplace_back([this] {
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

ThreadPool::~ThreadPool() {
    stop = true;
    condition.notify_all();
    for (std::thread &worker : workers) {
        if (worker.joinable()) {
            worker.join();
        }
    }
}
