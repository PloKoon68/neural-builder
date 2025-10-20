#include "../../../../Include/Essential Functions/Activation Factory/Activations Functions/Sigmoid.h"

#include <cmath>
#include <vector>

double Sigmoid::activate(const double& input) const {
    return (1.0 / (1.0 + std::exp(-input)));
}

std::vector<double> Sigmoid::activate(const std::vector<double>& input) const {
    std::vector<double> output;
    output.reserve(input.size());
    for (double x : input) {
        output.push_back(1.0 / (1.0 + std::exp(-x)));
    }
    return output;
}

std::vector<std::vector<double>> Sigmoid::activate(const std::vector<std::vector<double>>& input) const {
    std::vector<std::vector<double>> output;
    int row = input.size(), col = input[0].size();
    output.resize(row, std::vector<double>(col));

    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++)
            output[i][j] = 1.0 / (1.0 + std::exp(-input[i][j]));

    return output;
}

double Sigmoid::derivative(const double& a) const {
    return a * (1 - a);
}
//vector input derivative
std::vector<double> Sigmoid::derivative(const std::vector<double>& a) const {
    std::vector<double> daz;
    daz.reserve(a.size());
    for (double x : a) {
        double sigmoid_x = 1.0 / (1.0 + std::exp(-x));
        daz.push_back(sigmoid_x * (1.0 - sigmoid_x));
    }
    return daz;
}

std::vector<std::vector<double>> Sigmoid::derivative(const std::vector<std::vector<double>>& a) const {
    std::vector<std::vector<double>> daz;
    int row = a.size(), col = a[0].size();
    daz.resize(row, std::vector<double>(col));

    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++)
            daz[i][j] = a[i][j] * (1 - a[i][j]);

    return daz;
}