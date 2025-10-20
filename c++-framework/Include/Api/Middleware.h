#pragma once

#include "../lib/crow.h" // Middleware needs to know about crow::request/response

// Define your CORS middleware struct here, in a shared header file.
struct CORS {
    struct context {};

    void before_handle(crow::request& req, crow::response& res, context&) {
        if (req.method == "OPTIONS"_method) {
            res.code = 204;
            res.end();
        }
    }

    void after_handle(crow::request& req, crow::response& res, context&) {
        res.set_header("Access-Control-Allow-Origin", "*"); // Means all addresses
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
    }
};


// If you create other middleware in the future, you would add them here.
// struct LoggingMiddleware { ... };