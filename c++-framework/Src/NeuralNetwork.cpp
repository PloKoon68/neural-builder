#include "../Include/NeuralNetwork.h"
#include "../Include/Layer Types/DenseLayer.h"
#include "../Include/Essential Functions/Loss Factory/LossFactory.h"
#include "../Include/Essential Functions/Regularization.h"
#include "../Include/Essential Functions/ModelEvaluator.h"

//DenseLayer::DenseLayer(const int& input_size, const int& output_size, const double& learningRate, std::string activationFunc)

NeuralNetwork::NeuralNetwork(std::vector<int> layerSizes, std::vector<std::string> layerActivations, std::string& lossFunc,
	std::vector<double> learningRates, std::vector<double> keyProbValues, std::vector<double> lambdaValues, int inputSize) {
	int i = 0;
	for (int numOfNeuron : layerSizes) {
		layers.push_back(new DenseLayer(inputSize, numOfNeuron, learningRates[i], layerActivations[i], keyProbValues.size()? keyProbValues[i]: 1, lambdaValues.size()? lambdaValues[i]: 0));
		i++;
		inputSize = numOfNeuron;
	}
	lossFunction = LossFactory::getLossClass(lossFunc);
	std::vector<double> lossValues;
}

double NeuralNetwork::train(const std::vector<std::vector<double>>& inputLayer, const std::vector<std::vector<double>>& targets,
	int epochNum, int miniBatchSize, crow::websocket::connection* ws_conn) {
	int epoch = 0;

	//normalize the copy of input data
	std::vector<std::vector<double>> inputNormalized = normalize(inputLayer, true);

	//divide batch to minibatches
	std::vector<std::vector<std::vector<double>>> miniBatchesInputs;
	std::vector<std::vector<std::vector<double>>> miniBatchesTargets;
	miniBatchGenerator(miniBatchesInputs, miniBatchesTargets, targets, inputNormalized, miniBatchSize);
	
	double costValue = 0, accuracyRate = 0;
	int numOfMiniBatches = miniBatchesInputs.size();
	
	while (epoch++ < epochNum) {
		accuracyRate = 0;
		costValue = 0;
		for (int batchNum = 0; batchNum < numOfMiniBatches; batchNum++) {
			int miniBatchSize = miniBatchesTargets[batchNum][0].size();

			//forward propagation
			std::vector<std::vector<double>> predictions = forwardPropagation(miniBatchesInputs[batchNum]);

			//accuracy              generalize later!
			accuracyRate += ModelEvaluator::accuracy(predictions, miniBatchesTargets[batchNum], lossFunction);
			

			//loss
			costValue += lossFunction->calculateLoss(predictions, miniBatchesTargets[batchNum]);

			//l2 reg
//			costValue += L2Regularizer::calculateNeuralNetworkPenalty(layers, miniBatchSize);


			//backward propagation
			std::vector<std::vector<double>> da = lossFunction->derivative(predictions, miniBatchesTargets[batchNum]);
			backwardPropagation(da);
		}
		accuracyRate /= numOfMiniBatches;
		costValue /= numOfMiniBatches;
	
		
		if (ws_conn) {
			std::string message = std::string("For epoch ") + std::to_string(epoch) + " cost: " + std::to_string(costValue) + ", accuracy: " + std::to_string(accuracyRate);
			ws_conn->send_text(message);
		}

	}
	return accuracyRate;
}

