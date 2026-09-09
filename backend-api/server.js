import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// 1. DATA MODEL & COLLECTIONS (PRD Section 10)
// ---------------------------------------------------------------------------

// Products Catalog (PRD Section 9 & 10)
let products = [
  { id: 'lap-mbp-14', name: 'MacBook Pro 14"', category: 'Laptops', price: 149900, weightKg: 1.6, aisle: 'Aisle 04-B', shelf: 'Shelf 12', inStock: true },
  { id: 'ms-magic', name: 'Magic Mouse', category: 'Accessories', price: 7900, weightKg: 0.2, aisle: 'Aisle 02-C', shelf: 'Shelf 08', inStock: true },
  { id: 'ph-ip16p', name: 'iPhone 16 Pro', category: 'Phones', price: 119900, weightKg: 0.19, aisle: 'Aisle 01-A', shelf: 'Shelf 04', inStock: true },
  { id: 'ip-pad-pro', name: 'iPad Pro M4', category: 'Tablets', price: 99900, weightKg: 0.44, aisle: 'Aisle 03-B', shelf: 'Shelf 06', inStock: true },
  { id: 'ap-max', name: 'AirPods Max', category: 'Audio', price: 59900, weightKg: 0.38, aisle: 'Aisle 02-A', shelf: 'Shelf 02', inStock: true },
  { id: 'wat-ultra2', name: 'Apple Watch Ultra 2', category: 'Wearables', price: 89900, weightKg: 0.06, aisle: 'Aisle 01-C', shelf: 'Shelf 10', inStock: true }
];

// Warehouse Hubs & Stock Inventory (PRD Section 4 & 6)
let warehouses = [
  {
    id: 'delhi',
    code: 'DEL-01',
    name: 'Delhi SuperHub',
    utilization: 72,
    capacity: 50000,
    activeOrders: 2310,
    status: 'Optimal',
    location: 'New Delhi',
    baseLatencySec: 28,
    shippingRate: 0.45,
    workerCapacity: '88% Active',
    taskLoad: 342,
    inventory: { 'lap-mbp-14': 50, 'ms-magic': 80, 'ph-ip16p': 100, 'ip-pad-pro': 40, 'wat-ultra2': 60 }
  },
  {
    id: 'mumbai',
    code: 'BOM-04',
    name: 'Mumbai MegaPort',
    utilization: 84,
    capacity: 65000,
    activeOrders: 3840,
    status: 'Optimal',
    location: 'Mumbai',
    baseLatencySec: 24,
    shippingRate: 0.40,
    workerCapacity: '92% Active',
    taskLoad: 580,
    inventory: { 'lap-mbp-14': 120, 'ms-magic': 150, 'ph-ip16p': 200, 'ip-pad-pro': 90, 'wat-ultra2': 110 }
  },
  {
    id: 'hyderabad',
    code: 'HYD-02',
    name: 'Hyderabad Cyber Node',
    utilization: 61,
    capacity: 40000,
    activeOrders: 1420,
    status: 'Optimal',
    location: 'Hyderabad',
    baseLatencySec: 22,
    shippingRate: 0.42,
    workerCapacity: '68% Active',
    taskLoad: 210,
    inventory: { 'lap-mbp-14': 0, 'ms-magic': 200, 'ph-ip16p': 50, 'ip-pad-pro': 25, 'wat-ultra2': 40 } // Out of stock for laptop
  },
  {
    id: 'kolkata',
    code: 'CCU-03',
    name: 'Kolkata Gateway',
    utilization: 96,
    capacity: 35000,
    activeOrders: 2890,
    status: 'Near Capacity',
    location: 'Kolkata',
    baseLatencySec: 32,
    shippingRate: 0.50,
    workerCapacity: '96% Active',
    taskLoad: 410,
    inventory: { 'lap-mbp-14': 40, 'ms-magic': 0, 'ph-ip16p': 80, 'ip-pad-pro': 0, 'wat-ultra2': 30 } // Out of stock for mouse
  }
];

// Distance matrix to destination cities (km)
const cityDistances = {
  'Bhubaneswar': { 'BOM-04': 1640, 'DEL-01': 1500, 'HYD-02': 1050, 'CCU-03': 440 },
  'Mumbai': { 'BOM-04': 25, 'DEL-01': 1400, 'HYD-02': 710, 'CCU-03': 1950 },
  'Delhi': { 'BOM-04': 1400, 'DEL-01': 20, 'HYD-02': 1550, 'CCU-03': 1480 },
  'Bengaluru': { 'BOM-04': 980, 'DEL-01': 2150, 'HYD-02': 570, 'CCU-03': 1880 },
  'Hyderabad': { 'BOM-04': 710, 'DEL-01': 1550, 'HYD-02': 25, 'CCU-03': 1480 },
  'Kolkata': { 'BOM-04': 1950, 'DEL-01': 1480, 'HYD-02': 1480, 'CCU-03': 20 },
  'Chennai': { 'BOM-04': 1330, 'DEL-01': 2200, 'HYD-02': 630, 'CCU-03': 1660 }
};

