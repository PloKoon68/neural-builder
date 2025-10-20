#include <iostream>
#include <cstdlib> // For rand()

#include "../../Include/Layer Types/DenseLayer.h"

#include "../../Include/Essential Functions/Activation Factory/ActivationFactory.h"
#include "../../Include/Essential Functions/Activation Factory/Activations Functions/ActivationFunction.h"
#include "../../Include/Essential Functions/MathUtils.h"
#include "../../Include/Essential Functions/Regularization.h"
#include "../../Include/Essential Functions/Initializer.h"

DenseLayer::DenseLayer(const int& input_size, const int& output_size, double learningRate, std::string activationFunc, double keepProb, double lambda, std::string weightInitializeType)
    : input_size(input_size), output_size(output_size), learningRate(learningRate), keepProb(keepProb), lambda(lambda) {

    if (!weightInitializeType.size()) {
        weightInitializeType = activationFunc == "relu" ? "he" : "xavier";
    }
    initParameters(weightInitializeType);
    initDerivatives();

    this->activationFunc = activationFunc;
    activationFunction = ActivationFactory::getActivationClass(activationFunc);
}


void DenseLayer::initParameters(std::string& initType) {
    w = Initializer::initialize(initType, input_size, output_size);
 
    //Initialize bias with 0
    b.resize(output_size, 0.0);
}
void DenseLayer::initParameters() {
    // Initialize weights with random values 
    w.resize(output_size, std::vector<double>(input_size));
    for (int i = 0; i < output_size; ++i)
        for (int j = 0; j < input_size; ++j)
            w[i][j] = static_cast<double>(rand()) / RAND_MAX;
    //Initialize bias with 0
    b.resize(output_size, 0.0);
}

void DenseLayer::initDerivatives() {
    // Initialize derivatives with 0 value
    dw.resize(output_size, std::vector<double>(input_size, 0));
    db.resize(output_size, 0.0);
}

        
//take input a[l-1], return output a[l]
std::vector<std::vector<double>> DenseLayer::forward(const std::vector<std::vector<double>>& input) {
    int m = input[0].size();//number of data in batch
    
    z = MathUtils::elementWiseSum(MathUtils::dotProduct(w, input), b);  // z = w.aPrev + b
    a = activationFunction->activate(z);

    //dropout regularization
    if (keepProb < 1) {
        //method 1, readability
        //dropoutMask = Dropout::generateDropoutMask(a, keepProb);
        //Dropout::applyDropout(a, dropoutMask, keepProb);
        
        //method 2
        dropoutMask = Dropout::applyForward(a, keepProb);
    }


    aPrev = input;
    /*
    for (std::vector<double> row : a) {
        for (double col : row)
            std::cout << col << " ";
        std::cout << std::endl;
    }*/

    return a;
}

/*
std::vector<std::vector<double>> DenseLayer::predict(const std::vector<std::vector<double>>& input) {
    
    std::vector<std::vector<double>> r = MathUtils::dotProduct(w, input);
     r = MathUtils::dotProduct(w, input);
    r = MathUtils::elementWiseSum(r, b);
    r = activationFunction->activate(r);
    return r;

    return activationFunction->activate(MathUtils::elementWiseSum(MathUtils::dotProduct(w, input), b));
}
 */   

std::vector<std::vector<double>> DenseLayer::predict(const std::vector<std::vector<double>>& input) {
    int m = input[0].size();
    std::vector<std::vector<double>> result(output_size, std::vector<double>(m, 0));
    for (int i = 0; i < output_size; ++i)
        for (int j = 0; j < m; ++j) {
            for (int k = 0; k < input_size; ++k)
                result[i][j] += w[i][k] * input[k][j];
            result[i][j] = activationFunction->activate(result[i][j] + b[i]);
        }
    return result;
}


