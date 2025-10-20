#ifndef LOSS_FACTORY_H
#define LOSS_FACTORY_H

#include <string>
#include "./Loss Functions/LossFunction.h"

class LossFactory {
public:
    static LossFunction* getLossClass(const std::string& name);
};

#endif