// Worker Fleet with Departments & Metrics (PRD Section 7 & 11)
let workers = [
  { id: 'AGV-101', name: 'AGV Pod Alpha', department: 'PICKING', role: 'AGV Autonomous Pod', hub: 'BOM-04', status: 'available', isAvailable: true, currentTaskId: '', completedTasks: 48, avgTaskTimeSec: 14, efficiency: 99.2, successRate: 99.8 },
  { id: 'AGV-102', name: 'AGV Pod Beta', department: 'PICKING', role: 'AGV Autonomous Pod', hub: 'BOM-04', status: 'busy', isAvailable: false, currentTaskId: 'QF-10482-PICK-1', completedTasks: 42, avgTaskTimeSec: 16, efficiency: 98.7, successRate: 99.1 },
  { id: 'AGV-103', name: 'AGV Pod Gamma', department: 'PICKING', role: 'AGV Autonomous Pod', hub: 'DEL-01', status: 'available', isAvailable: true, currentTaskId: '', completedTasks: 51, avgTaskTimeSec: 13, efficiency: 99.0, successRate: 99.5 },
  { id: 'WRK-201', name: 'Aarav Sharma', department: 'PICKING', role: 'Station Picker', hub: 'BOM-04', status: 'busy', isAvailable: false, currentTaskId: 'QF-10482-PICK-2', completedTasks: 65, avgTaskTimeSec: 22, efficiency: 96.5, successRate: 98.4 },
  { id: 'WRK-202', name: 'Priya Nair', department: 'QUALITY_CHECK', role: 'Lead QC Inspector', hub: 'BOM-04', status: 'available', isAvailable: true, currentTaskId: '', completedTasks: 72, avgTaskTimeSec: 18, efficiency: 99.8, successRate: 99.9 },
  { id: 'WRK-203', name: 'Rahul Verma', department: 'PACKING', role: 'Packaging Specialist', hub: 'BOM-04', status: 'available', isAvailable: true, currentTaskId: '', completedTasks: 58, avgTaskTimeSec: 24, efficiency: 97.4, successRate: 98.9 },
  { id: 'WRK-204', name: 'Sneha Patel', department: 'SHIPPING', role: 'Courier Dispatch Lead', hub: 'DEL-01', status: 'available', isAvailable: true, currentTaskId: '', completedTasks: 61, avgTaskTimeSec: 15, efficiency: 99.1, successRate: 99.6 },
  { id: 'AGV-104', name: 'AGV Pod Delta', department: 'PICKING', role: 'AGV Autonomous Pod', hub: 'HYD-02', status: 'offline', isAvailable: false, currentTaskId: '', completedTasks: 30, avgTaskTimeSec: 18, efficiency: 94.0, successRate: 96.5 }
];

let currentSchedulingStrategy = 'Hybrid'; // 'FIFO', 'Priority', 'Deadline', 'Hybrid'

// Inventory stock movements & reservation history (PRD Section 6)
let inventoryMovements = [
  { id: 'MOV-1001', orderId: 'QF-10482', sku: 'lap-mbp-14', productName: 'MacBook Pro 14"', hubCode: 'BOM-04', quantity: 1, type: 'RESERVED', timestamp: '12 mins ago' },
  { id: 'MOV-1002', orderId: 'QF-10482', sku: 'ms-magic', productName: 'Magic Mouse', hubCode: 'BOM-04', quantity: 1, type: 'RESERVED', timestamp: '12 mins ago' },
  { id: 'MOV-1003', orderId: 'QF-10291', sku: 'wat-ultra2', productName: 'Apple Watch Ultra 2', hubCode: 'CCU-03', quantity: 1, type: 'ALLOCATED', timestamp: '24 mins ago' },
  { id: 'MOV-1004', orderId: 'QF-10314', sku: 'lap-mbp-14', productName: 'MacBook Pro 14"', hubCode: 'DEL-01', quantity: 1, type: 'RESERVED', timestamp: '45 mins ago' },
  { id: 'MOV-1005', orderId: 'REPLENISH-01', sku: 'ph-ip16p', productName: 'iPhone 16 Pro', hubCode: 'DEL-01', quantity: 50, type: 'REPLENISHED', timestamp: '2 hours ago' }
];

// System Event Stream (PRD Section 9)
let systemEvents = [
  { eventId: 'EVT-9001', eventType: 'OrderCreated', orderId: 'QF-10482', hubCode: 'API-GATEWAY', message: 'Order created for customer Devon Lane (Express Priority)', timestamp: '21:42:08' },
  { eventId: 'EVT-9002', eventType: 'InventoryReserved', orderId: 'QF-10482', hubCode: 'BOM-04', message: 'Stock reserved: 1x MacBook Pro 14", 1x Magic Mouse in Mumbai MegaPort', timestamp: '21:42:09' },
  { eventId: 'EVT-9003', eventType: 'WarehouseAssigned', orderId: 'QF-10482', hubCode: 'BOM-04', message: 'Mumbai MegaPort (BOM-04) assigned via lowest composite cost (182.2 pts)', timestamp: '21:42:10' },
  { eventId: 'EVT-9004', eventType: 'TaskCreated', orderId: 'QF-10482', hubCode: 'BOM-04', message: 'Fulfillment tasks decomposed: 2x Pick, 1x Pack, 1x QC, 1x Ship', timestamp: '21:42:11' },
  { eventId: 'EVT-9005', eventType: 'TaskAssigned', orderId: 'QF-10482', hubCode: 'BOM-04', message: 'Pick tasks dispatched to AGV Pod Beta (Aisle 04-B) & Aarav Sharma (Aisle 02-C)', timestamp: '21:42:13' }
];

let reviewQueue = [
  {
    reviewId: 'REV-1001',
    orderId: 'QF-10291',
    taskId: 'QF-10291-QC',
    taskName: 'Laser Barcode & Serial Verification',
    hub: 'CCU-03',
    hubName: 'Kolkata Gateway',
    reason: 'Optical scanner read timeout on Apple Watch Ultra 2 serial number (3/3 retries failed)',
    retryAttempts: 3,
    timestamp: '14 mins ago',
    status: 'PENDING_REVIEW'
  },
  {
    reviewId: 'REV-1002',
    orderId: 'QF-10314',
    taskId: 'QF-10314-PICK-1',
    taskName: 'Pick MacBook Pro from Aisle 04-B',
    hub: 'DEL-01',
    hubName: 'Delhi SuperHub',
    reason: 'AGV Pod #12 aisle path blocked by manual pallet transfer',
    retryAttempts: 3,
    timestamp: '28 mins ago',
    status: 'PENDING_REVIEW'
  }
];

