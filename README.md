# Deep Learning Framework

End-to-end platform for building, training, and managing classical deep learning models. The project combines a high-performance C++ training engine, a Node.js/Express API layer, and a React dashboard so teams can upload datasets, configure models, monitor jobs, and review results from a single workspace.

## Architecture at a Glance

- `c++-framework/` — Crow-based HTTP/WebSocket service written in modern C++17. Uses Eigen for tensor math, OpenMP for parallelism, and custom layers/optimizers defined under `Include/` and `Src/`.
- `server/` — Node.js 20 + Express API backed by MongoDB. Handles auth, model metadata, process orchestration, and (per roadmap) async job management, experiment tracking, and dataset services.
- `view/` — React front end (Vite/CRA-style) that lets users authenticate, manage datasets/models/runs, and stream logs from the C++ backend.
- `docker-compose.yml` — Spins up the three services (React UI, Express API, Crow training core). Extend with Redis/MinIO as roadmap items land.
- `c++-framework/dataset/` — Sample MNIST and Titanic CSV splits for local experimentation and benchmarking.

## Key Capabilities

- Custom neural network construction with Dense/Convolutional layers, activation & loss factories, regularization, and hyperparameter search utilities.
- Dataset ingestion utilities (`DatasetLoader`, preprocessing helpers) that align CSV inputs with the C++ core.
- REST + WebSocket control plane for submitting training runs, monitoring progress, and retrieving metrics.
- React dashboard with auth, model builder, process monitoring, and future experiment tracking views.
- Docker-first deployment across training core, API, and UI with production-ready images.

## Repository Layout

```
.
├── c++-framework/        # C++17 training engine + Crow server
│   ├── Include/          # Public headers (layers, activations, utils, API)
│   ├── Src/              # Implementation files
│   ├── lib/              # Third-party deps (Crow, Asio, Eigen)
│   ├── dataset/          # Sample MNIST/Titanic splits
│   └── Dockerfile
├── server/               # Express API + MongoDB models/routes
│   └── Dockerfile
├── view/                 # React client
│   └── Dockerfile
├── docker-compose.yml    # Orchestrates UI + API + C++ services
└── ROADMAP.md            # Feature roadmap & delivery plan
```

## Prerequisites

- CMake ≥ 3.15, a C++17 compiler (MSVC, clang, or g++), and Ninja/Make for the training core.
- Node.js ≥ 20 and npm ≥ 10 for both `server/` and `view/`.
- MongoDB instance (local or Atlas). Upcoming roadmap phases also expect Redis and MinIO/S3.
- Docker & Docker Compose (optional but recommended for parity builds).

## Getting Started (Local)

1. **Clone the repo**
   ```bash
   git clone https://github.com/BaMInnovation/Deep-Learning-Framework.git
   cd Deep-Learning-Framework
   ```

2. **Configure environment variables**
   Create `server/.env` with at least:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
   JWT_SECRET=replace_me
   PORT=5000
   ```
   Add any third-party keys (Redis, MinIO, OpenAI, etc.) as new roadmap features are implemented.

3. **Build the C++ training core**
   ```bash
   cd c++-framework
   cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
   cmake --build build
   ./build/out/server   # or run via your IDE/Visual Studio solution
   ```

4. **Run the Express API**
   ```bash
   cd server
   npm install
   npm run start          # or `node src/index.js`
   ```

5. **Start the React dashboard**
   ```bash
   cd view
   npm install
   npm run dev            # or `npm run build && npm run preview` for production
   ```

6. **Verify the flow**
   - Visit the UI (default `http://localhost:3000`)
   - API health: `GET http://localhost:5000/healthz`
   - C++ service: `GET http://localhost:18080/healthz` (see `RouteHandlers.cpp`)

### Running with Docker Compose

```bash
docker compose up --build
```

This launches:
- `react_ui` on port 80 (served via NGINX)
- `express_api` on port 5000
- `crow_service` on port 18080

Mount additional volumes or inject environment files as you add persistence (MongoDB, Redis, MinIO) to the stack.

## Data & Experiments

- Sample CSV files under `c++-framework/dataset/` help validate ingestion paths.
- `Include/Util Functions/HyperParameterSearch.h` and companions in `Src/Util Functions/` power manual grid/random search; Phase 1 of the roadmap brings async orchestration and tracking.
- Persisted models/runs/datasets will live in MongoDB collections as outlined in `ROADMAP.md`.

## Roadmap & Next Steps

`ROADMAP.md` details a 12-week plan covering:
- Async job submission & workers via BullMQ/Redis
- Model persistence/versioning and experiment tracking
- Data upload, profiling, and preprocessing pipelines
- LLM copilot for model design, tuning, and reporting

Consult that document before picking up new work to stay aligned with sequencing and acceptance criteria.

## Contributing

1. Fork and create a feature branch.
2. Keep changes scoped to one feature/story; add tests where possible (Jest/Cypress for JS, Catch2/GoogleTest for C++).
3. Run formatters/linters (`clang-format`, ESLint, Prettier) prior to opening PRs.
4. Document behavioral changes in this README or dedicated docs.

## Support

- Use GitHub issues for bugs/feature requests.
- Document architecture decisions, API contracts, and test plans under `Doc/` for future contributors.

Happy modeling!

