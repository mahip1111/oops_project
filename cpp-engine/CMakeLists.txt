cmake_minimum_required(VERSION 3.15)
project(QuickFlowCppEngine VERSION 2.6 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(.)

# Collect all core library sources (excluding entrypoints)
file(GLOB_RECURSE LIB_SOURCES
    "domain/*.cpp"
    "warehouse/*.cpp"
    "core/*.cpp"
    "routing/*.cpp"
    "pipeline/*.cpp"
    "observer/*.cpp"
    "simulation/*.cpp"
    "demo/*.cpp"
)

# Main Engine Executable Target
add_executable(quickflow_engine
    main.cpp
    ${LIB_SOURCES}
)

# Automated Test Harness Target
add_executable(quickflow_tests
    tests/unit_tests.cpp
    ${LIB_SOURCES}
)

enable_testing()
add_test(NAME QuickFlowUnitTests COMMAND quickflow_tests)
