// Regularizer.h
#include "../../Include/Essential Functions/Regularization.h"
#include "../../Include/Layer Types/Layer.h"

void L2Regularizer::apply(std::vector<std::vector<double>>& weights, double& lambda, int& m) {
    double coefficient = lambda / m;
    for (auto& row : weights)
        for (auto& weight : row)
            weight -= coefficient * weight;
}

double L2Regularizer::weightSquareSum(std::vector<std::vector<double>>weights) {
    double sumSqare = 0.0;
    for (const auto& row : weights)
        for (const auto& weight : row)
            sumSqare += weight * weight;
    return sumSqare;
}

// Calculate L2 penalty term for loss function
double L2Regularizer::calculateLayerPenalty(const std::vector<std::vector<double>>& weights, const double& lambda, int& m) {
    return weightSquareSum(weights) * lambda / (2 * m);
}

// Calculate L2 penalty term for loss function
//static double calculateNeuralNetworkPenalty(const std::vector<Layer*>& layers, int& m);
double L2Regularizer::calculateNeuralNetworkPenalty(const std::vector<Layer*>& layers, int& m) {

    double totalL2Penalty = 0.0;
    for (auto& layer : layers)
        if (layer->getLambda()) totalL2Penalty += calculateLayerPenalty(layer->getWeights(), layer->getLambda(), m);

    return totalL2Penalty;
}



//dropout methods
std::vector<std::vector<double>> Dropout::applyForward(std::vector<std::vector<double>>& A, double& keepProb) {
    int row = A.size(), col = A[0].size();
    std::vector<std::vector<double>> dropout(row, std::vector<double>(col));

    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++) {
            double gate = keepProb > (static_cast<double>(rand()) / static_cast<double>(RAND_MAX)); //random val between 0 and 1
            dropout[i][j] = gate;

            A[i][j] = A[i][j] * gate / keepProb; //a = a * (1 or 0) / keyProb
        }
    return dropout;
}

void Dropout::applyBackward(std::vector<std::vector<double>>& dA, std::vector<std::vector<double>>& dropout, double& keepProb) {
    int row = dA.size(), col = dA[0].size();

    for (int i = 0; i < row; i++)
        for (int j = 0; j < col; j++)
            dA[i][j] = dA[i][j] * dropout[i][j] / keepProb; //a = a * (1 or 0) / keyProb
}


/*
class Dropout {
public:
    static std::vector<std::vector<double>>& generateDropoutMask(std::vector<std::vector<double>>& A, double& keepProb) {
        int row = A.size(), col = A[0].size();
        std::vector<std::vector<double>> dropout(row, std::vector<double>(col));

        for (int i = 0; i < row; i++)
            for (int j = 0; j < col; j++) {
                dropout[i][j] = keepProb > (static_cast<double>(rand()) / static_cast<double>(RAND_MAX)); //random val between 0 and 1
            }
        return dropout;
    }

    static void applyDropout(std::vector<std::vector<double>>& matrix, std::vector<std::vector<double>>& dropout, double& keepProb) {
        int row = matrix.size(), col = matrix[0].size();
        std::vector<std::vector<double>> dropout(row, std::vector<double>(col));

        for (int i = 0; i < row; i++)
            for (int j = 0; j < col; j++)
                matrix[i][j] = matrix[i][j] * dropout[i][j] / keepProb; //a = a * (1 or 0) / keyProb
    }
};
*/