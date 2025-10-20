#ifndef ACTIVATION_FUNCTION_H
#define ACTIVATION_FUNCTION_H

#include <vector>

class ActivationFunction {
public:
    virtual ~ActivationFunction() {}

    virtual double activate(const double& input) const = 0;
    virtual std::vector<double> activate(const std::vector<double>& input) const = 0;
    virtual std::vector<std::vector<double>> activate(const std::vector<std::vector<double>>& input) const = 0;

    virtual double derivative(const double& input) const = 0;
    virtual std::vector<double> derivative(const std::vector<double>& input) const = 0;
    virtual std::vector<std::vector<double>> derivative(const std::vector<std::vector<double>>& input) const = 0;
};

#endif 
