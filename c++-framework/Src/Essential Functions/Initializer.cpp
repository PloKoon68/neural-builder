// Initialization.cpp
#include "../../Include/Essential Functions/Initializer.h"

#include <cmath>
#include <random>
#include <stdexcept>

std::vector<std::vector<double>> Initializer::initialize(const std::string& methodName, int inputSize, int outputSize) {
    if (methodName == "he") {
        return he(inputSize, outputSize);
    }
    else if (methodName == "xavier") {
        return xavier(inputSize, outputSize);
    }
    else if (methodName == "xavier uniform") {
        return xavierUniform(inputSize, outputSize);
    }
    else {
        throw std::invalid_argument("Unknown initialization method: " + methodName);
    }
}

std::vector<std::vector<double>> Initializer::he(int inputSize, int outputSize) {
    double stddev = std::sqrt(2.0 / inputSize);
    std::vector<std::vector<double>> weights(outputSize, std::vector<double>(inputSize));

    std::random_device rd;
    std::mt19937 gen(rd());
    std::normal_distribution<> dis(0, stddev);

    for (auto& row : weights)
        for (auto& weight : row)
            weight = dis(gen);

    return weights;
}

std::vector<std::vector<double>> Initializer::xavier(int inputSize, int outputSize) {
    double limit = std::sqrt(6.0 / (inputSize + outputSize));
    std::vector<std::vector<double>> weights(outputSize, std::vector<double>(inputSize));

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> dis(-limit, limit);

    for (auto& row : weights)
        for (auto& weight : row)
            weight = dis(gen);

    return weights;
}

std::vector<std::vector<double>> Initializer::xavierUniform(int inputSize, int outputSize) {
    double limit = std::sqrt(3.0 / inputSize);
    std::vector<std::vector<double>> weights(outputSize, std::vector<double>(inputSize));
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> dis(-limit, limit);

    for (auto& row : weights)
        for (auto& weight : row)
            weight = dis(gen);

    return weights;
}