double NeuralNetwork::trainVal(std::vector<std::vector<double>>& inputLayer, std::vector<std::vector<double>>& targets, std::vector<std::vector<double>>& inputsVal, std::vector<std::vector<double>>& targetsVal, int epochNum, int miniBatchSize) {
	int epoch = 0;

	//normalize the copy of input data
	std::vector<std::vector<double>> inputTrainCopy = normalize(inputLayer, true);
	std::vector<std::vector<double>> inputValCopy = normalize(inputsVal, false);
	
	//divide batch to minibatches<
	std::vector<std::vector<std::vector<double>>> miniBatchesInputs;
	std::vector<std::vector<std::vector<double>>> miniBatchesTargets;
	miniBatchGenerator(miniBatchesInputs, miniBatchesTargets, targets, inputTrainCopy, miniBatchSize);
			
	double accuracyRateTrain, accuracyRateVal, costTrain, costVal;
	int numOfMiniBatches = miniBatchesInputs.size();

	int numOfClasses = layers[layers.size() - 1]->getWeights().size();
	std::vector<std::vector<double>> predictionsVal(numOfClasses, std::vector<double>(targetsVal[0].size()));

	while (epoch++ < epochNum) {
		predictionsVal = predict(inputValCopy);
		for (int batchNum = 0; batchNum < numOfMiniBatches; batchNum++) {

			//forward propagation
			std::vector<std::vector<double>> predictionsTrain = forwardPropagation(miniBatchesInputs[batchNum]);

			accuracyRateTrain = ModelEvaluator::accuracy(predictionsTrain, miniBatchesTargets[batchNum], lossFunction);
			accuracyRateVal = ModelEvaluator::accuracy(predictionsVal, targetsVal, lossFunction);

			costTrain = lossFunction->calculateLoss(predictionsTrain, miniBatchesTargets[batchNum]);
			costVal = lossFunction->calculateLoss(predictionsVal, targetsVal);
			
			std::cout << "For epoch " << epoch << " and mini batch " << batchNum << " \t\ttrain cost: " << costTrain << "\t\t train accuracy:  " << accuracyRateTrain
				<< "\n\t\t\t\t        val cost: " << costVal << "\t\t val accuracy: " << accuracyRateVal << std::endl << std::endl;
			//backward propagation
			std::vector<std::vector<double>> da = lossFunction->derivative(predictionsTrain, miniBatchesTargets[batchNum]);
			backwardPropagation(da);
		}
		std::cout << "\n\n";
	}
	return costVal;
}

std::vector<std::vector<double>> NeuralNetwork::forwardPropagation(std::vector<std::vector<double>>& input) {
	std::vector<std::vector<double>> predictions = input;

	//forward propagation
	for (Layer* layer : layers) {
		//std::cout << "forward layer " << i++ << std::endl;
		predictions = layer->forward(predictions);
		//predictions = layer->forwardOpt(predictions);
	}

	return predictions;
}

void NeuralNetwork::backwardPropagation(std::vector<std::vector<double>>& da) {

	int numOfLayers = layers.size();
	for (int i = numOfLayers - 1; i >= 0; i--) {
		//std::cout << "backward layer " << i+1 << std::endl;
		da = layers[i]->backward(da);
	}
}

std::vector<std::vector<double>> NeuralNetwork::predict(std::vector<std::vector<double>>& input) {
	std::vector<std::vector<double>> predictions = input;
	for (Layer* layer : layers) {
		predictions = layer->predict(predictions);
	}
	
	return  predictions;
} 


void NeuralNetwork::miniBatchGenerator(std::vector<std::vector<std::vector<double>>>& miniBatchesPredictions, std::vector<std::vector<std::vector<double>>>& miniBatchesTargets,
	const std::vector<std::vector<double>>& targets, std::vector<std::vector<double>>& inputLayer, int miniBatchSize) {

	int m = inputLayer[0].size(), n = inputLayer.size();
	int startCol = 0, endCol = miniBatchSize;

	while (endCol < m) {
		std::vector<std::vector<double>> miniBatchPrediction;
		std::vector<std::vector<double>> miniBatchTarget;
		for (int i = 0; i < n; i++) {
			std::vector<double> rowSlice(inputLayer[i].begin() + startCol, inputLayer[i].begin() + endCol);
			miniBatchPrediction.push_back(rowSlice);
		}
		for (std::vector<double> targetNeuron : targets) {
			std::vector<double> rowSlice(targetNeuron.begin() + startCol, targetNeuron.begin() + endCol);
			miniBatchTarget.push_back(rowSlice);
		}

		miniBatchesPredictions.push_back(miniBatchPrediction);
		miniBatchesTargets.push_back(miniBatchTarget);
		startCol = endCol;
		endCol += miniBatchSize;
	}
	//remaining part of the batch
	std::vector<std::vector<double>> miniBatchPrediction;
	std::vector<std::vector<double>> miniBatchTarget;
	for (int i = 0; i < n; i++) {
		std::vector<double> rowSlice(inputLayer[i].begin() + startCol, inputLayer[i].begin() + m);
		miniBatchPrediction.push_back(rowSlice);
	}
	for (std::vector<double> targetNeuron : targets) {
		std::vector<double> rowSlice(targetNeuron.begin() + startCol, targetNeuron.begin() + m);
		miniBatchTarget.push_back(rowSlice);
	}
	miniBatchesPredictions.push_back(miniBatchPrediction);
	miniBatchesTargets.push_back(miniBatchTarget);
}

