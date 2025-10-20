#include "../../../../Include/Essential Functions/Activation Factory/Activations Functions/Tanh.h"

#include <cmath>
#include <vector>

double Tanh::activate(const double& a) const {
    return std::tanh(a);
}

std::vector<double> Tanh::activate(const std::vector<double>& a) const {
    std::vector<double> output;
    output.reserve(a.size());
    for (double x : a) {
        output.push_back(std::tanh(x));
    }
    return output;
}

std::vector<std::vector<double>> Tanh::activate(const std::vector<std::vector<double>>& a) const {
    std::vector<std::vector<double>> output;
    int row = a.size(), col = a[0].size();
    output.resize(row, std::vector<double>(col));

    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++)
            output[i][j] = std::tanh(a[i][j]);

    return output;
}

// Tanh Derivative Function

double Tanh::derivative(const double& a) const {
    return 1.0 - a*a;
}

// Vector input derivative
std::vector<double> Tanh::derivative(const std::vector<double>& a) const {
    std::vector<double> daz;
    daz.reserve(a.size());
    for (double x : a) 
        daz.push_back(1.0 - x*x);
    return daz;
}

std::vector<std::vector<double>> Tanh::derivative(const std::vector<std::vector<double>>& a) const {
    std::vector<std::vector<double>> daz;
    int row = a.size(), col = a[0].size();
    daz.resize(row, std::vector<double>(col));

    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++)
            daz[i][j] = 1.0 - a[i][j]*a[i][j];

    return daz;
}
