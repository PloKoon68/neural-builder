#ifndef CATEGORICAL_CROSS_ENTROPY_H
#define CATEGORICAL_CROSS_ENTROPY_H

#include "LossFunction.h"

class CategoricalCrossEntropy : public LossFunction {
public:
    // Override for vector input
    double calculateLoss(const std::vector<std::vector<double>>& predictions,
        const std::vector<std::vector<double>>& targets) const override;
    double calculateLoss(const std::vector<double>& predictions,
        const std::vector<double>& targets) const override;
    // Override for single value input
    double calculateLoss(const double& prediction, const double& target) const override;

    /*
    double calculateLoss(const std::vector<std::vector<double>>& predictions, const std::vector<double>& indexes) const;
    std::vector<std::vector<double>> derivative(const std::vector<std::vector<double>>& predictions, const std::vector<double>& indexes) const;
    */
    // Override derivative methods
    std::vector < std::vector<double>> derivative(const std::vector<std::vector<double>>& predictions,
        const std::vector<std::vector<double>>& targets) const override;
    double derivative(const double& prediction, const double& target) const override;
    std::vector<double> derivative(const std::vector<double>& prediction, const std::vector<double>& target) const override;
};

#endif