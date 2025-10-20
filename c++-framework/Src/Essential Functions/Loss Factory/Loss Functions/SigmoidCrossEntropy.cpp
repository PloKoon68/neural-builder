
#include "../../../../Include/Essential Functions/Loss Factory/Loss Functions/SigmoidCrossEntropy.h"

#include <cmath>
#include <stdexcept>



constexpr double epsilon = 1e-10;

//calculate overload
double SigmoidCrossEntropy::calculateLoss(const double& prediction, const double& target) const {
    return -(target * log(prediction) + (1 - target) * log(1 - prediction));
}

double SigmoidCrossEntropy::calculateLoss(const std::vector<double>& predictions,
    const std::vector<double>& targets) const {
    if (predictions.size() != targets.size()) {
        throw std::invalid_argument("Predictions and targets must be the same size");
    }

    int len = predictions.size();
    double sum = 0;

    for (int i = 0; i < len; ++i) {
        double pred = predictions[i];
        double target = targets[i];
        sum -= (target * log(pred) + (1 - target) * log(1 - pred));
    }
    return sum / len;
}


double SigmoidCrossEntropy::calculateLoss(const std::vector<std::vector<double>>& predictions,
    const std::vector<std::vector<double>>& targets) const {
   /*
    if (predictions.size() != targets.size() || predictions[0].size() != targets[0].size()) {
        throw std::invalid_argument("Predictions and targets must be the same size");
    }
    */
    int n = predictions.size();
    int m = predictions[0].size();
    double sum = 0;

    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            double pred = predictions[i][j];
            double target = targets[i][j];
            sum -= (target * log(pred) + (1 - target) * log(1 - pred));
        }
    }
    return sum / m;
}


//derivatives overload

double SigmoidCrossEntropy::derivative(const double& prediction, const double& target) const {
    return (prediction - target) / (prediction * (1 - prediction) + epsilon);
}


std::vector<double> SigmoidCrossEntropy::derivative(const std::vector<double>& prediction, const std::vector<double>& target) const {

    int len = prediction.size();
    std::vector<double> results(len);

    for (int i = 0; i < len; i++)
        results[i] = (prediction[i] - target[i]) / (prediction[i] * (1 - prediction[i]) + epsilon);

    return results;
}


std::vector<std::vector<double>> SigmoidCrossEntropy::derivative(const std::vector<std::vector<double>>& predictions,
    const std::vector<std::vector<double>>& targets) const {
   /*
    if (predictions.size() != targets.size() || predictions[0].size() != targets[0].size()) {
        throw std::invalid_argument("Predictions and targets must be the same size");
    }
    */

    int n = predictions.size();
    int m = predictions[0].size();
    std::vector<std::vector<double>> lossDerivatives(n, std::vector<double>(m));
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < m; ++j) {
            double pred = predictions[i][j];
            double target = targets[i][j];
            lossDerivatives[i][j] = (pred - target) / (pred * (1 - pred) + epsilon);
        }
    }
    return lossDerivatives;
}
