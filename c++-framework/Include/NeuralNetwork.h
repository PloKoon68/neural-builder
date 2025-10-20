#ifndef NEURAL_NETWORK_H
#define NEURAL_NETWORK_H

#include <vector>
#include <crow/json.h>

#include "./Layer Types/Layer.h"
#include "./Layer Types/DenseLayer.h"       //kontrol et lazým mý
#include "./Essential Functions/Loss Factory/Loss Functions/LossFunction.h"

#include "../lib/crow/websocket.h"

class NeuralNetwork {
private:
    LossFunction* lossFunction;
    std::vector<double> lossValues;

    std::vector<Layer*> layers;

    std::vector<double> means;
    std::vector<double> stdevs;

public:
    NeuralNetwork(std::vector<int> layerSizes, std::vector<std::string>layerActivations, std::string& lossFunc, std::vector<double> learningRates, std::vector<double> keyProbValues, std::vector<double> lambdaValues, int inputSize);
    double train(const std::vector<std::vector<double>>& inputLayer, const std::vector<std::vector<double>>& target, int epochNum, int miniBatchSize, crow::websocket::connection* ws_conn);
    double trainVal(std::vector<std::vector<double>>& inputLayer, std::vector<std::vector<double>>& targets, std::vector<std::vector<double>>& valInput, std::vector<std::vector<double>>& valTarget, int epochNum, int miniBatchSize);

    std::vector<std::vector<double>> predict(std::vector<std::vector<double>>& inputLayer);
    std::vector<std::vector<double>> forwardPropagation(std::vector<std::vector<double>>& input);
    void backwardPropagation(std::vector<std::vector<double>>& input);
    void miniBatchGenerator(std::vector<std::vector<std::vector<double>>>& miniBatchesPredictions, std::vector<std::vector<std::vector<double>>>& miniBatchesTargets,
        const std::vector<std::vector<double>>& targets, std::vector<std::vector<double>>& inputLayer, int miniBatchSize);

    std::vector<std::vector<double>> normalize(const std::vector<std::vector<double>>& input, bool training);

    crow::json::wvalue getModelParameters() const;


    void setModelHyperParameters(
        const std::vector<int>& layerSizes,
        const std::vector<std::string>& layerActivations,
        const std::string& lossFunc,
        const std::vector<double>& learningRates,
        const std::vector<double>& keyProbValues,
        const std::vector<double>& lambdaValues,
        int inputSize
    );

};

#endif 
