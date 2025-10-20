#include "../../../Include/Essential Functions/Loss Factory/LossFactory.h"
#include "../../../Include/Essential Functions/Loss Factory/Loss Functions/SigmoidCrossEntropy.h"
#include "../../../Include/Essential Functions/Loss Factory/Loss Functions/CategoricalCrossEntropy.h"


#include <iostream>

LossFunction* LossFactory::getLossClass(const std::string& name) {
    if (name == "sigmoid cross entropy")
        return new SigmoidCrossEntropy();
    else if (name == "categorical cross entropy") {
        return new CategoricalCrossEntropy();
    }
    else if (name == "adam") {
        // Return instance of ReLU loss class if you have one
    }
    else if (name == "mse") {
        // Return instance of Tanh loss class if you have one
    }
    else {
        throw std::invalid_argument("Unknown loss function: " + name);
    }
}

// Explicit template instantiation (optional if you know the types you'll use)
