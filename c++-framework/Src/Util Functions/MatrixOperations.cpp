#include "../Include/Util Functions/MatrixOperations.h"

#include <stdexcept>


std::vector<std::vector<double>> cutMatrix(const std::vector<std::vector<double>>& matrix, int newCols) {
    size_t n = matrix.size(); // Number of rows
    size_t m = matrix[0].size(); // Number of columns

    if (newCols > m) {
        throw std::invalid_argument("The new column count exceeds the original number of columns.");
    }

    // Create the new n x newCols matrix
    std::vector<std::vector<double>> result(n, std::vector<double>(newCols));
    for (size_t i = 0; i < n; ++i) {
        for (size_t j = 0; j < newCols; ++j) {
            result[i][j] = matrix[i][j];
        }
    }

    return result;
}

template<typename T>
void printMatrix(std::vector<std::vector<T>>& matrix) {
    for (vector<T>& row : matrix) {
        for (T& col : row)
            cout << col << " ";
        cout << endl;
    }
}
