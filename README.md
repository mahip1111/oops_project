# QuickFlow E-Commerce & Operations Fulfillment Network

A modular, enterprise-grade Apple e-commerce platform paired with an automated C++ Dijkstra logistics fulfillment engine and real-time operations command center.

---

## 📁 Project Architecture & Directories

```
oops_project/
├── customer-store/       # Apple Minimalist Customer Storefront (Port 3000)
│   ├── src/components/   # Hero Carousel, Flash Deals, Track Order (GPS Map + 8-Stage Flow), Modals, Audio
│   └── package.json
│
├── admin-dashboard/      # Operations Command Center (Port 3001)
│   ├── src/components/   # 4-Hub Grid, Live Orders Pipeline, AGV Robotics & Pickers, C++ Dijkstra Telemetry
│   └── package.json
│
├── backend-api/          # Node.js / Express REST API Gateway (Port 5000)
│   ├── server.js         # Unified order events, hub capacity sync, and telemetry broadcast
│   └── package.json
│
├── cpp-engine/           # High-Performance C++ Dijkstra Logistics Engine
│   ├── include/          # GraphRouter, Order, EventBus headers
│   ├── src/              # Sub-millisecond routing algorithms
│   └── CMakeLists.txt
│
├── .gitignore            # Git exclusions (node_modules, .vite, dist, logs)
└── package.json          # Unified scripts
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

## 🌟 Key Capabilities
- **Customer Storefront**: Authentic Apple design aesthetics, Web Audio sound effects, live countdown flash deals, trade-in calculator, interactive GPS courier van route tracking, secure delivery PIN (`7510`), and 8-stage vertical fulfillment pipeline.
- **Admin Command Center**: Real-time pallet monitoring across 4 national distribution superhubs (Delhi 72%, Mumbai 84%, Hyderabad 61%, Kolkata 96%), 1-click hub rebalancing, AGV robotics dispatch, and order retry queue.
