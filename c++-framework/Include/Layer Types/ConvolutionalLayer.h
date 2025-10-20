#ifndef CONVOLUTIONAL_LAYER_H
#define CONVOLUTIONAL_LAYER_H

#include <vector>
#include "Layer.h" 

class ConvolutionalLayer : public Layer {
private:
    int input_channels;
    int output_channels;
    int kernel_size;
    std::vector<std::vector<std::vector<double>>> kernels;

public:
    ConvolutionalLayer(int input_channels, int output_channels, int kernel_size);
    std::vector<std::vector<double>> forward(const std::vector<std::vector<double>>& input) override;
    void initDerivatives() override;

    void display() const override;
};

#endif // CONVOLUTIONAL_LAYER_H
