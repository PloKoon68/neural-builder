#include "../../../../Include/Essential Functions/Activation Factory/Activations Functions/LeakyRelu.h"

#include <vector>
#include <algorithm>

// ReLU Activation Function

double LeakyRelu::activate(const double& input) const {
    return std::max(0.01 * input, input);
}

std::vector<double> LeakyRelu::activate(const std::vector<double>& input) const {
    std::vector<double> output;
    output.reserve(input.size());
    for (double x : input)
        output.push_back(std::max(0.01*x, x));
    return output;
}

std::vector<std::vector<double>> LeakyRelu::activate(const std::vector<std::vector<double>>& input) const {
    std::vector<std::vector<double>> output;
    int row = input.size(), col = input[0].size();
    output.resize(row, std::vector<double>(col));

    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++)
            output[i][j] = std::max(0.01*input[i][j], input[i][j]);

    return output;
}


// ReLU Derivative Function
double LeakyRelu::derivative(const double& a) const {
    return a > 0 ? 1.0 : 0.01;
}

// Vector input derivative
std::vector<double> LeakyRelu::derivative(const std::vector<double>& a) const {
    std::vector<double> daz;
    daz.reserve(a.size());
    for (double x : a)
        daz.push_back(x > 0 ? 1.0 : 0.01);
    return daz;
}

std::vector<std::vector<double>> LeakyRelu::derivative(const std::vector<std::vector<double>>& a) const {
    std::vector<std::vector<double>> daz;
    int row = a.size(), col = a[0].size();
    daz.resize(row, std::vector<double>(col));

    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++)
            daz[i][j] = a[i][j] > 0 ? 1.0 : 0.01;

    return daz;
}
