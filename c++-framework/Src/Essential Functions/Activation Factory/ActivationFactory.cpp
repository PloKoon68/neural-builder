//#include "ActivationFunction.h"

#include "../../../Include/Essential Functions/Activation Factory/ActivationFactory.h"
#include "../../../Include/Essential Functions/Activation Factory/Activations Functions/Sigmoid.h"
#include "../../../Include/Essential Functions/Activation Factory/Activations Functions/Relu.h"
#include "../../../Include/Essential Functions/Activation Factory/Activations Functions/LeakyRelu.h"
#include "../../../Include/Essential Functions/Activation Factory/Activations Functions/Tanh.h"
#include "../../../Include/Essential Functions/Activation Factory/Activations Functions/Softmax.h"


#include <iostream>  //for string

ActivationFunction* ActivationFactory::getActivationClass(const std::string& name) {
    if (name == "sigmoid") 
        return new Sigmoid();
    else if (name == "tanh")
        return new Tanh(); 
    else if (name == "relu")
        return new Relu();
    else if (name == "leaky relu")
        return new LeakyRelu();
    else if (name == "softmax")
        return new Softmax();
    else 
        throw std::invalid_argument("Unknown activation function: " + name);
}
