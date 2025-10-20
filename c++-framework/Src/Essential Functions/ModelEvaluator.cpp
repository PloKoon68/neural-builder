#include "../../Include/Essential Functions/ModelEvaluator.h"
#include "../../Include/Essential Functions/Loss Factory/Loss Functions/CategoricalCrossEntropy.h"
#include "../../Include/Essential Functions/Loss Factory/Loss Functions/SigmoidCrossEntropy.h"


double ModelEvaluator::accuracy(const std::vector<std::vector<double>>& predictions, const std::vector<std::vector<double>>& targets, LossFunction* lossFunction) {
	int numOfSamples = predictions[0].size();
	int numOfClasses = predictions.size();

	double accuracyRate = 0;

	if (dynamic_cast<CategoricalCrossEntropy*>(lossFunction)) {
		// types are the same at compile time
		for (int j = 0; j < numOfSamples; j++) {
			double max = predictions[0][j];
			int predInd = 0;
			for (int i = 1; i < numOfClasses; i++) {
				if (predictions[i][j] > max) {
					max = predictions[i][j];
					predInd = i;
				}
			}
			accuracyRate += predInd == targets[0][j];
		}
		accuracyRate /= numOfSamples;
	}
	else if (dynamic_cast<SigmoidCrossEntropy*>(lossFunction)) {
		for (int i = 0; i < numOfSamples; i++)
			accuracyRate += (predictions[0][i] >= 0.5) == targets[0][i];
		accuracyRate /= numOfSamples;
	}
	return accuracyRate;
}


