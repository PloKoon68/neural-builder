// Online C++ compiler to run C++ program online
#include "../Include/NeuralNetwork.h"
#include "../lib/crow.h"
#include "../lib/crow/websocket.h"

#include "../Include/Essential Functions/MathUtils.h"
#include "../Include/Util Functions/DatasetLoader.h"

#include "../Include/Api/Middleware.h"
#include "../Include/Api/RouteHandlers.h"


/*
#include "Activation.h"
#include "DenseLayer.h"
#include "LossFactory.h"
#include "ActivationFactory.h"
#include "Initializer.h"
*/
//#include "src/tests.cpp"

#include <cstdlib>
#include <ctime>

// test bny

using namespace std;


// Function to generate a random float between 0 and 1
double randomFloat() {
    return static_cast<double>(rand()) / static_cast<double>(RAND_MAX);
}

// Function to generate the dataset
void generateDataset(std::vector<std::vector<double>>& inputs, std::vector<std::vector<double>>& outputs, int numSamples);

NeuralNetwork* nn;
crow::websocket::connection* g_ws_conn = nullptr;


int main() {

    string lossFunc = "categorical cross entropy";
    nn = new NeuralNetwork({}, {}, lossFunc,
        {}, {}, {}, 0);

    crow::App<CORS> app;
    register_routes(app);
   
    app.port(18080).multithreaded().run();


    CROW_LOG_INFO << "Server shutting down. Cleaning up resources.";
    delete nn; // Prevent memory leaks

    return 0;
}


// Function to generate the dataset
void generateDataset(std::vector<std::vector<double>>& inputs, std::vector<std::vector<double>>& outputs, int numSamples) {
    for (int i = 0; i < numSamples; ++i) {
        std::vector<double> sample(6);

        //men or women?

        int output = randomFloat() > 0.5 ? 1 : 0;
        double r;

        if (output) {
            r = randomFloat();
            sample[0] = 0.6 + fmod(r, 0.4);// Testosterone level
            r = randomFloat();
            sample[1] = 0.1 + fmod(r, 0.3); // Estrogen level
            r = randomFloat();
            sample[2] = 0.6 + fmod(r, 0.4); // Hairiness percentage
            r = randomFloat();
            sample[3] = 0.7 + fmod(r, 0.3); // Muscular power
            r = randomFloat();
            sample[4] = 0.1 + fmod(r, 0.4); // emotional
            r = randomFloat();
            sample[5] = 0.2 + fmod(r, 0.4); // kindness
        }
        else {
            r = randomFloat();
            sample[0] = 0.1 + fmod(r, 0.3); // Testesterone level
            r = randomFloat();
            sample[1] = 0.6 + fmod(r, 0.4);// Estrogen level
            r = randomFloat();
            sample[2] = 0.1 + fmod(r, 0.35); // Hairiness percentage
            r = randomFloat();
            sample[3] = 0.2 + fmod(r, 0.35); // Muscular power
            r = randomFloat();
            sample[4] = 0.7 + fmod(r, 0.3);// emotional
            r = randomFloat();
            sample[5] = 0.5 + fmod(r, 0.5);// kindness
        }

        // Simple rule to determine the output

        inputs.push_back(sample);
        outputs[0].push_back(output);
    }
}



/*
  //reg
  vector<double> keyProbValues = {};
  vector<double> lambdaValues = {};

  //hyper parameters
  vector<int> hiddenLayerSizes = { };
  vector<double> learningRates = { };
  vector<string> layerActivations = { };
  string lossFunc = "categorical cross entropy";

  int epochNum = 15;
  int minibatchSize = 64;
*/

/*
vector<vector<double>> train_features;
vector<vector<double>> train_labels;

vector<vector<double>> test_features;
vector<vector<double>> test_labels;
//string datasetName = "titanic";
string datasetName = "mnist";

loadDataset(train_features, train_labels, test_features, test_labels, datasetName);




//---------------------
 //reg
vector<double> keyProbValues = {};
vector<double> lambdaValues = {};

//hyper parameters
vector<int> hiddenLayerSizes = { 256, 10 };
vector<double> learningRates = { 0.01,0.01 };
vector<string> layerActivations = { "relu", "softmax"};
string lossFunc = "categorical cross entropy";
int m = train_features[0].size();
int epochNum = 15, minibatchSize = 64;

//for titanic data
NeuralNetwork* nn = new NeuralNetwork(hiddenLayerSizes, layerActivations, lossFunc,
    learningRates, keyProbValues, lambdaValues, train_features.size());
nn->trainVal(train_features, train_labels, test_features, test_labels, epochNum, minibatchSize);

//nn->train(inputTrain, targetsTrain, epochNum, minibatchSize);
*/

