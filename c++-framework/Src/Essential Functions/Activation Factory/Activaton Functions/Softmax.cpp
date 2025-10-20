#include "../../../../Include/Essential Functions/Activation Factory/Activations Functions/Softmax.h"

#include <cmath>   // For exp
#include <numeric> // For std::accumulate
#include <algorithm> // For max_element

// Activate a single scalar input (not applicable for softmax, returns unchanged)
double Softmax::activate(const double& input) const {
    return input; // Softmax is typically applied to vectors, not scalars
}

// Activate a single vector
std::vector<double> Softmax::activate(const std::vector<double>& input) const {
    // Step 1: Find the maximum value for numerical stability
    double maxVal = *std::max_element(input.begin(), input.end());

    // Step 2: Compute exponentials of (input - maxVal)
    std::vector<double> results(input.size());
    double sumExp = 0;
    for (int i = 0; i < input.size(); ++i) {
        double val = std::exp(input[i] - maxVal);
        sumExp += val;
        results[i] = val;
    }

    // Normalize to compute softmax probabilities
    for (int i = 0; i < input.size(); ++i) 
        results[i] = results[i] / sumExp;

    return results;
}

// Activate a matrix (softmax is applied row-wise)
std::vector<std::vector<double>> Softmax::activate(const std::vector<std::vector<double>>& input) const {
    int n = input.size(), m = input[0].size();
    std::vector<std::vector<double>> results = input;
    for (int j = 0; j < m; j++) {
        //find max val to scale
        double max = results[0][j];
        for (int i = 1; i < n; i++)
            if (max < results[i][j]) max = results[i][j];
        
        double sum = 0;
        for (int i = 0; i < n; i++) {
            double val = std::exp(results[i][j] - max);  //first scale with max
            sum += val;
            results[i][j] = val;
        }
        for (int i = 0; i < n; i++)
            results[i][j] /= sum;
    }

    return results;
}



// Derivative for a single scalar input (not applicable for softmax, returns zero)
double Softmax::derivative(const double& input) const {
    return 0.0; // Not meaningful for a single scalar
}

// Derivative for a vector
std::vector<double> Softmax::derivative(const std::vector<double>& input) const {
    std::vector<double> softmaxOutput = activate(input);

    // Compute derivative (Jacobian diagonal approximation)
    std::vector<double> derivatives(input.size());
    for (int i = 0; i < input.size(); ++i) {
        derivatives[i] = softmaxOutput[i] * (1.0 - softmaxOutput[i]);
    }

    return derivatives;
}

// Derivative for a matrix (softmax derivative is applied row-wise)
std::vector<std::vector<double>> Softmax::derivative(const std::vector<std::vector<double>>& input) const {
    /*
    std::vector<std::vector<double>> derivatives;
    for (const auto& row : input) {
        derivatives.push_back(derivative(row));
    }
    return derivatives;
    */
    return input;
}
