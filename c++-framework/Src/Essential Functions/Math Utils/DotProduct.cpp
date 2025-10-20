#include "../../../Include/Essential Functions/MathUtils.h"

double MathUtils::dotProduct(const std::vector<double>& vec1, const std::vector<double>& vec2) {
    if (vec1.size() != vec2.size())
        throw std::invalid_argument("Number of elements in vectors shoul be equal.");
  
    int len = vec1.size();
    double result = 0;
    for (int i = 0; i < len; i++)
        result += vec1[i] * vec2[i];

    return result;
}

// Dot product of matrix and vector
std::vector<double> MathUtils::dotProduct(const std::vector<std::vector<double>>& matrix, const std::vector<double>& vec) {
    if (!matrix.size())
        throw std::invalid_argument("Matrix input can't be empty.");

    if (matrix[0].size() != vec.size()) {
        throw std::invalid_argument("Matrix and vector incompatible for dot product!");
    }

    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<double> result(rows, 0);

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i] += matrix[i][j] * vec[j];

    return result;
}


// Dot product of matrix and matrix
std::vector<std::vector<double>> MathUtils::dotProduct(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2) {
    if (matrix1[0].size() != matrix2.size()) {
        throw std::invalid_argument("Matrixes must be of compatible size for dot product.");
    }
    

    int rows = matrix1.size();
    int cols = matrix2[0].size();
    int mid = matrix1[0].size();

    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            for (int k = 0; k < mid; ++k)
                result[i][j] += matrix1[i][k] * matrix2[k][j];

    return result;
}



