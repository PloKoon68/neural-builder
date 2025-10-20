# =========================================================================
# STAGE 1: The Builder
#
# This stage uses a full OS with all build tools (g++, CMake) to compile
# the application with maximum optimization for a production environment.
# =========================================================================
FROM ubuntu:22.04 AS builder

# Set an environment variable to prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install essential build tools, CMake, and Crow's dependencies (Boost)
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libboost-all-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the source code into the container. The .dockerignore file will ensure
# that local build artifacts and IDE folders are not included.
COPY . .

# --- PRODUCTION OPTIMIZATION ---
# Configure the project with CMake, specifying a 'Release' build type.
# This enables compiler optimizations (like -O3) and removes debug symbols,
# resulting in a smaller and significantly faster executable.
RUN cmake -B build -S . -DCMAKE_BUILD_TYPE=Release

# Build the project using the generated Release configuration.
RUN cmake --build build


# =========================================================================
# STAGE 2: The Final Production Image
#
# This stage creates the final, lightweight image. It starts from a clean
# base and copies ONLY the compiled binary and its essential runtime
# libraries from the builder stage.
# =========================================================================
FROM ubuntu:22.04

# Install only the runtime dependencies needed for the executable.
# These are the shared libraries (.so files) that the compiled binary links against.
RUN apt-get update && apt-get install -y \
    libboost-system1.74.0 \
    libboost-thread1.74.0 \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy ONLY the optimized application binary from the builder stage.
# The path /app/build/out/server comes from your CMakeLists.txt configuration.
COPY --from=builder /app/build/out/server .

# Add execute permissions to the binary, which is crucial for it to run.
RUN chmod +x ./server

# Expose the port that the Crow application will listen on.
EXPOSE 18080

# The command to run your application when the container starts.
# This will execute the optimized './server' binary.
CMD ["./server"]