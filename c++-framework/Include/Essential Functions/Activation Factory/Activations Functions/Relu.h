#ifndef RELU_H
#define RELU_H
#include "ActivationFunction.h"

class Relu : public ActivationFunction {
public:

    double activate(const double& input) const override;
    std::vector<double> activate(const std::vector<double>& input) const override;
    std::vector<std::vector<double>> activate(const std::vector<std::vector<double>>& input) const override;

    double derivative(const double& input) const override;
    std::vector<double> derivative(const std::vector<double>& input) const override;
    std::vector<std::vector<double>> derivative(const std::vector<std::vector<double>>& input) const override;
};

#endif 

