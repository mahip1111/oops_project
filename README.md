# QuickFlow E-Commerce & Operations Fulfillment Network

A modular, enterprise-grade Apple e-commerce platform paired with an automated C++ Dijkstra logistics fulfillment engine and real-time operations command center.

**Author & Copyright**: © 2026 Manavendra Gupta. All Rights Reserved.  
**License**: MIT License (Attribution required for reproduction, modification, or distribution).

---

## 📁 Project Architecture & Directories

```
oops_project/
├── LICENSE                   # Official MIT License with Manavendra Gupta Copyright
├── customer-store/           # Apple Minimalist Customer Storefront (Port 3000)
│   ├── src/components/       # Hero Carousel, Flash Deals, Track Order (GPS Map + 8-Stage Flow), Modals, Audio
│   └── package.json
│
├── admin-dashboard/          # Operations Command Center (Port 3001)
│   ├── src/components/       # 4-Hub Grid, Live Orders Pipeline, AGV Robotics & Pickers, C++ Dijkstra Telemetry
│   └── package.json
│
├── backend-api/              # Node.js / Express REST API Gateway (Port 5000)
│   ├── server.js             # Unified order events, hub capacity sync, and telemetry broadcast
│   └── package.json
│
├── cpp-engine/               # High-Performance C++ Dijkstra Logistics Engine (Neutralinojs Layout)
│   ├── main.cpp              # Composition Root & Orchestrator
│   ├── domain/               # Domain Entities (Customer, SKU, Stock, Order)
│   ├── warehouse/            # SuperHub Network & Fleet
│   ├── core/                 # Concurrency & State Machine Invariants
│   ├── routing/              # Dijkstra Shortest Path Engine
│   ├── pipeline/             # Schedulers, Task Factory & Circuit Breaker
│   ├── observer/             # Telemetry & Observer Notification Layer
│   ├── simulation/           # 50,000 Order What-If Benchmark Matrix
│   ├── demo/                 # 9-Stage Architecture Demo Runner
│   ├── tests/                # Automated Unit Test Suite
│   └── CMakeLists.txt
│
├── .gitignore                # Git exclusions (node_modules, .vite, dist, logs)
└── package.json              # Unified scripts
```

---

## 🐳 One-Command Docker Deployment

You can start the entire ecosystem (Customer Store, Admin Dashboard, Backend API Gateway, and C++ Dijkstra Engine) with a single command:

```bash
docker compose up --build
```
Or in background detached mode:
```bash
npm run docker:up:d
```

### Container Endpoints:
- 🛍️ **Customer Store**: `http://localhost:3000`
- ⚙️ **Admin Command Center**: `http://localhost:3001`
- 🌐 **Backend REST & WebSocket API**: `http://localhost:5000`
- ⚡ **C++ Dijkstra Engine**: Runs as an optimized sub-millisecond execution container.

To stop all containers:
```bash
docker compose down
```

---

## 💻 Local Development Commands (Without Docker)

| Command | Description | Port / Target |
| :--- | :--- | :--- |
| `npm run dev:store` | Start Customer Storefront | `http://localhost:3000` |
| `npm run dev:admin` | Start Admin Command Center | `http://localhost:3001` |
| `npm run dev:api` | Start Backend API Gateway | `http://localhost:5000` |
| `npm run build:store` | Production build for Store | `customer-store/dist` |
| `npm run build:admin` | Production build for Admin | `admin-dashboard/dist` |

---

## 📜 License & Copyright

Copyright © 2026 **Manavendra Gupta**.

This software and its associated documentation files are licensed under the MIT License. You are free to use, modify, and distribute this software, provided that the original author copyright notice and license text remain intact in all copies, forks, or substantial portions of the software.
