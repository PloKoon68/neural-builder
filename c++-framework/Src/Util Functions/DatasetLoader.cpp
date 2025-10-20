#include "../Include/Util Functions/DatasetLoader.h"

//for file stream csv
#include <fstream>
#include <sstream>

using namespace std;


// Function to load features from input.csv
std::vector<std::vector<double>> loadFeatures(const string& filePath) {
    vector<vector<double>> features;

    ifstream file(filePath);
    if (!file.is_open()) {
        throw runtime_error("Could not open file: " + filePath);
    }

    string line;
    bool firstLine = true;

    // Initialize an empty feature matrix (columns for samples, rows for features)
    int i = 0;
    while (getline(file, line) /* && i++ < 500*/) {
        if (firstLine) {
            firstLine = false; // Skip the header row
            continue;
        }




        stringstream ss(line);
        string cell;
        vector<double> row;

        while (getline(ss, cell, ',')) {
            row.push_back(stod(cell));
        }

        // Transpose logic: Ensure each feature vector aligns across rows
        if (features.empty()) {
            features.resize(row.size());
        }
        for (size_t i = 0; i < row.size(); ++i) {
            features[i].push_back(row[i]);
        }
    }

    file.close();
    return features;
}

// Function to load labels from target.csv
vector<vector<double>> loadLabels(const string& filePath) {
    vector<vector<double>> labels(1, vector<double>());

    ifstream file(filePath);
    if (!file.is_open()) {
        throw runtime_error("Could not open file: " + filePath);
    }

    string line;
    bool firstLine = true;

    int i = 0;
    while (getline(file, line) /* && i++ < 500*/) {
        if (firstLine) {
            firstLine = false; // Skip the header row
            continue;
        }

        labels[0].push_back(stod(line));
    }

    file.close();
    return labels;
}

vector<vector<double>> loadLabelsGeneral(const string& filePath) {
    vector<int> encodedLabels;
    size_t numOfClasses = 0;

    ifstream file(filePath);
    if (!file.is_open()) {
        throw runtime_error("Could not open file: " + filePath);
    }

    string line;
    bool firstLine = true;

    // Read the encoded labels and find the number of classes
    while (getline(file, line)) {
        if (firstLine) {
            firstLine = false; // Skip the header row
            continue;
        }

        int label = stoi(line); // Read the label as an integer
        encodedLabels.push_back(label);
        numOfClasses = max(numOfClasses, static_cast<size_t>(label + 1)); // Update class count
    }
    file.close();

    // Initialize the one-hot encoded matrix
    size_t m = encodedLabels.size(); // Number of samples
    vector<vector<double>> oneHotLabels(numOfClasses, vector<double>(m, 0.0));

    // Fill in the one-hot matrix
    for (size_t sampleIdx = 0; sampleIdx < m; ++sampleIdx) {
        int label = encodedLabels[sampleIdx];
        oneHotLabels[label][sampleIdx] = 1.0;
    }

    return oneHotLabels;
}


void loadDataset(vector<vector<double>>& train_features, vector<vector<double>>& train_labels, vector<vector<double>>& test_features, vector<vector<double>>& test_labels, string datasetName) {
    // File paths
    string trainFeaturesPath = "..\\dataset\\" + datasetName + "\\train\\" + datasetName + "_features_train.csv";
    string trainLabelsPath = "../dataset/" + datasetName + "/train/" + datasetName + "_labels_train.csv";

    string testFeaturesPath = "../dataset/" + datasetName + "/test/" + datasetName + "_features_test.csv";
    string testLabelsPath = "../dataset/" + datasetName + "/test/" + datasetName + "_labels_test.csv";



    /*
        string trainFeaturesPath = "../dataset/" + datasetName + "/train/" + datasetName + "_features_train.csv";
    string trainLabelsPath = "../dataset/" + datasetName + "/train/" + datasetName + "_labels_train.csv";

    string testFeaturesPath = "../dataset/" + datasetName + "/test/" + datasetName + "_features_test.csv";
    string testLabelsPath = "../dataset/" + datasetName + "/test/" + datasetName + "_labels_test.csv";

    */



    // Load features and labels
    train_features = loadFeatures(trainFeaturesPath);
    train_labels = loadLabels(trainLabelsPath);
    test_features = loadFeatures(testFeaturesPath);
    test_labels = loadLabels(testLabelsPath);
    //test_labels = loadLabelsGeneral(testLabelsPath);
}


std::vector<std::vector<double>> labelToOneHot(const std::vector<double>& labels, int numClasses) {
    size_t m = labels.size(); // Number of samples
    std::vector<std::vector<double>> oneHot(numClasses, std::vector<double>(m, 0));

    for (size_t j = 0; j < m; ++j) {
        if (labels[j] >= numClasses) {
            throw std::out_of_range("Label value exceeds the number of classes.");
        }
        oneHot[labels[j]][j] = 1; // Set the corresponding class index to 1
    }

    return oneHot;
}