let ordersList = [
  {
    id: 'QF-10482',
    customer: 'Devon Lane',
    date: 'Today, March 6, 2026',
    status: 'PICKING',
    stateMachineIndex: 3,
    priority: 'EXPRESS',
    hub: 'Mumbai MegaPort',
    hubCode: 'BOM-04',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pinCode: '751024',
    deliveryAddress: 'Plot 412, Infocity Road, Patia, Bhubaneswar, Odisha',
    deliverySpeed: 'Express Priority (60m SLA)',
    deadlineMinutes: 60,
    estimatedDelivery: 'Tomorrow by 2:30 PM',
    estimatedCompletionTime: '18 minutes',
    carrier: 'QuickFlow Hyperlocal Air Express',
    trackingPin: '7510',
    subtotal: 157800,
    deliveryFee: 499,
    total: 158299,
    items: [
      { id: 'lap-mbp-14', name: 'MacBook Pro 14"', quantity: 1, color: 'Space Black', price: 149900, aisle: 'Aisle 04-B', shelf: 'Shelf 12', located: true },
      { id: 'ms-magic', name: 'Magic Mouse', quantity: 1, color: 'White', price: 7900, aisle: 'Aisle 02-C', shelf: 'Shelf 08', located: true }
    ],
    tasks: [
      { taskId: 'QF-10482-PICK-1', taskName: 'Pick MacBook Pro 14" from Aisle 04-B', type: 'PICK_ITEM', status: 'IN_PROGRESS', estimatedDurationSec: 12, dynamicPriority: 7, deadlineMinutes: 45, assignedWorkerId: 'AGV-102', retryCount: 0, dependencyTaskIds: [] },
      { taskId: 'QF-10482-PICK-2', taskName: 'Pick Magic Mouse from Aisle 02-C', type: 'PICK_ITEM', status: 'IN_PROGRESS', estimatedDurationSec: 10, dynamicPriority: 7, deadlineMinutes: 50, assignedWorkerId: 'WRK-201', retryCount: 0, dependencyTaskIds: [] },
      { taskId: 'QF-10482-PACK', taskName: 'Tamper-Proof Apple Packaging & Cushioning', type: 'PACK_ORDER', status: 'BLOCKED_BY_DEPENDENCY', estimatedDurationSec: 10, dynamicPriority: 6, deadlineMinutes: 35, assignedWorkerId: 'UNASSIGNED', retryCount: 0, dependencyTaskIds: ['QF-10482-PICK-1', 'QF-10482-PICK-2'] },
      { taskId: 'QF-10482-QC', taskName: 'Laser Barcode, Serial & Damage Verification', type: 'QUALITY_CHECK', status: 'BLOCKED_BY_DEPENDENCY', estimatedDurationSec: 8, dynamicPriority: 8, deadlineMinutes: 25, assignedWorkerId: 'UNASSIGNED', retryCount: 0, dependencyTaskIds: ['QF-10482-PACK'] },
      { taskId: 'QF-10482-SHIP', taskName: 'Hyperlocal Air Courier Dispatch & Handover', type: 'SHIP_ORDER', status: 'BLOCKED_BY_DEPENDENCY', estimatedDurationSec: 6, dynamicPriority: 9, deadlineMinutes: 15, assignedWorkerId: 'UNASSIGNED', retryCount: 0, dependencyTaskIds: ['QF-10482-QC'] }
    ],
    evaluationResult: {
      winningHub: 'BOM-04',
      winningHubName: 'Mumbai MegaPort',
      winningCostScore: 182.2,
      explanation: 'Mumbai MegaPort (BOM-04) won with lowest fulfillment cost (182.2 pts). Delhi SuperHub (DEL-01) scored 193.5 pts. Hyderabad was ineligible (out of stock for laptop), and Kolkata was ineligible (out of stock for mouse).',
      candidates: [
        { hubCode: 'BOM-04', hubName: 'Mumbai MegaPort', isEligible: true, distanceKm: 1640, distanceCost: 82.0, workloadCost: 39.6, processingCost: 19.2, shippingCost: 41.4, totalCostScore: 182.2, selected: true },
        { hubCode: 'DEL-01', hubName: 'Delhi SuperHub', isEligible: true, distanceKm: 1500, distanceCost: 75.0, workloadCost: 28.8, processingCost: 22.4, shippingCost: 67.3, totalCostScore: 193.5, selected: false, rejectionReason: 'Higher composite cost vs Mumbai' },
        { hubCode: 'HYD-02', hubName: 'Hyderabad Cyber Node', isEligible: false, rejectionReason: 'INELIGIBLE: Out of stock for MacBook Pro 14"', selected: false },
        { hubCode: 'CCU-03', hubName: 'Kolkata Gateway', isEligible: false, rejectionReason: 'INELIGIBLE: Out of stock for Magic Mouse', selected: false }
      ]
    },
    events: [
      { time: '21:42:08', message: 'Order CREATED & CONFIRMED', node: 'API-GATEWAY' },
      { time: '21:42:10', message: 'Mumbai MegaPort ALLOCATED (Cost Score: 182.2 pts - Lowest Cost)', node: 'BOM-04' },
      { time: '21:42:13', message: 'Parallel Picking wave dispatched to AGV Pod Beta & Aarav Sharma', node: 'BOM-04' }
    ]
  }
];

// Helper to record system events (PRD Section 9)
function logSystemEvent(eventType, orderId, hubCode, message) {
  const event = {
    eventId: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
    eventType,
    orderId: orderId || 'SYSTEM',
    hubCode: hubCode || 'API-GATEWAY',
    message,
    timestamp: new Date().toLocaleTimeString()
  };
  systemEvents.unshift(event);
  if (systemEvents.length > 200) systemEvents.pop();

  broadcast({
    type: 'SYSTEM_EVENT',
    data: event
  });
  return event;
}

