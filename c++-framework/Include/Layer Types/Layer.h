#ifndef LAYER_H
#define LAYER_H

#include <vector>
#include <iostream>

class Layer {
public:
    // Virtual destructor for proper cleanup of derived classes
    virtual ~Layer() {}

    virtual void initParameters() = 0;
    virtual void initDerivatives() = 0;
    virtual std::vector<std::vector<double>> forward(const std::vector<std::vector<double>>& input) = 0;
    virtual std::vector<std::vector<double>> backward(std::vector<std::vector<double>>& input) = 0;

    virtual std::vector<std::vector<double>> forwardOpt(const std::vector<std::vector<double>>& input) = 0;

    virtual std::vector<std::vector<double>> predict(const std::vector<std::vector<double>>& input) = 0;


    virtual const std::vector<std::vector<double>>& getWeights() const = 0;
    virtual const std::vector<double>& getBiases() const = 0;

    virtual void setWeights(std::vector<std::vector<double>>& weights) = 0;

    virtual const double& getLambda() const = 0;


    //add backward

    // Pure virtual function to display the layer's details
    virtual void display() const = 0;
};


#endif 
