    #ifndef LOSS_FUNCTION_H
    #define LOSS_FUNCTION_H

    #include <vector>

    class LossFunction {
    public:
        virtual ~LossFunction() {}

            // General method for handling vectors
        virtual double calculateLoss(const std::vector<std::vector<double>>& predictions,
                                                 const std::vector<std::vector<double>>& targets) const = 0;
        virtual double calculateLoss(const std::vector<double>& predictions,
                                    const std::vector<double>& targets) const = 0;
        virtual double calculateLoss(const double& predictions, const double& targets) const = 0;

        virtual std::vector<std::vector<double>> derivative(const std::vector<std::vector<double>>& predictions,
            const std::vector<std::vector<double>>& targets) const = 0;
        virtual std::vector<double> derivative(const std::vector<double>& prediction,
            const std::vector<double>& target) const = 0;
        virtual double derivative(const double& prediction, const double& target) const = 0;

    };


    #endif 

