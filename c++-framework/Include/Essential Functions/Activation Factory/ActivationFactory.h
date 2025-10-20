#ifndef ACTIVATION_H
#define ACTIVATION_H

#include <string>

class ActivationFunction;

class ActivationFactory {
public:
    static ActivationFunction* getActivationClass(const std::string& name);
};

#endif






