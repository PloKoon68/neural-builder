cmake_minimum_required(VERSION 3.15)
project(DeepLearningServer)

# Set C++ version
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Output directory
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/out)

# Source files
file(GLOB_RECURSE SRC_FILES CONFIGURE_DEPENDS "Src/*.cpp")

# Executable target
add_executable(server ${SRC_FILES})

# Include directories (for server target only)
target_include_directories(server PRIVATE
    ${CMAKE_SOURCE_DIR}/lib      # for crow.h and crow/
    ${CMAKE_SOURCE_DIR}/lib/asio/include
)

# pthread (for multithreaded Crow server on Linux)
if(UNIX)
    target_link_libraries(server pthread)
endif()

# Optional: show status
message(STATUS "Building project ${PROJECT_NAME}")
message(STATUS "Source files: ${SRC_FILES}")
