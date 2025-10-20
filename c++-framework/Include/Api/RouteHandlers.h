#pragma once

#include "../../lib/crow.h"

// stack (like your crow::App<CORS>). This is a robust pattern.
template <typename... Middlewares>
void register_routes(crow::App<Middlewares...>& app);