/*awsaa
std::vector<std::vector<double>> DenseLayer::predictOpt(const std::vector<std::vector<double>>& input, const std::vector<std::vector<double>>& result) {

    int m = input[0].size();
    std::vector<std::vector<double>> result;
    for (int i = 0; i < output_size; ++i)
        for (int j = 0; j < m; ++j) {
            for (int k = 0; k < input_size; ++k)
                result[i][j] += w[i][k] * input[k][j];
            result[i][j] = activationFunction->activate(result[i][j] + b[i]);
        }
    return result;
}
*/

/*
//backward
std::vector<std::vector<double>> DenseLayer::backward(std::vector<std::vector<double>>& da) {
    int m = da[0].size();

    std::vector<std::vector<double>> dz;

    //dz = daz * da
    dz = MathUtils::elementWiseProduct(activationFunction->derivative(a), da);

    //dw = (dz . aPrev^T) / m
    dw = MathUtils::elementWiseDivide(MathUtils::dotProduct(dz, MathUtils::transpose(aPrev)), m);

    // db = dz / m     -> dz sumed all m examples to a single columns and divided to m
    db = MathUtils::elementWiseDivide(MathUtils::dotProduct(dz, std::vector<double>(m, 1)), m);

    //daPrev = W^T . dt
    std::vector<std::vector<double>> daPrev = MathUtils::dotProduct(MathUtils::transpose(w), dz);

    //update w and b
    b = MathUtils::elementWiseSubtract(b, MathUtils::elementWiseProduct(db, learningRate));  // b = b - lr * db

    initDerivatives();

    return daPrev;
}
*/
//backward
std::vector<std::vector<double>> DenseLayer::backward(std::vector<std::vector<double>>& da) {
    int m = da[0].size();

    if (keepProb < 1) {
        //method 1, readability
        //Dropout::applyDropout(a, dropoutMask, keepProb);
        //method 2
        Dropout::applyBackward(da, dropoutMask, keepProb);
    }


    std::vector<std::vector<double>> dz;

    if (activationFunc == "softmax") dz = da;
    else dz = MathUtils::elementWiseProduct(activationFunction->derivative(a), da);
    //dz = daz * da

    //dw = (dz . aPrev^T) / m
    dw = MathUtils::elementWiseDivide(MathUtils::dotProduct(dz, MathUtils::transpose(aPrev)), m);

    //if lambda different than 0, apply l2 reg
    if (lambda) {
        L2Regularizer::apply(w, lambda, m);
    }

    // db = dz / m     -> dz sumed all m examples to a single columns and divided to m
    db = MathUtils::elementWiseDivide(MathUtils::dotProduct(dz, std::vector<double>(m, 1)), m);

    /*
    std::cout << "da:\n";
    for (const auto& row : da) {
        for (double w : row)
            std::cout << w << " ";
        std::cout << std::endl;
    }
    std::cout << "\n";


    std::cout << "dz:\n";
    for (const auto& row : dz) {
        for (double w : row)
            std::cout << w << " ";
        std::cout << std::endl;
    }
    std::cout << "\n";
    
    std::cout << "dw:\n";
    for (const auto& row : dw) {
        for (double w : row)
            std::cout << w << " ";
        std::cout << std::endl;
    }

    std::cout << "Weights before:\n";
    for (const auto& row : w) {
        for (double w : row)
            std::cout << w << " ";
        std::cout << std::endl;
    }
    std::cout << std::endl;
    std::cout << "Biases before:\n";
    for (const auto& b : b)
        std::cout << b << " ";
    std::cout << std::endl;*/

    //daPrev = W^T . dt
    std::vector<std::vector<double>> daPrev = MathUtils::dotProduct(MathUtils::transpose(w), dz);

    //update w and b
    w = MathUtils::elementWiseSubtract(w, MathUtils::elementWiseProduct(dw, learningRate));  // w = w - lr * dw
    b = MathUtils::elementWiseSubtract(b, MathUtils::elementWiseProduct(db, learningRate));  // b = b - lr * db

    /*
    std::cout << "Weights now:\n";
    for (const auto& row : w) {
        for (double w : row)
            std::cout << w << " ";
        std::cout << std::endl;

    }
    std::cout << std::endl;
    std::cout << "Biases now:\n";
    for (const auto& b : b)
        std::cout << b << " ";
    std::cout << std::endl;
    std::cout << "-----------------------------------------" << std::endl;
    std::cout << std::endl;
    std::cout << std::endl;
    */

    //reset derivatives
    initDerivatives();
    /*
    for (std::vector<double> row : da) {
        for (double col : row)
            std::cout << col << " ";
        std::cout << std::endl;
    }*/

    return daPrev;
}




