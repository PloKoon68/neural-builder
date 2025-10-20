#ifndef DENSE_LAYER_H
#define DENSE_LAYER_H

#include "Layer.h" 
#include "../Essential Functions/Activation Factory/Activations Functions/ActivationFunction.h" 


class DenseLayer : public Layer {
private:
    int input_size;
    int output_size;

    double learningRate;

    double lambda;
    double keepProb;
    std::vector<std::vector<double>> dropoutMask;


    std::vector<std::vector<double>> w;
    std::vector<double> b;

    std::vector<std::vector<double>> dw;
    std::vector<double> db;

    std::vector<std::vector<double>> z;
    std::vector<std::vector<double>> a;
    std::vector<std::vector<double>> aPrev;

    ActivationFunction* activationFunction;
    std::string activationFunc;

    void initParameters() override;
    void initParameters(std::string& initType);
    void initDerivatives() override;

public:

    DenseLayer(const int& input_size, const int& output_size, double learningRate, std::string activationFunc, double keepProb = 1, double lambda = 0, std::string initializer = "");
    std::vector<std::vector<double>> forward(const std::vector<std::vector<double>>& input) override;
    std::vector<std::vector<double>> backward(std::vector<std::vector<double>>& dA) override;

    std::vector<std::vector<double>> forwardOpt(const std::vector<std::vector<double>>& input) override;
    std::vector<std::vector<double>> predict(const std::vector<std::vector<double>>& input) override;
    std::vector<std::vector<double>> predictOpt(const std::vector<std::vector<double>>& input, const std::vector<std::vector<double>>& result);

    const std::vector<std::vector<double>>& getWeights() const override;
    const std::vector<double>& getBiases() const override;

    void setWeights(std::vector<std::vector<double>>& weights) override;

    const double& getLambda() const override;

    void display() const override;
};

#endif 