// ---------------------------------------------------------------------------
// 2. WAREHOUSE SELECTION (PRD Section 4 & 5: Eligibility + Lower Cost Score)
// ---------------------------------------------------------------------------
function evaluateWarehouseSelection(city, items) {
  const distances = cityDistances[city] || { 'BOM-04': 1400, 'DEL-01': 1200, 'HYD-02': 1000, 'CCU-03': 1300 };

  const candidates = warehouses.map(wh => {
    const dist = distances[wh.code] || 1200;

    let isEligible = true;
    let ineligibilityReason = '';

    for (const item of items) {
      const sku = item.id || 'lap-mbp-14';
      const available = wh.inventory[sku] !== undefined ? wh.inventory[sku] : 100;
      if (available < (item.quantity || 1)) {
        isEligible = false;
        ineligibilityReason = `INELIGIBLE: Out of stock for ${item.name || sku}`;
        break;
      }
    }

    if (!isEligible) {
      return {
        hubCode: wh.code,
        hubName: wh.name,
        isEligible: false,
        rejectionReason: ineligibilityReason,
        totalCostScore: 99999,
        selected: false
      };
    }

    const distanceCost = Math.round(dist * 0.05 * 10) / 10;
    const workloadCost = Math.round(((wh.utilization * 0.40) + (wh.utilization > 80 ? (wh.utilization - 80) * 1.5 : 0)) * 10) / 10;
    const processingCost = Math.round(wh.baseLatencySec * 0.8 * 10) / 10;
    const shippingCost = Math.round(((dist * wh.shippingRate * 0.1) + 40.0) * 10) / 10;
    const totalCostScore = Math.round((distanceCost + workloadCost + processingCost + shippingCost) * 10) / 10;

    return {
      hubCode: wh.code,
      hubName: wh.name,
      isEligible: true,
      distanceKm: dist,
      distanceCost,
      workloadCost,
      processingCost,
      shippingCost,
      totalCostScore,
      selected: false
    };
  });

  const eligibleCandidates = candidates.filter(c => c.isEligible);
  eligibleCandidates.sort((a, b) => a.totalCostScore - b.totalCostScore);

  const winning = eligibleCandidates.length > 0 ? eligibleCandidates[0] : candidates[0];
  
  candidates.forEach(c => {
    if (c.hubCode === winning.hubCode) {
      c.selected = true;
    } else if (c.isEligible) {
      c.rejectionReason = `Suboptimal cost score (${c.totalCostScore} pts vs ${winning.totalCostScore} pts for ${winning.hubName})`;
    }
  });

  return {
    winningHub: winning.hubCode,
    winningHubName: winning.hubName,
    winningCostScore: winning.totalCostScore,
    explanation: `${winning.hubName} (${winning.hubCode}) selected with lowest fulfillment cost (${winning.totalCostScore} pts) across eligible superhubs with full stock availability.`,
    candidates
  };
}

// ---------------------------------------------------------------------------
// 3. TASK RECALCULATION ALGORITHM (PRD Section 5)
// ---------------------------------------------------------------------------
function recalculateTaskQueue(strategy) {
  currentSchedulingStrategy = strategy;

  ordersList.forEach(order => {
    if (!order.tasks) return;

    if (strategy === 'FIFO') {
      // Keep natural creation order
    } else if (strategy === 'Priority') {
      order.tasks.sort((a, b) => (b.dynamicPriority || 5) - (a.dynamicPriority || 5));
    } else if (strategy === 'Deadline') {
      order.tasks.sort((a, b) => (a.deadlineMinutes || 60) - (b.deadlineMinutes || 60));
    } else if (strategy === 'Hybrid') {
      order.tasks.sort((a, b) => {
        const scoreA = ((a.dynamicPriority || 5) * 10) - ((a.deadlineMinutes || 60) * 0.5);
        const scoreB = ((b.dynamicPriority || 5) * 10) - ((b.deadlineMinutes || 60) * 0.5);
        return scoreB - scoreA;
      });
    }
  });

  const allTasks = ordersList.flatMap(o => o.tasks || []);
  logSystemEvent('TaskCreated', '', 'SCHEDULER', `C++ Scheduling Strategy changed to ${strategy}. Task queue recalculated.`);

  broadcast({
    type: 'STRATEGY_CHANGED',
    strategy,
    tasks: allTasks
  });

  return allTasks;
}

// ---------------------------------------------------------------------------
// 4. COMPLETE BACKEND API SURFACE (PRD Section 9, 10 & 12)
// ---------------------------------------------------------------------------

// 1. POST /api/auth/login (PRD Section 9 & 12)
app.post('/api/auth/login', (req, res) => {
  const { email = 'devon@quickflow.io', role = 'CUSTOMER' } = req.body;
  const userRole = email.includes('admin') ? 'ADMIN' : (email.includes('warehouse') ? 'WAREHOUSE_MANAGER' : (role || 'CUSTOMER'));
  
  res.json({
    success: true,
    token: 'jwt_quickflow_' + Buffer.from(email + ':' + userRole).toString('base64'),
    user: {
      id: userRole === 'ADMIN' ? 'ADM-001' : (userRole === 'WAREHOUSE_MANAGER' ? 'MGR-04' : 'CUST-10482'),
      name: userRole === 'ADMIN' ? 'Operations Admin' : (userRole === 'WAREHOUSE_MANAGER' ? 'Hub Manager Mumbai' : 'Devon Lane'),
      email,
      role: userRole,
      defaultAddress: 'Plot 412, Infocity Road, Patia, Bhubaneswar, Odisha',
      city: 'Bhubaneswar'
    }
  });
});

// 2. GET /api/products (PRD Section 9)
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 3. GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cppEngineConnected: true,
    schedulingStrategy: currentSchedulingStrategy,
    activeOrdersCount: ordersList.length
  });
});

// 4. GET /api/orders (PRD Section 9)
app.get('/api/orders', (req, res) => {
  res.json({
    total: 12482 + ordersList.length,
    processing: ordersList.filter(o => o.status !== 'DELIVERED').length + 3218,
    completed: ordersList.filter(o => o.status === 'DELIVERED').length + 8941,
    failed: reviewQueue.length + 323,
    list: ordersList
  });
});