void DenseLayer::display() const {
    std::cout << "-------------------------\n";

    std::cout << "Dense Layer Weights:\n";
    for (const auto& row : w) {
        for (double w : row) 
            std::cout << w << " ";
        std::cout << std::endl;
    }
    std::cout << std::endl;

    std::cout << "Dense Layer Biases:\n";
    for (const auto& b : b)
        std::cout << b << " ";
    std::cout << std::endl;
    std::cout << "-------------------------\n";
}

const std::vector<std::vector<double>>& DenseLayer::getWeights() const { return w; }
const std::vector<double>& DenseLayer::getBiases() const { return b; }
void DenseLayer::setWeights(std::vector<std::vector<double>>& weights) { w = weights; }

const double& DenseLayer::getLambda() const { return lambda; }










std::vector<std::vector<double>> DenseLayer::forwardOpt(const std::vector<std::vector<double>>& input) {
    int m = input[0].size();//number of data in batch

    z = std::vector<std::vector<double>>(output_size, std::vector<double>(m));
    a = std::vector<std::vector<double>>(output_size, std::vector<double>(m));

    for (int i = 0; i < output_size; ++i)
        for (int j = 0; j < m; ++j) {
            double val = 0;
            for (int k = 0; k < input_size; ++k)
                val += w[i][k] * input[k][j];
            z[i][j] = val + b[i];
            a[i][j] = activationFunction->activate(val + b[i]);
        }
    aPrev = input;
    return a;
}



/*
//backward
std::vector<std::vector<double>> DenseLayer::backwardOpt(const std::vector<std::vector<double>>& da) {
    int m = da[0].size();
    std::vector<std::vector<double>> dz(output_size, std::vector<double>(m));

    for (int i = 0; i < output_size; i++)
        for (int j = 0; j < m; j++)
            dz[i][j] = ((a[i][j] > 0) * da[i][j]);
    //                            dz
    //
    dz = MathUtils::elementWiseProduct(activationFunction->derivative(a), da);  //2 steps optimized

    std::vector<std::vector<double>> dw(output_size, std::vector<double>(w[0].size()));

    for (int i = 0; i < output_size; ++i)
        for (int j = 0; j < input_size; ++j)
            for (int k = 0; k < m; ++k)
                result[i][j] += matrix1[i][k] * matrix2[k][j];

    //transpose almadan dot product
    for (int i = 0; i < output_size; ++i)
        for (int j = 0; j < input_size; ++j)
            for (int k = 0; k < m; ++k)
                result[i][j] += matrix1[i][k] * matrix2[j][k];

    dw = MathUtils::elementWiseDivide(MathUtils::dotProduct(dz, MathUtils::transpose(aPrev)), m);

    db = MathUtils::elementWiseDivide(MathUtils::dotProduct(dz, std::vector<double>(m, 1)), m);


    //daPrev = W^T . dt
    std::vector<std::vector<double>> daPrev = MathUtils::dotProduct(MathUtils::transpose(w), dz);

    //update w and b
    w = MathUtils::elementWiseSubtract(w, MathUtils::elementWiseProduct(dw, learningRate));  // w = w - lr * dw
    b = MathUtils::elementWiseSubtract(b, MathUtils::elementWiseProduct(db, learningRate));  // b = b - lr * db

    initDerivatives();

    return daPrev;
}
*/
