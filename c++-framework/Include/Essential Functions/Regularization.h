#ifndef REGULARIZER_H
#define REGULARIZER_H

#include <vector>
#include "../Layer Types/Layer.h"


class L2Regularizer {
public:
    static void apply(std::vector<std::vector<double>>& weights, double& lambda, int& m);
    static double weightSquareSum(std::vector<std::vector<double>> weights);
    static double calculateLayerPenalty(const std::vector<std::vector<double>>& weights, const double& lambda, int& m);
    static double calculateNeuralNetworkPenalty(const std::vector<Layer*>& layers, int& m);
};

class Dropout {
public:
    static std::vector<std::vector<double>> applyForward(std::vector<std::vector<double>>& A, double& keepProb);
    static void applyBackward(std::vector<std::vector<double>>& dA, std::vector<std::vector<double>>& dropout, double& keepProb);
};

#endif
