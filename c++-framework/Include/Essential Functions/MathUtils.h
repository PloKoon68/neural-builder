#ifndef MATH_UTILS_H
#define MATH_UTILS_H

#include <vector>
#include <stdexcept>

class MathUtils {
public:
    
    //------------------------------------------------------------------------------------------------- Transpose
    static std::vector<std::vector<double>> transpose(const std::vector<std::vector<double>>& matrix);
    static std::vector<std::vector<double>> transpose(const std::vector<double>& vector);


    //------------------------------------------------------------------------------------------------- Element wise operations
    static std::vector<double> elementWiseProduct(const std::vector<double>& vec1, const std::vector<double>& vec2);
    static std::vector<std::vector<double>> elementWiseProduct(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2);
    static std::vector<std::vector<double>> elementWiseProduct(const std::vector<std::vector<double>>&matrix, const std::vector<double>&vector);
    static std::vector<std::vector<double>> elementWiseProduct(const std::vector<std::vector<double>>& matrix, const double& num);
    static std::vector<double> elementWiseProduct(const std::vector<double>& vec, const double& num);
    
    static std::vector<double> elementWiseDivide(const std::vector<double>& vec1, const std::vector<double>& vec2);
    static std::vector<std::vector<double>> elementWiseDivide(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2);
    static std::vector<std::vector<double>> elementWiseDivide(const std::vector<std::vector<double>>& matrix, const std::vector<double>& vector);
    static std::vector<std::vector<double>> elementWiseDivide(const std::vector<std::vector<double>>& matrix, const double& num);
    static std::vector<double> elementWiseDivide(const std::vector<double>& vec, const double& num);

    static std::vector<double> elementWiseSum(const std::vector<double>& vec1, const std::vector<double>& vec2);
    static std::vector<std::vector<double>> elementWiseSum(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2);
    static std::vector<std::vector<double>> elementWiseSum(const std::vector<std::vector<double>>& matrix, const std::vector<double>& vector);
    static std::vector<std::vector<double>> elementWiseSum(const std::vector<std::vector<double>>& matrix, const double& num);
    static std::vector<double> elementWiseSum(const std::vector<double>& vec, const double& num);

    static std::vector<double> elementWiseSubtract(const std::vector<double>& vec1, const std::vector<double>& vec2);
    static std::vector<std::vector<double>> elementWiseSubtract(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2);
    static std::vector<std::vector<double>> elementWiseSubtract(const std::vector<std::vector<double>>& matrix, const std::vector<double>& vector);
    static std::vector<std::vector<double>> elementWiseSubtract(const std::vector<std::vector<double>>& matrix, const double& num);
    static std::vector<double> elementWiseSubtract(const std::vector<double>& vec, const double& num);

    //------------------------------------------------------------------------------------------------- Dot product
    static double dotProduct(const std::vector<double>& vec1, const std::vector<double>& vec2); 
    static std::vector<double> dotProduct(const std::vector<std::vector<double>>& matrix, const std::vector<double>& vec);
    static std::vector<std::vector<double>> dotProduct(const std::vector<std::vector<double>>& matrix1, const std::vector<std::vector<double>>& matrix2);
};

#endif // MATH_UTILS_H
