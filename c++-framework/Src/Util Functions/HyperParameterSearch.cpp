#include "../Include/Util Functions/HyperParameterSearch.h"
#include "../Include/NeuralNetwork.h" // The function needs to create NeuralNetwork objects


// The global websocket pointer is
// < an external variable defined in main.cpp
// We can declare it here to use it. A better way would be to pass it as a parameter.
extern crow::websocket::connection* g_ws_conn;

// The full implementation of your function goes here.
// I've updated it to match the new declaration with const&
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
    crow::websocket::connection* ws_conn)
{
    // --- PASTE THE ENTIRE BODY OF YOUR FUNCTION HERE ---
    // Example:
    std::vector<std::string> results;
    int i = 1;
    for (std::vector<int> numOfNeuron : numOfNeurons) {
        //        cout << "\n- num of neurons set!\n";
        for (std::vector<std::string> activation : activations) {
            //            cout << "- activations set!\n";
            for (std::vector<double> learningRate : learningRates) {
                //                cout << "- learning rates set!\n";
                for (std::vector<double> keyProbVal : keyProbValues) {
                    for (std::vector<double> lambdaVal : lambdaValues) {
                        for (std::string lossFunction : lossFunctions) {
                            //                    cout << "- loss function set!\n";
                            for (int epochNum : epochNums) {
                                //                        cout << "- epoch num set!\n";
                                for (int miniBatchSize : miniBatchSizes) {

                                    /*
                                    cout << "case " << i++ << ": \n";

                                    cout << "- mini batch size set!\n";

                                    cout << "hyperparameters:\n";
                                    cout << "\nnumber of neurons in hidden layers: ";
                                    for (int non : numOfNeuron)
                                        cout << non << ", ";
                                    cout << "\nactivation functions: ";
                                    for (string act : activation)
                                        cout << act << ", ";
                                    cout << "\nlearning rates: ";
                                    for (double lr : learningRate)
                                        cout << lr << ", ";
                                    cout << "\nloss function: ";
                                    cout << lossFunction;
                                    cout << "\nnum of epochs: ";
                                    cout << epochNum;
                                    cout << "\nminibatch size: ";
                                    cout << miniBatchSize << endl << endl;
                                    */

                                    NeuralNetwork* nn = new NeuralNetwork(numOfNeuron, activation, lossFunction, learningRate, keyProbVal, lambdaVal, inputTest.size());
                                    double cost = nn->train(inputTrain, targetsTrain, epochNum, miniBatchSize, g_ws_conn);
                                    delete nn;


                                    //std::cout << "train " << i << std::endl;
                                    //cout << "\n\n\n";

                                    std::string result = "result of train number " + std::to_string(i) + ":\n";

                                    result += "number of neurons: ";
                                    for (int non : numOfNeuron)
                                        result += std::to_string(non) + ", ";
                                    result += "\nactivation functions: ";
                                    for (std::string act : activation)
                                        result += act + ", ";
                                    result += "\nlearning rates: ";
                                    for (double lr : learningRate)
                                        result += std::to_string(lr) + ", ";
                                    result += "\nloss func: " + lossFunction;
                                    result += "\nnumber of epochs trained: " + epochNum;
                                    result += "\nminibatch size: " + miniBatchSize;

                                    result += "\ncost score was: " + std::to_string(cost) + "\n";
                                    result += "\n\n";
                                    results.push_back(result);

                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return results;
}

