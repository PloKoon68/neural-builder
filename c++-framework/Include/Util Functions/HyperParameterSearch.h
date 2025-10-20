#pragma once // Prevents the header from being included multiple times

#include <vector>
#include <string>
#include "../lib/crow/websocket.h" // For the crow::websocket::connection pointer

// We need a forward declaration of the websocket connection type
// This is often sufficient if you are only using pointers or references.
namespace crow {
    namespace websocket {
        class connection;
    }
}

// Function Declaration
std::vector<std::string> hyperParameterTry(
    const std::vector<std::vector<int>>& numOfNeurons,
    const std::vector<std::vector<std::string>>& activations,
    const std::vector<std::vector<double>>& learningRates,
    const std::vector<std::string>& lossFunctions,
    const std::vector<int>& epochNums,
    const std::vector<int>& miniBatchSizes,
    const std::vector<std::vector<double>>& inputTrain,
    const std::vector<std::vector<double>>& inputTest,
    const std::vector<std::vector<double>>& targetsTrain,
    const std::vector<std::vector<double>>& targetsTest,
    const std::vector<std::vector<double>>& keyProbValues,
    const std::vector<std::vector<double>>& lambdaValues,
    crow::websocket::connection* ws_conn // Pass the websocket connection
);