std::vector<std::vector<double>> NeuralNetwork::normalize(const std::vector<std::vector<double>>& input, bool training) {
	//subtracte avg to 0 the mean
	//divide to root sum square to normalize variance
	
	std::vector<std::vector<double>> inputCopy = input;

	if (training) {
		int m = input[0].size();
		for (std::vector<double>& feature : inputCopy) {
			double sum = 0, rootSum2 = 0, mean, stdev = 0;

			//calc mean
			for (double& val : feature) 
				sum += val;
			mean = sum / m;

			//subtract mean and calc sum square of differences
			for (double& val : feature) {
				val -= mean;
				stdev += val * val;
			}
			stdev = std::sqrt(stdev / m);

			//divide to stdev if stdev not zero
			if(stdev)
				for (double& val : feature)
					val /= stdev;

			means.push_back(mean);
			stdevs.push_back(stdev);
		}
	}
	else {
		int n = input.size();
		for (int i = 0; i < n; i++)
			for (double& val : inputCopy[i])
				if (stdevs[i])
					val = (val - means[i]) / stdevs[i];
				else
					val -= means[i];
	}

	return inputCopy;
}

crow::json::wvalue NeuralNetwork::getModelParameters() const {
	crow::json::wvalue::list modelParamsList;

	for (const auto& layer : layers) {
		auto* dense = dynamic_cast<DenseLayer*>(layer);
		if (dense) {
			crow::json::wvalue layerParams;

			const auto& weights = dense->getWeights();  // vector<vector<double>>
			const auto& biases = dense->getBiases();    // vector<double>

			// Convert weights to crow::json::wvalue::list of list
			crow::json::wvalue::list weightList;
			for (const auto& row : weights) {
				crow::json::wvalue::list rowList;
				for (double val : row)
					rowList.push_back(val);
				weightList.push_back(std::move(rowList));
			}

			// Convert biases to crow::json::wvalue::list
			crow::json::wvalue::list biasList;
			for (double b : biases)
				biasList.push_back(b);

			layerParams["weights"] = std::move(weightList);
			layerParams["biases"] = std::move(biasList);

			modelParamsList.push_back(std::move(layerParams));
		}
	}

	// Wrap the list into a crow::json::wvalue object and return
	crow::json::wvalue response;
	response = std::move(modelParamsList);
	return response;
}
void NeuralNetwork::setModelHyperParameters(
	const std::vector<int>& layerSizes,
	const std::vector<std::string>& layerActivations,
	const std::string& lossFunc,
	const std::vector<double>& learningRates,
	const std::vector<double>& keyProbValues,
	const std::vector<double>& lambdaValues,
	int inputSize
) {
	// Clear existing layers
	for (auto layer : layers) {
		delete layer;  // Clean up dynamically allocated memory
	}
	layers.clear();

	// Rebuild layers
	for (size_t i = 0; i < layerSizes.size(); ++i) {
		int numOfNeurons = layerSizes[i];
		std::string activation = layerActivations[i];
		double lr = learningRates[i];
		double keepProb = keyProbValues.size() ? keyProbValues[i] : 1.0;
		double lambda = lambdaValues.size() ? lambdaValues[i] : 0.0;

		layers.push_back(new DenseLayer(inputSize, numOfNeurons, lr, activation, keepProb, lambda));
		inputSize = numOfNeurons;
	}

	// Update loss function
	lossFunction = LossFactory::getLossClass(lossFunc);
}


/*
std::vector<double> NeuralNetwork::forwardPropagation(std::vector<double>& input, Layer* layer) {

}

std::vector<double> NeuralNetwork::backwardPropagation(std::vector<double>& input, Layer* layer) {

}*/
