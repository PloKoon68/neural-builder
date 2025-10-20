#include "../../../Include/Essential Functions/MathUtils.h"



// Element-wise product of two vectors
std::vector<double> MathUtils::elementWiseProduct(const std::vector<double>& vec1, const std::vector<double>& vec2) {
    if (vec1.size() != vec2.size()) {
        throw std::invalid_argument("Vectors must be of the same size for element-wise product.");
    }
    std::vector<double> result(vec1.size());
    for (size_t i = 0; i < vec1.size(); ++i)
        result[i] = vec1[i] * vec2[i];

    return result;
}


// Element-wise product of two same sized matrix
std::vector<std::vector<double>> MathUtils::elementWiseProduct(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2) {
    if (matrix1.size() != matrix2.size() || matrix1[0].size() != matrix2[0].size()) {
        throw std::invalid_argument("Matrixes must be of the same size for element-wise product.");
    }


    int rows = matrix1.size();
    int cols = matrix1[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix1[i][j] * matrix2[i][j];

    return result;
}

// Element-wise product of matrix and vector
std::vector<std::vector<double>> MathUtils::elementWiseProduct(const std::vector<std::vector<double>>& matrix, const std::vector<double>& vector) {
    if (matrix.size() != vector.size()) {
        throw std::invalid_argument("Matrix and vector size must me compatible for element-wise product.");
    }


    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix[i][j] * vector[i];

    return result;
}

// Element-wise product of matrix with a num param
std::vector<std::vector<double>> MathUtils::elementWiseProduct(const std::vector<std::vector<double>>& matrix, const double& num) {

    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix[i][j] * num;

    return result;
}


// Element-wise product of vector with num param
std::vector<double> MathUtils::elementWiseProduct(const std::vector<double>& vec, const double& num) {

    std::vector<double> result(vec.size());
    for (int i = 0; i < vec.size(); ++i)
        result[i] = vec[i] * num;

    return result;
}


//Element wise Division
std::vector<double> MathUtils::elementWiseDivide(const std::vector<double>& vec1, const std::vector<double>& vec2) {
    if (vec1.size() != vec2.size()) {
        throw std::invalid_argument("Vectors must be of the same size for element-wise sum.");
    }
    std::vector<double> result(vec1.size());
    for (size_t i = 0; i < vec1.size(); ++i)
        result[i] = vec1[i] / vec2[i];

    return result;
}

std::vector<std::vector<double>> MathUtils::elementWiseDivide(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2) {
    if (matrix1.size() != matrix2.size() || matrix1[0].size() != matrix2[0].size()) {
        throw std::invalid_argument("Matrixes must be of the same size for element-wise sum.");
    }


    int rows = matrix1.size();
    int cols = matrix1[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix1[i][j] / matrix2[i][j];

    return result;
}

std::vector<std::vector<double>> MathUtils::elementWiseDivide(const std::vector<std::vector<double>>& matrix, const std::vector<double>& vector) {
    if (matrix.size() != vector.size()) {
        throw std::invalid_argument("Matrix and vector size must me compatible for element-wise sum.");
    }


    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix[i][j] / vector[i];

    return result;
}

std::vector<std::vector<double>> MathUtils::elementWiseDivide(const std::vector<std::vector<double>>& matrix, const double& num) {

    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix[i][j] / num;

    return result;
}

std::vector<double> MathUtils::elementWiseDivide(const std::vector<double>& vec, const double& num) {

    std::vector<double> result(vec.size());
    for (int i = 0; i < vec.size(); ++i)
        result[i] = vec[i] / num;

    return result;
}


//Element wise Sum
std::vector<double> MathUtils::elementWiseSum(const std::vector<double>& vec1, const std::vector<double>& vec2) {
    if (vec1.size() != vec2.size()) {
        throw std::invalid_argument("Vectors must be of the same size for element-wise sum.");
    }
    std::vector<double> result(vec1.size());
    for (size_t i = 0; i < vec1.size(); ++i)
        result[i] = vec1[i] + vec2[i];

    return result;
}

std::vector<std::vector<double>> MathUtils::elementWiseSum(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2) {
    if (matrix1.size() != matrix2.size() || matrix1[0].size() != matrix2[0].size()) {
        throw std::invalid_argument("Matrixes must be of the same size for element-wise sum.");
    }


    int rows = matrix1.size();
    int cols = matrix1[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix1[i][j] + matrix2[i][j];

    return result;
}

std::vector<std::vector<double>> MathUtils::elementWiseSum(const std::vector<std::vector<double>>& matrix, const std::vector<double>& vector) {
    if (matrix.size() != vector.size()) {
        throw std::invalid_argument("Matrix and vector size must me compatible for element-wise sum.");
    }


    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix[i][j] + vector[i];

    return result;
}

std::vector<std::vector<double>> MathUtils::elementWiseSum(const std::vector<std::vector<double>>& matrix, const double& num) {

    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix[i][j] + num;

    return result;
}


std::vector<double> MathUtils::elementWiseSum(const std::vector<double>& vec, const double& num) {

    std::vector<double> result(vec.size());
    for (int i = 0; i < vec.size(); ++i)
        result[i] = vec[i] + num;

    return result;
}


//Subtraction

std::vector<double> MathUtils::elementWiseSubtract(const std::vector<double>& vec1, const std::vector<double>& vec2) {
    if (vec1.size() != vec2.size()) {
        throw std::invalid_argument("Vectors must be of the same size for element-wise sum.");
    }
    std::vector<double> result(vec1.size());
    for (size_t i = 0; i < vec1.size(); ++i)
        result[i] = vec1[i] - vec2[i];

    return result;
}

//Element wise Sum
std::vector<std::vector<double>> MathUtils::elementWiseSubtract(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2) {
    if (matrix1.size() != matrix2.size() || matrix1[0].size() != matrix2[0].size()) {
        throw std::invalid_argument("Matrixes must be of the same size for element-wise sum.");
    }


    int rows = matrix1.size();
    int cols = matrix1[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix1[i][j] - matrix2[i][j];

    return result;
}

std::vector<std::vector<double>> MathUtils::elementWiseSubtract(const std::vector<std::vector<double>>& matrix, const std::vector<double>& vector) {
    if (matrix.size() != vector.size()) {
        throw std::invalid_argument("Matrix and vector size must me compatible for element-wise sum.");
    }

    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix[i][j] - vector[i];

    return result;
}

std::vector<std::vector<double>> MathUtils::elementWiseSubtract(const std::vector<std::vector<double>>& matrix, const double& num) {

    int rows = matrix.size();
    int cols = matrix[0].size();
    std::vector<std::vector<double>> result(rows, std::vector<double>(cols));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            result[i][j] = matrix[i][j] - num;

    return result;
}


std::vector<double> MathUtils::elementWiseSubtract(const std::vector<double>& vec, const double& num) {

    std::vector<double> result(vec.size());
    for (int i = 0; i < vec.size(); ++i)
        result[i] = vec[i] - num;

    return result;
}