/*
* test code
vector<vector<double>> w(150, vector<double>(240));
vector<vector<double>> input(240, vector<double>(2000));
vector<double> b(150);
for (vector<double>& v : w)
    for (double& d : v) d = randomFloat();
for (vector<double>& v : input)
    for (double& d : v) d = randomFloat();
for (double& d : b) d = randomFloat();
ActivationFunction* activationFunction = ActivationFactory::getActivationClass("relu");



//method1
vector<vector<double>> z = MathUtils::elementWiseSum(MathUtils::dotProduct(w, input), b);  // z = w.aPrev + b
z = activationFunction->activate(z);
z = activationFunction->activate(z);
z = activationFunction->activate(z);


//method 2
int rows = w.size();
int cols = input[0].size();
int mid = w[0].size();

std::vector<std::vector<double>> z(rows, std::vector<double>(cols));

for (int i = 0; i < rows; ++i)
    for (int j = 0; j < cols; ++j) {
        double val = 0;
        for (int k = 0; k < mid; ++k)
            val += w[i][k] * input[k][j];
        z[i][j] = activationFunction->activate(activationFunction->activate(activationFunction->activate(val + b[i])));
    }


//prinnt result
int n = z.size(), m = z[0].size();
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++)
        cout << z[i][j] << " ";
    cout << endl;
}


*/


/* if one how needed
    train_labels = labelToOneHot(train_labels[0], 10);
    test_labels = labelToOneHot(test_labels[0], 10);
    */

    /*
    train_features = cutMatrix(train_features, 5);
    train_labels = cutMatrix(train_labels, 5);
    test_features = cutMatrix(test_features, 2);
    test_labels = cutMatrix(test_labels, 2);

    //---------------------
    train_labels = { {1, 1, 0, 0, 1}, {0, 0, 1, 1, 0} };
    test_labels = { {1, 1}, {0, 0} };;
    */



    /*
      //for artificial data
      NeuralNetwork* nn = new NeuralNetwork(hiddenLayerSizes, layerActivations, lossFunc, learningRates, keyProbValues, lambdaValues, inputTrain.size());
      //nn->train(inputTrain, targetsTrain, epochNum, minibatchSize);
      nn->trainVal(inputTrain, targetsTrain, inputTest, targetsTest, epochNum, minibatchSize);
      */



      /*
          vector<vector<double>> w = Initializer::initialize("he", 4, 5);

          for (vector<double> row : w) {
              for (double we : row)
                  cout << we << " ";
              cout << endl;
          }
          cout << endl;0<

           w = Initializer::initialize("xavier", 4, 5);

          for (vector<double> row : w) {
              for (double we : row)
                  cout << we << " ";
              cout << endl;
          }
          */

          /*
          //test
          //e k e e k k
          vector<vector<double>> myTests = { {0.9, 0.2, 0.54},
                                              {0.1, 0.87, 0.52},
                                              {0.8, 0.3, 0.6},
                                              {0.79, 0.25, 0.59},
                                              {0.23, 0.87, 0.48},
                                              {0.34, 0.72, 0.72}};

          cout << "\n\n\ntest predictions: \n\n";

      //        inputTest targetsTest

          std::vector<std::vector<double>> testPredictions = nn->forwardPropagation(inputTest);
          double trueNums = 0;
          for (int i = 0; i < testPredictions[0].size(); i++) {
              cout << "prediction " << i << " is: " << testPredictions[0][i] << ", actual result: " << targetsTest[0][i] << endl;
              trueNums += testPredictions[0][i] == targetsTest[0][i];
          }

          cout << trueNums / testPredictions[0].size();
          */
