// Initialization.h
#pragma once
#include <vector>
#include <string>

class Initializer {
public:
    static std::vector<std::vector<double>> initialize(const std::string& method, int inputSize, int outputSize);

private:
    static std::vector<std::vector<double>> xavier(int inputSize, int outputSize);
    static std::vector<std::vector<double>> he(int inputSize, int outputSize);
    static std::vector<std::vector<double>> xavierUniform(int inputSize, int outputSize);
};
