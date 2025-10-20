#ifndef MODEL_EVALUATOR_H
#define MODEL_EVALUATOR_H

#include <string>

#include "./Loss Factory/Loss Functions/LossFunction.h"

class ModelEvaluator {
public:
    static double accuracy(const std::vector<std::vector<double>>& predictions, const std::vector<std::vector<double>>& targets, LossFunction* lossFunction);
};

#endif
