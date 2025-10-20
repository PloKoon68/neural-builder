#include "../../../Include/Essential Functions/MathUtils.h"


// Transpose a matrix
std::vector<std::vector<double>> MathUtils::transpose(const std::vector<std::vector<double>>& matrix) {
    if (matrix.empty()) return {};

    int rows = matrix.size();
    int cols = matrix[0].size();

    // Check that all rows have the same number of columns
    for (int i = 1; i < rows; ++i) {
        if (matrix[i].size() != cols) {
            throw std::invalid_argument("All rows must have the same number of columns to transpose");
        }
    }

    std::vector<std::vector<double>> transposed(cols, std::vector<double>(rows));

    for (int i = 0; i < rows; ++i)
        for (int j = 0; j < cols; ++j)
            transposed[j][i] = matrix[i][j];

    return transposed;
}
// Transpose a 1D vector
std::vector<std::vector<double>>  MathUtils::transpose(const std::vector<double>& vector) {
    if (vector.empty()) return {};

    int len = vector.size();

    std::vector<std::vector<double>> transposed(1, std::vector<double>(len));

    for (int j = 0; j < len; ++j)
        transposed[0][j] = vector[j];

    return transposed;
}
