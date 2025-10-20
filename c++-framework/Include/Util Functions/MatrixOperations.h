// File: include/DatasetLoader.h
#pragma once
#include <vector>

std::vector<std::vector<double>> cutMatrix(const std::vector<std::vector<double>>& matrix, int newCols);

template<typename T>
void printMatrix(std::vector<std::vector<T>>& matrix);