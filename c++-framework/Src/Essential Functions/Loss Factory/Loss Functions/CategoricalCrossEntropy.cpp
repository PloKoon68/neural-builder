
#include "../../../../Include/Essential Functions/Loss Factory/Loss Functions/CategoricalCrossEntropy.h"

#include <cmath>
#include <stdexcept>



constexpr double epsilon = 1e-10;

//calculate overload
double CategoricalCrossEntropy::calculateLoss(const double& prediction, const double& target) const {
    return -(target * log(prediction) + epsilon);
}

double CategoricalCrossEntropy::calculateLoss(const std::vector<double>& predictions,
    const std::vector<double>& targets) const {
    
    size_t sz = predictions.size();
    double totalLoss = 0.0;

        for (size_t classIdx = 0; classIdx < predictions.size(); ++classIdx) {
            if (targets[classIdx] == 1.0) { // True class
                totalLoss = -log(predictions[classIdx] + epsilon);
                break; // Skip the rest of the classes
            }
        }

    return totalLoss;
}

/*
double CategoricalCrossEntropy::calculateLoss(
    const std::vector<std::vector<double>>& predictions,
    const std::vector<std::vector<double>>& targets) const {

    int batchSize = predictions[0].size();
    double totalLoss = 0.0;

    for (int sampleIdx = 0; sampleIdx < batchSize; ++sampleIdx) {
        for (int classIdx = 0; classIdx < predictions.size(); ++classIdx) {
            if (targets[classIdx][sampleIdx] == 1.0) { // True class
                totalLoss += -log(predictions[classIdx][sampleIdx] + epsilon);
                break; // Skip the rest of the classes
            }
        }
    }

    return totalLoss / batchSize; // Average loss
}
*/




//derivatives overload

double CategoricalCrossEntropy::derivative(const double& prediction, const double& target) const {
    return (prediction - target) / (prediction * (1 - prediction) + epsilon);
}


std::vector<double> CategoricalCrossEntropy::derivative(const std::vector<double>& prediction, const std::vector<double>& target) const {

    int len = prediction.size();
    std::vector<double> gradients(len);

    for (int i = 0; i < len; i++)
        gradients[i] = prediction[i] - target[i];;

    return gradients;
}



/*

std::vector<std::vector<double>> CategoricalCrossEntropy::derivative(
    const std::vector<std::vector<double>>& predictions,
    const std::vector<std::vector<double>>& targets) const {

    int n = predictions.size();
    int m = predictions[0].size();

    std::vector<std::vector<double>> gradients(n, std::vector<double>(m));
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < m; ++j) 
            gradients[i][j] = predictions[i][j] - targets[i][j]; // Simplified gradient
   
     return gradients;
}*/





//new one !!!!!!!
double CategoricalCrossEntropy::calculateLoss(
    const std::vector<std::vector<double>>& predictions,
    const std::vector< std::vector<double>>& targets) const {

    int batchSize = predictions[0].size();
    double totalLoss = 0.0;

    for (int sampleIdx = 0; sampleIdx < batchSize; ++sampleIdx) {
        int targetInd = targets[0][sampleIdx];
        totalLoss += -log(predictions[targetInd][sampleIdx] + epsilon);
    }

    return totalLoss / batchSize; // Average loss
}

std::vector<std::vector<double>> CategoricalCrossEntropy::derivative(
    const std::vector<std::vector<double>>& predictions,
    const std::vector< std::vector<double>>& targets) const {

    int n = predictions.size();
    int batchSize = predictions[0].size();

    std::vector<std::vector<double>> gradients = predictions;
    for (int sampleIdx = 0; sampleIdx < batchSize; ++sampleIdx) {
        int targetInd = targets[0][sampleIdx];
        gradients[targetInd][sampleIdx] = predictions[targetInd][sampleIdx] - 1; // Simplified gradient
    }

    return gradients;
}

