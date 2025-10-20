#include "../../../../Include/Essential Functions/Activation Factory/Activations Functions/Relu.h"

#include <vector>
#include <algorithm>

// ReLU Activation Function

double Relu::activate(const double& input) const {
    return std::max(0.0, input);
}

std::vector<double> Relu::activate(const std::vector<double>& input) const {
    std::vector<double> output;
    output.reserve(input.size());
    for (double x : input) 
        output.push_back(std::max(0.0, x));
    return output;
}

std::vector<std::vector<double>> Relu::activate(const std::vector<std::vector<double>>& input) const {
    std::vector<std::vector<double>> output;
    int row = input.size(), col = input[0].size();
    output.resize(row, std::vector<double>(col));
    
    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++)
            output[i][j] = std::max(0.0, input[i][j]);

    return output;
}


// ReLU Derivative Function
double Relu::derivative(const double& a) const {
    return a > 0;
}

// Vector input derivative
std::vector<double> Relu::derivative(const std::vector<double>& a) const {
    std::vector<double> daz;
    daz.reserve(a.size());
    for (double x : a) 
        daz.push_back(x > 0);
    return daz;
}

std::vector<std::vector<double>> Relu::derivative(const std::vector<std::vector<double>>& a) const {
    std::vector<std::vector<double>> daz;
    int row = a.size(), col = a[0].size();
    daz.resize(row, std::vector<double>(col));

    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++)
            daz[i][j] = a[i][j] > 0;

    return daz;
}
