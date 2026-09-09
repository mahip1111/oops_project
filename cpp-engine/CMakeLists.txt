cmake_minimum_required(VERSION 3.15)
project(QuickFlowCppEngine VERSION 2.6 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

add_executable(quickflow_engine
    src/main.cpp
)
