#include "../../Include/Api/RouteHandlers.h"
#include "../../Include/NeuralNetwork.h"
#include "../../Include/Essential Functions/MathUtils.h"
#include "../../Include/Api/Middleware.h"

#include <thread>
#include <iostream>

extern NeuralNetwork* nn;
extern crow::websocket::connection* g_ws_conn;

template <typename... Middlewares>
void register_routes(crow::App<Middlewares...>& app) {
    CROW_LOG_INFO << "Registering application routes...";

    // --- PASTE YOUR /ws WEBSOCKET ROUTE LOGIC HERE ---
    CROW_ROUTE(app, "/ws").websocket(&app)
        .onopen([](crow::websocket::connection& conn) {
        CROW_LOG_INFO << "WebSocket opened from " << conn.get_remote_ip();
        g_ws_conn = &conn;
        conn.send_text("Welcome! Ready for training data.");
            })
        .onmessage([](crow::websocket::connection& conn, const std::string& data, bool is_binary) {
                if (is_binary) { /* ... */ return; }
                crow::json::rvalue parsed_data = crow::json::load(data);
                if (!parsed_data) { /* ... */ return; }
                try {
                    // ... (your existing JSON parsing logic)
                    std::vector<std::vector<double>> features, target;
                    for (const auto& row : parsed_data["features"]) {
                        std::vector<double> current_row;
                        for (const auto& val : row) {
                            current_row.push_back(val.d());
                        }
                        features.push_back(current_row);
                    }
                    for (const auto& row : parsed_data["target"]) {
                        std::vector<double> current_row;
                        for (const auto& val : row) {
                            current_row.push_back(val.d());
                        }
                        target.push_back(current_row);
                    }
                    features = MathUtils::transpose(features);
                    target = MathUtils::transpose(target);

                    int epochs = parsed_data["epochNum"].i();
                    int batchSize = parsed_data["minibatchSize"].i();

                    CROW_LOG_INFO << "Received training data. Starting training thread...";
                    
                    std::thread trainingThread([features, target, epochs, batchSize]() {
                        if (!g_ws_conn || !nn) return;
                        auto final_accuracy = nn->train(features, target, epochs, batchSize, g_ws_conn);
                        if (g_ws_conn) {
                            g_ws_conn->send_text("Training finished! Final Accuracy: " + std::to_string(final_accuracy));
                            g_ws_conn->close();
                        }
                        });
                    trainingThread.detach();
                }
                catch (const std::exception& e) { 
                    CROW_LOG_ERROR << "Error processing training data: " << e.what();
                    conn.send_text("Error: Malformed training data.");
                }
            })
                .onclose([](crow::websocket::connection& conn, const std::string& reason, uint16_t code) {
                CROW_LOG_INFO << "WebSocket closed: " << reason << " (" << code << ")";
                if (g_ws_conn == &conn) {
                    g_ws_conn = nullptr;
                }
                    });

            // --- PASTE YOUR /compile ROUTE LOGIC HERE ---
            CROW_ROUTE(app, "/compile").methods("POST"_method)
                ([](const crow::request& req) {
                if (!nn) {
                    return crow::response(500, "Server Error: Neural Network not initialized.");
                }
                auto body = crow::json::load(req.body);
                if (!body) {
                    return crow::response(400, "Invalid JSON");
                }

                // ... (all your logic for parsing JSON and calling nn->setModelParameters)
                                // Convert JSON arrays to std::vector
                auto hiddenLayerSizes = body["hiddenLayerSizes"];
                auto learningRates = body["learningRates"];
                auto layerActivations = body["layerActivations"];

                std::vector<int> hiddenLayerSizesVec;
                for (int i = 0; i < hiddenLayerSizes.size(); i++)
                    hiddenLayerSizesVec.push_back(hiddenLayerSizes[i].i());

                std::vector<double> learningRatesVec;
                for (int i = 0; i < learningRates.size(); i++)
                    learningRatesVec.push_back(learningRates[i].d());

                std::vector<std::string> layerActivationsVec;
                for (int i = 0; i < layerActivations.size(); i++)
                    layerActivationsVec.push_back(layerActivations[i].s());

                std::string lossFunc = body["lossFunc"].s();
                int inputSize = body["inputSize"].i();

                std::vector<double> keyProbValues = {};
                std::vector<double> lambdaValues = {};
                nn->setModelHyperParameters(hiddenLayerSizesVec, layerActivationsVec, lossFunc,
                    learningRatesVec, keyProbValues, lambdaValues, inputSize);

                crow::json::wvalue parameters = nn->getModelParameters();
                return crow::response(200, parameters);
                    });

            // You could add other routes here in the future
            CROW_ROUTE(app, "/health")([]() {
                return "Server is alive!";
                });
}

// This is an explicit template instantiation. It's needed because we are defining a
// template function in a .cpp file. This tells the compiler to generate the code
// for a crow::App that uses the CORS middleware.
template void register_routes<CORS>(crow::App<CORS>& app);


//websocket test
/*
CROW_ROUTE(app, "/ws").websocket(&app)
    .onopen([](crow::websocket::connection& conn) {
    CROW_LOG_INFO << "WebSocket opened from " << conn.get_remote_ip();
    conn.send_text("Welcome!");
        })
    .onmessage([](crow::websocket::connection& conn, const std::string& data, bool is_binary) {
            CROW_LOG_INFO << "Received: " << data;
            conn.send_text("Echo: " + data);
        })
            .onclose([](crow::websocket::connection& conn, const std::string& reason, uint16_t code) {
            CROW_LOG_INFO << "WebSocket closed: " << reason << " (" << code << ")";
                });
        */