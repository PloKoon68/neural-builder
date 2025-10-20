// File: include/DatasetLoader.h
#pragma once
#include <vector>
#include <string>

std::vector<std::vector<double>> loadFeatures(const std::string& filePath);
std::vector<std::vector<double>> loadLabels(const std::string& filePath);
std::vector<std::vector<double>> loadLabelsGeneral(const std::string& filePath);
void loadDataset(std::vector<std::vector<double>>& train_features,
    std::vector<std::vector<double>>& train_labels,
    std::vector<std::vector<double>>& test_features,
    std::vector<std::vector<double>>& test_labels,
    std::string datasetName);
std::vector<std::vector<double>> labelToOneHot(const std::vector<double>& labels, int numClasses);