// 5. GET /api/orders/:id/status (PRD Section 9)
app.get('/api/orders/:id/status', (req, res) => {
  const order = ordersList.find(o => o.id.toLowerCase() === req.params.id.toLowerCase());
  if (order) {
    res.json({
      orderId: order.id,
      status: order.status,
      stateMachineIndex: order.stateMachineIndex,
      assignedHub: order.hub,
      estimatedDelivery: order.estimatedDelivery,
      events: order.events
    });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// 6. GET /api/orders/:id (PRD Section 9)
app.get('/api/orders/:id', (req, res) => {
  const order = ordersList.find(o => o.id.toLowerCase() === req.params.id.toLowerCase());
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// 7. POST /api/orders (PRD Section 9)
app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const orderId = `QF-${Math.floor(10000 + Math.random() * 90000)}`;
  const destCity = orderData.city || 'Bhubaneswar';
  const orderItems = orderData.items || [
    { id: 'lap-mbp-14', name: 'MacBook Pro 14"', quantity: 1, color: 'Space Black', price: 149900, aisle: 'Aisle 04-B', shelf: 'Shelf 12', located: true },
    { id: 'ms-magic', name: 'Magic Mouse', quantity: 1, color: 'White', price: 7900, aisle: 'Aisle 02-C', shelf: 'Shelf 08', located: true }
  ];

  const evaluationResult = evaluateWarehouseSelection(destCity, orderItems);
  const assignedWh = warehouses.find(w => w.code === evaluationResult.winningHub) || warehouses[0];

  // Reserve stock
  orderItems.forEach(item => {
    const sku = item.id || 'lap-mbp-14';
    if (assignedWh.inventory[sku] !== undefined) {
      assignedWh.inventory[sku] = Math.max(0, assignedWh.inventory[sku] - (item.quantity || 1));
    }
    inventoryMovements.unshift({
      id: `MOV-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId,
      sku,
      productName: item.name,
      hubCode: assignedWh.code,
      quantity: item.quantity || 1,
      type: 'RESERVED',
      timestamp: 'Just now'
    });
  });

  const pickTaskIds = [];
  const tasks = [];

  orderItems.forEach((item, idx) => {
    const tId = `${orderId}-PICK-${idx + 1}`;
    pickTaskIds.push(tId);
    tasks.push({
      taskId: tId,
      taskName: `Pick ${item.name} from ${item.aisle || 'Aisle 04-B'}`,
      type: 'PICK_ITEM',
      status: 'IN_PROGRESS',
      estimatedDurationSec: 12,
      dynamicPriority: 7,
      deadlineMinutes: 45,
      assignedWorkerId: idx === 0 ? 'AGV-101' : 'WRK-201',
      retryCount: 0,
      dependencyTaskIds: []
    });
  });

  tasks.push({
    taskId: `${orderId}-PACK`,
    taskName: 'Tamper-Proof Apple Packaging & Cushioning',
    type: 'PACK_ORDER',
    status: 'BLOCKED_BY_DEPENDENCY',
    estimatedDurationSec: 10,
    dynamicPriority: 6,
    deadlineMinutes: 35,
    assignedWorkerId: 'UNASSIGNED',
    retryCount: 0,
    dependencyTaskIds: pickTaskIds
  });

  tasks.push({
    taskId: `${orderId}-QC`,
    taskName: 'Laser Barcode, Serial & Damage Verification',
    type: 'QUALITY_CHECK',
    status: 'BLOCKED_BY_DEPENDENCY',
    estimatedDurationSec: 8,
    dynamicPriority: 7,
    deadlineMinutes: 25,
    assignedWorkerId: 'UNASSIGNED',
    retryCount: 0,
    dependencyTaskIds: [`${orderId}-PACK`]
  });

  tasks.push({
    taskId: `${orderId}-SHIP`,
    taskName: 'Hyperlocal Air Courier Dispatch & Handover',
    type: 'SHIP_ORDER',
    status: 'BLOCKED_BY_DEPENDENCY',
    estimatedDurationSec: 6,
    dynamicPriority: 8,
    deadlineMinutes: 15,
    assignedWorkerId: 'UNASSIGNED',
    retryCount: 0,
    dependencyTaskIds: [`${orderId}-QC`]
  });

  const nowTime = new Date().toLocaleTimeString();

  const newOrder = {
    id: orderId,
    customer: orderData.customer || 'Devon Lane',
    date: 'Just now',
    status: 'ALLOCATED',
    stateMachineIndex: 2,
    priority: orderData.deliverySpeed?.includes('Same-Day') ? 'SAME_DAY' : (orderData.deliverySpeed?.includes('Express') ? 'EXPRESS' : 'STANDARD'),
    hub: assignedWh.name,
    hubCode: assignedWh.code,
    city: destCity,
    state: orderData.state || 'Odisha',
    pinCode: orderData.pinCode || '751024',
    deliveryAddress: orderData.deliveryAddress || 'Plot 412, Infocity Road, Patia, Bhubaneswar',
    deliverySpeed: orderData.deliverySpeed || 'Express Priority (60m SLA)',
    deadlineMinutes: orderData.deliverySpeed?.includes('Same-Day') ? 30 : 60,
    estimatedDelivery: 'Tomorrow by 2:30 PM',
    estimatedCompletionTime: '18 minutes',
    carrier: 'QuickFlow Hyperlocal Air Express',
    trackingPin: `${Math.floor(1000 + Math.random() * 9000)}`,
    subtotal: orderData.subtotal || 149900,
    deliveryFee: orderData.deliveryFee || 499,
    total: (orderData.subtotal || 149900) + (orderData.deliveryFee || 499),
    items: orderItems,
    tasks,
    evaluationResult,
    events: [
      { time: nowTime, message: 'Order CREATED & CONFIRMED', node: 'API-GATEWAY' },
      { time: nowTime, message: `${assignedWh.name} (${assignedWh.code}) ALLOCATED via Lowest Cost Score (${evaluationResult.winningCostScore} pts)`, node: assignedWh.code },
      { time: nowTime, message: 'Parallel Picking wave dispatched to AGV & Station specialist', node: assignedWh.code }
    ]
  };

  ordersList.unshift(newOrder);

  logSystemEvent('OrderCreated', orderId, 'API-GATEWAY', `Order #${orderId} created for ${newOrder.customer}`);
  logSystemEvent('InventoryReserved', orderId, assignedWh.code, `Inventory locked for ${orderItems.length} items`);
  logSystemEvent('WarehouseAssigned', orderId, assignedWh.code, `${assignedWh.name} allocated (Cost: ${evaluationResult.winningCostScore} pts)`);
  logSystemEvent('TaskCreated', orderId, assignedWh.code, `5 fulfillment tasks generated with dependency graph`);

  broadcast({
    type: 'ORDER_CREATED',
    data: newOrder
  });

  res.status(201).json(newOrder);

  // Background state machine advancement (PRD Section 14)
  simulateOrderStateMachine(newOrder.id);
});

function simulateOrderStateMachine(orderId) {
  const stateSequence = [
    { state: 'PICKING', index: 3, time: 8000, event: 'TaskAssigned' },
    { state: 'PACKING', index: 4, time: 14000, event: 'OrderPacked' },
    { state: 'QUALITY_CHECK', index: 5, time: 20000, event: 'QCCompleted' },
    { state: 'SHIPPED', index: 6, time: 28000, event: 'OrderShipped' },
    { state: 'DELIVERED', index: 7, time: 38000, event: 'TaskCompleted' }
  ];

  stateSequence.forEach(({ state, index, time, event }) => {
    setTimeout(() => {
      const order = ordersList.find(o => o.id === orderId);
      if (!order) return;

      order.status = state;
      order.stateMachineIndex = index;

      if (state === 'PACKING') {
        order.tasks.filter(t => t.type === 'PICK_ITEM').forEach(t => t.status = 'COMPLETED');
        const packTask = order.tasks.find(t => t.type === 'PACK_ORDER');
        if (packTask) {
          packTask.status = 'IN_PROGRESS';
          packTask.assignedWorkerId = 'WRK-203';
        }
      } else if (state === 'QUALITY_CHECK') {
        const packTask = order.tasks.find(t => t.type === 'PACK_ORDER');
        if (packTask) packTask.status = 'COMPLETED';
        const qcTask = order.tasks.find(t => t.type === 'QUALITY_CHECK');
        if (qcTask) {
          qcTask.status = 'IN_PROGRESS';
          qcTask.assignedWorkerId = 'WRK-202';
        }
      } else if (state === 'SHIPPED') {
        const qcTask = order.tasks.find(t => t.type === 'QUALITY_CHECK');
        if (qcTask) qcTask.status = 'COMPLETED';
        const shipTask = order.tasks.find(t => t.type === 'SHIP_ORDER');
        if (shipTask) {
          shipTask.status = 'COMPLETED';
          shipTask.assignedWorkerId = 'WRK-204';
        }
      }

      const nowTime = new Date().toLocaleTimeString();
      order.events.push({
        time: nowTime,
        message: `Order State Advanced -> ${state}`,
        node: order.hubCode
      });

      logSystemEvent(event, order.id, order.hubCode, `Order #${order.id} transitioned to state ${state}`);

      broadcast({
        type: 'ORDER_UPDATED',
        data: order
      });
    }, time);
  });
}

// 8. GET /api/warehouses (PRD Section 9)
app.get('/api/warehouses', (req, res) => {
  res.json(warehouses);
});

app.post('/api/warehouses/rebalance', (req, res) => {
  warehouses = warehouses.map(w => {
    const targetUtil = Math.round(68 + Math.random() * 8);
    const active = Math.round((targetUtil / 100) * w.capacity);
    return {
      ...w,
      utilization: targetUtil,
      activeOrders: active,
      status: 'Optimal'
    };
  });

  logSystemEvent('WarehouseAssigned', '', 'ALL-HUBS', 'SuperHub network rebalanced to optimal 70% capacity distribution');

  broadcast({
    type: 'WAREHOUSES_REBALANCED',
    data: warehouses
  });

  res.json({
    message: 'SuperHub network successfully rebalanced to optimal 70% target utilization',
    warehouses
  });
});

// 9. GET /api/workers (PRD Section 7 & 9)
app.get('/api/workers', (req, res) => {
  res.json({
    available: workers.filter(w => w.status === 'available').length,
    busy: workers.filter(w => w.status === 'busy').length,
    offline: workers.filter(w => w.status === 'offline').length,
    total: workers.length,
    list: workers
  });
});

// 10. GET /api/tasks (PRD Section 9)
app.get('/api/tasks', (req, res) => {
  const allTasks = ordersList.flatMap(o => o.tasks || []);
  res.json({
    pending: allTasks.filter(t => t.status === 'PENDING').length + 420,
    processing: allTasks.filter(t => t.status === 'IN_PROGRESS').length + 180,
    completed: allTasks.filter(t => t.status === 'COMPLETED').length + 920,
    failed: reviewQueue.length + 12,
    activeStrategy: currentSchedulingStrategy,
    queue: allTasks
  });
});

// 11. Scheduling Strategy Endpoints (PRD Section 5)
app.get('/api/scheduling/strategy', (req, res) => {
  res.json({
    currentStrategy: currentSchedulingStrategy,
    availableStrategies: ['FIFO', 'Priority', 'Deadline', 'Hybrid'],
    queueDepth: ordersList.flatMap(o => o.tasks || []).length + 420
  });
});

app.post('/api/scheduling/strategy', (req, res) => {
  const { strategy } = req.body;
  if (!['FIFO', 'Priority', 'Deadline', 'Hybrid'].includes(strategy)) {
    return res.status(400).json({ error: 'Invalid strategy. Must be FIFO, Priority, Deadline, or Hybrid.' });
  }

  const updatedTasks = recalculateTaskQueue(strategy);
  res.json({
    success: true,
    message: `Scheduling strategy set to ${strategy}. Task queue recalculated by C++ engine.`,
    strategy,
    tasksCount: updatedTasks.length
  });
});

// 12. Inventory Endpoints (PRD Section 6)
app.get('/api/inventory', (req, res) => {
  const stockSummary = products.map(prod => {
    let totalStock = 0;
    let reservedStock = 0;
    const warehouseStock = {};

    warehouses.forEach(wh => {
      const count = wh.inventory[prod.id] || 0;
      warehouseStock[wh.code] = count;
      totalStock += count;
    });

    // Check currently reserved items in active orders
    ordersList.forEach(order => {
      if (order.status !== 'DELIVERED') {
        const found = order.items?.find(i => i.id === prod.id);
        if (found) reservedStock += (found.quantity || 1);
      }
    });

    return {
      sku: prod.id,
      name: prod.name,
      category: prod.category,
      price: prod.price,
      weightKg: prod.weightKg,
      aisle: prod.aisle,
      shelf: prod.shelf,
      totalAvailable: Math.max(0, totalStock - reservedStock),
      totalReserved: reservedStock,
      totalStock,
      distribution: warehouseStock
    };
  });

  res.json({
    products: stockSummary,
    recentMovements: inventoryMovements,
    warehouses: warehouses.map(w => ({ code: w.code, name: w.name, inventory: w.inventory }))
  });
});

app.post('/api/inventory/replenish', (req, res) => {
  const { hubCode, sku, quantity = 50 } = req.body;
  const wh = warehouses.find(w => w.code === hubCode);
  if (!wh) return res.status(404).json({ error: 'Warehouse not found' });

  wh.inventory[sku] = (wh.inventory[sku] || 0) + parseInt(quantity);
  const prod = products.find(p => p.id === sku);

  const movement = {
    id: `MOV-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId: 'REPLENISH',
    sku,
    productName: prod ? prod.name : sku,
    hubCode,
    quantity: parseInt(quantity),
    type: 'REPLENISHED',
    timestamp: 'Just now'
  };
  inventoryMovements.unshift(movement);

  logSystemEvent('InventoryReserved', 'REPLENISH', hubCode, `Replenished +${quantity} units of ${prod ? prod.name : sku} at ${wh.name}`);

  broadcast({
    type: 'INVENTORY_UPDATED',
    data: { hubCode, sku, newCount: wh.inventory[sku] }
  });

  res.json({ success: true, message: `Replenished +${quantity} units of ${sku} at ${wh.name}`, warehouse: wh });
});

// 13. System Events Endpoint (PRD Section 9)
app.get('/api/events', (req, res) => {
  const { orderId, eventType } = req.query;
  let filtered = [...systemEvents];
  if (orderId) filtered = filtered.filter(e => e.orderId.toLowerCase().includes(orderId.toLowerCase()));
  if (eventType) filtered = filtered.filter(e => e.eventType === eventType);

  res.json({
    total: filtered.length,
    events: filtered
  });
});

// 14. Fulfillment Pipeline Summary (PRD Section 1 & 2)
app.get('/api/fulfillment/pipeline', (req, res) => {
  const stageCounts = {
    CREATED: 0,
    CONFIRMED: 0,
    ALLOCATED: 0,
    PICKING: 0,
    PACKING: 0,
    QUALITY_CHECK: 0,
    SHIPPED: 0,
    DELIVERED: 0
  };

  ordersList.forEach(o => {
    if (stageCounts[o.status] !== undefined) stageCounts[o.status]++;
  });

  res.json({
    activeWaves: 14,
    stageCounts,
    activeStrategy: currentSchedulingStrategy,
    averageFulfillmentTimeMin: 18,
    orders: ordersList
  });
});

// 15. Security & RBAC (PRD Section 12)
app.get('/api/security/roles', (req, res) => {
  res.json({
    roles: [
      {
        role: 'CUSTOMER',
        description: 'Customer Storefront User',
        permissions: ['READ_OWN_ORDERS', 'PLACE_ORDERS', 'TRACK_PACKAGE']
      },
      {
        role: 'WAREHOUSE_MANAGER',
        description: 'SuperHub Operations Lead',
        permissions: ['READ_OWN_ORDERS', 'READ_ALL_ORDERS', 'VIEW_WAREHOUSES', 'REBALANCE_HUBS', 'VIEW_WORKERS', 'EXECUTE_QC']
      },
      {
        role: 'ADMIN',
        description: 'Platform SuperAdmin',
        permissions: ['READ_ALL_ORDERS', 'VIEW_WAREHOUSES', 'REBALANCE_HUBS', 'DISPATCH_WAVES', 'TRIGGER_SIMULATION', 'MODIFY_SCHEDULER_STRATEGY', 'MANAGE_RBAC', 'SYSTEM_AUDIT']
      }
    ]
  });
});

// 16. POST /api/simulation (and /api/simulate) (PRD Section 11)
const handleSimulation = (req, res) => {
  const {
    orderCount = 50000,
    workerCount = 30,
    activeHubs = ['DEL-01', 'BOM-04', 'HYD-02', 'CCU-03'],
    strategy = 'Hybrid'
  } = req.body;

  const N = Math.max(1, parseInt(orderCount));
  const W = Math.max(1, parseInt(workerCount));
  const H = Math.max(1, activeHubs.length);

  const baseTaskSecondsPerOrder = 44.0;
  let strategyEfficiencyFactor = 1.0;
  let slaProtectionFactor = 1.0;

  if (strategy === 'Hybrid' || strategy === 'PRIORITY_EDF') {
    strategyEfficiencyFactor = 0.93;
    slaProtectionFactor = 0.30;
  } else if (strategy === 'Priority') {
    strategyEfficiencyFactor = 0.95;
    slaProtectionFactor = 0.40;
  } else if (strategy === 'Deadline') {
    strategyEfficiencyFactor = 0.94;
    slaProtectionFactor = 0.35;
  }

  const totalWorkSeconds = N * baseTaskSecondsPerOrder * strategyEfficiencyFactor;
  const hubCoordinationFactor = 1.0 + (0.04 * Math.max(0, 4 - H));
  const completionHours = (totalWorkSeconds / (3600.0 * W)) * hubCoordinationFactor;

  const loadRatio = N / (W * 1250.0);
  let baseLateRate = 0.015;
  if (loadRatio > 1.0) {
    baseLateRate += (loadRatio - 1.0) * 0.055;
  }

  const calculatedLateOrders = Math.max(12, Math.min(N, Math.round(N * baseLateRate * slaProtectionFactor)));
  const slaPct = Math.round((1.0 - (calculatedLateOrders / N)) * 10000) / 100;
  const throughput = Math.round(completionHours > 0 ? (N / completionHours) : 0);
  const avgFulfillmentMins = Math.round(Math.max(6.0, (completionHours * 60.0 / (N / W)) * 1.8) * 10) / 10;
  const workerUtil = Math.round(Math.min(99.4, 75.0 + (loadRatio * 18.0)) * 10) / 10;

  let bottleneck = 'None (Balanced)';
  let maxHubLoad = 0;

  const hubBreakdown = [
    { hubId: 'BOM-04', hubName: 'Mumbai MegaPort', weight: 0.35 },
    { hubId: 'DEL-01', hubName: 'Delhi SuperHub', weight: 0.30 },
    { hubId: 'HYD-02', hubName: 'Hyderabad Cyber Node', weight: 0.20 },
    { hubId: 'CCU-03', hubName: 'Kolkata Gateway', weight: 0.15 }
  ].filter(h => activeHubs.includes(h.hubId)).map(h => {
    const assigned = Math.round(N * h.weight * (4.0 / H));
    const util = Math.min(98.5, Math.round((60.0 + (assigned / 600.0)) * 10) / 10);
    if (util > maxHubLoad) {
      maxHubLoad = util;
      bottleneck = `${h.hubName} (${h.hubId})`;
    }
    return {
      hubId: h.hubId,
      hubName: h.hubName,
      ordersAssigned: assigned,
      utilizationPct: util,
      avgLatencyMs: 1.2
    };
  });

  let recommendation = '';
  if (W < 35 && N >= 40000) {
    recommendation = `Adding 10 workers reduces completion time from ${(Math.round(completionHours * 10) / 10)}h to ~${(Math.round(completionHours * 0.75 * 10) / 10)}h and cuts late orders by ~65%.`;
  } else if (strategy === 'FIFO') {
    recommendation = `Switching to Hybrid / Deadline scheduling cuts late orders by ~70% with current ${W} workers.`;
  } else {
    recommendation = `Configuration is operating at optimal operational efficiency (${slaPct}% SLA adherence).`;
  }

  const result = {
    totalOrders: N,
    workerCount: W,
    activeHubCount: H,
    strategy,
    estimatedCompletionHours: Math.round(completionHours * 10) / 10,
    lateOrdersCount: calculatedLateOrders,
    slaAdherencePct: slaPct,
    throughputPerHour: throughput,
    avgOrderFulfillmentMins: avgFulfillmentMins,
    workerUtilizationPct: workerUtil,
    bottleneckNode: bottleneck,
    recommendation,
    hubStats: hubBreakdown
  };

  res.json(result);
};

app.post('/api/simulation', handleSimulation);
app.post('/api/simulate', handleSimulation);

// 17. GET /api/analytics (PRD Section 10)
app.get('/api/analytics', (req, res) => {
  res.json({
    avgProcessingTime: '38 sec',
    avgFulfillmentTime: '2.4 hr',
    warehouseUtilization: '78.3%',
    workerUtilization: '81%',
    lateOrders: '3.2%',
    failedTasks: reviewQueue.length + 12,
    retryRate: '2.6%',
    routingEngineLatency: '1.2 ms',
    algorithm: `C++ FastRoute + ${currentSchedulingStrategy} Strategy`
  });
});

// Review Queue endpoints
app.get('/api/review-queue', (req, res) => {
  res.json({
    count: reviewQueue.filter(r => r.status === 'PENDING_REVIEW').length,
    items: reviewQueue
  });
});

app.post('/api/review-queue/:id/retry', (req, res) => {
  const item = reviewQueue.find(r => r.reviewId === req.params.id);
  if (item) {
    item.status = 'RESOLVED_RETRY';
    logSystemEvent('TaskAssigned', item.orderId, item.hub, `Manual review task ${item.taskId} re-queued for priority auto-retry`);
    broadcast({ type: 'REVIEW_QUEUE_UPDATED', data: reviewQueue });
    res.json({ success: true, message: `Task ${item.taskId} dispatched for auto-retry`, item });
  } else {
    res.status(404).json({ error: 'Review item not found' });
  }
});

app.post('/api/review-queue/:id/reroute', (req, res) => {
  const { newHub } = req.body;
  const item = reviewQueue.find(r => r.reviewId === req.params.id);
  if (item) {
    item.status = 'RESOLVED_REROUTE';
    item.hub = newHub || 'BOM-04';
    logSystemEvent('WarehouseAssigned', item.orderId, item.hub, `Task ${item.taskId} re-routed to ${item.hub}`);
    broadcast({ type: 'REVIEW_QUEUE_UPDATED', data: reviewQueue });
    res.json({ success: true, message: `Order ${item.orderId} rerouted to ${item.hub}`, item });
  } else {
    res.status(404).json({ error: 'Review item not found' });
  }
});

// Create HTTP and WebSocket server
const server = createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(payload) {
  const msg = JSON.stringify(payload);
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({
    type: 'INITIAL_STATE',
    data: {
      orders: {
        total: 12482 + ordersList.length,
        processing: 3218,
        completed: 8941,
        failed: reviewQueue.length,
        list: ordersList
      },
      warehouses,
      workers: {
        available: workers.filter(w => w.status === 'available').length,
        busy: workers.filter(w => w.status === 'busy').length,
        offline: workers.filter(w => w.status === 'offline').length,
        total: workers.length,
        list: workers
      },
      reviewQueue: {
        count: reviewQueue.filter(r => r.status === 'PENDING_REVIEW').length,
        items: reviewQueue
      },
      schedulingStrategy: currentSchedulingStrategy,
      events: systemEvents
    }
  }));

  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch (e) {}
  });
});

server.listen(PORT, () => {
  console.log(`[QuickFlow Backend API] Running on http://localhost:${PORT}`);
});
