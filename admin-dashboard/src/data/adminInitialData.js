// Exact operational telemetry required for the Enterprise Admin Command Center

export const INITIAL_METRICS = {
  orders: {
    total: 12482,
    processing: 3218,
    completed: 8941,
    failed: 323,
    todayGrowth: '+14.8%',
    revenueToday: '$1,489,200',
    avgFulfillmentTime: '28 mins'
  },
  warehouse: {
    delhi: 72,
    mumbai: 84,
    hyderabad: 61,
    kolkata: 96
  },
  warehouses: [
    {
      id: 'delhi-hub',
      city: 'Delhi',
      name: 'Delhi Northern SuperHub (NCR-01)',
      capacityPercentage: 72,
      maxPallets: 45000,
      occupiedPallets: 32400,
      activeDocks: '12 / 16 Docks Active',
      status: 'optimal',
      manager: 'Rajesh K. Sharma',
      temperature: '19.4°C Controlled',
      inboundHourly: 420,
      outboundHourly: 610,
      color: '#38bdf8' // Cyan
    },
    {
      id: 'mumbai-hub',
      city: 'Mumbai',
      name: 'Mumbai West MegaPort (BOM-04)',
      capacityPercentage: 84,
      maxPallets: 60000,
      occupiedPallets: 50400,
      activeDocks: '18 / 20 Docks Active',
      status: 'heavy',
      manager: 'Ananya Deshmukh',
      temperature: '21.0°C Controlled',
      inboundHourly: 690,
      outboundHourly: 840,
      color: '#818cf8' // Indigo
    },
    {
      id: 'hyderabad-hub',
      city: 'Hyderabad',
      name: 'Hyderabad Cyber Logistics Hub (HYD-02)',
      capacityPercentage: 61,
      maxPallets: 38000,
      occupiedPallets: 23180,
      activeDocks: '10 / 14 Docks Active',
      status: 'optimal',
      manager: 'Kalyan Chakravarthy',
      temperature: '20.2°C Controlled',
      inboundHourly: 310,
      outboundHourly: 490,
      color: '#34d399' // Emerald
    },
    {
      id: 'kolkata-hub',
      city: 'Kolkata',
      name: 'Kolkata Eastern Gateway (CCU-03)',
      capacityPercentage: 96,
      maxPallets: 32000,
      occupiedPallets: 30720,
      activeDocks: '11 / 12 Docks Maxed',
      status: 'critical',
      manager: 'Subhash Mukherjee',
      temperature: '22.5°C Monitored',
      inboundHourly: 540,
      outboundHourly: 410,
      color: '#f43f5e' // Rose Red (Alert)
    }
  ],
  workers: {
    available: 18,
    busy: 37,
    offline: 2,
    total: 57,
    avgEfficiency: '97.4%',
    shiftLeader: 'Vikram Mehta (Lead Dispatcher)'
  },
  tasks: {
    pending: 420,
    processing: 180,
    completed: 920,
    failed: 12,
    total: 1532,
    avgDispatchQueueTime: '4.2 mins'
  },
  analytics: {
    avgOrderProcessing: '38 sec',
    avgOrderProcessingRaw: 38,
    avgFulfillment: '2.4 hr',
    avgFulfillmentRaw: 2.4,
    warehouseUtilization: '78.3%',
    workerUtilization: '81%',
    workerUtilizationRaw: 81,
    lateOrders: '3.2%',
    lateOrdersCount: 399,
    failedTasks: 12,
    failedTasksRate: '0.8%',
    retryRate: '2.6%',
    retryRecoverySuccess: '91.4%',
    slaCompliance: '96.8%',
    hourlyProcessingCurve: [
      { time: '06:00', orders: 120, avgTime: '42s' },
      { time: '08:00', orders: 480, avgTime: '39s' },
      { time: '10:00', orders: 1150, avgTime: '38s' },
      { time: '12:00', orders: 1820, avgTime: '36s' },
      { time: '14:00', orders: 1640, avgTime: '37s' },
      { time: '16:00', orders: 1420, avgTime: '38s' },
      { time: '18:00', orders: 1980, avgTime: '41s' },
      { time: '20:00', orders: 1210, avgTime: '35s' }
    ],
    hubBenchmarks: [
      { city: 'Delhi', processing: '34 sec', fulfillment: '2.1 hr', warehouseUtil: '72%', workerUtil: '84%', lateRate: '2.8%', sla: '97.2%' },
      { city: 'Mumbai', processing: '36 sec', fulfillment: '2.3 hr', warehouseUtil: '84%', workerUtil: '88%', lateRate: '3.4%', sla: '96.6%' },
      { city: 'Hyderabad', processing: '32 sec', fulfillment: '1.9 hr', warehouseUtil: '61%', workerUtil: '74%', lateRate: '1.9%', sla: '98.1%' },
      { city: 'Kolkata', processing: '49 sec', fulfillment: '3.2 hr', warehouseUtil: '96%', workerUtil: '82%', lateRate: '4.8%', sla: '95.2%' }
    ]
  }
};

export const INITIAL_ORDERS_ROSTER = [
  {
    id: 'ORD-12482',
    customer: 'Aarav Patel',
    city: 'Mumbai',
    hub: 'Mumbai (BOM-04)',
    items: 'iPhone 16 Pro Max 256GB Desert Titanium x 1',
    amount: '$1,199',
    status: 'Processing',
    priority: 'High',
    placedAt: '2 mins ago',
    courier: 'Express Courier Bay 4'
  },
  {
    id: 'ORD-12481',
    customer: 'Sneha Verma',
    city: 'Delhi',
    hub: 'Delhi (NCR-01)',
    items: 'MacBook Pro 16" M4 Max 36GB x 1',
    amount: '$3,499',
    status: 'Completed',
    priority: 'Urgent',
    placedAt: '8 mins ago',
    courier: 'Air Express Flight #602'
  },
  {
    id: 'ORD-12480',
    customer: 'Rohit Sengupta',
    city: 'Kolkata',
    hub: 'Kolkata (CCU-03)',
    items: 'Apple Watch Ultra 2 Titanium x 1',
    amount: '$799',
    status: 'Processing',
    priority: 'Medium',
    placedAt: '12 mins ago',
    courier: 'Ground Hyperlocal Fleet 8'
  },
  {
    id: 'ORD-12479',
    customer: 'Pooja Reddy',
    city: 'Hyderabad',
    hub: 'Hyderabad (HYD-02)',
    items: 'iPad Pro 13" Tandem OLED x 1, Apple Pencil Pro x 1',
    amount: '$1,428',
    status: 'Completed',
    priority: 'Normal',
    placedAt: '19 mins ago',
    courier: 'Van Route 14'
  },
  {
    id: 'ORD-12478',
    customer: 'Karan Mehra',
    city: 'Delhi',
    hub: 'Delhi (NCR-01)',
    items: 'AirPods Max USB-C Midnight x 1',
    amount: '$549',
    status: 'Failed',
    failureReason: 'Address Zip Mismatch / Gateway Auth Timeout',
    priority: 'High',
    placedAt: '24 mins ago',
    courier: 'Pending Re-route'
  },
  {
    id: 'ORD-12477',
    customer: 'Deepak Nair',
    city: 'Mumbai',
    hub: 'Mumbai (BOM-04)',
    items: 'Mac Studio M2 Ultra 64GB x 1',
    amount: '$3,999',
    status: 'Processing',
    priority: 'High',
    placedAt: '31 mins ago',
    courier: 'Special Cargo Armored 2'
  },
  {
    id: 'ORD-12476',
    customer: 'Ananya Bose',
    city: 'Kolkata',
    hub: 'Kolkata (CCU-03)',
    items: 'Studio Display 5K Nano-Texture x 1',
    amount: '$1,899',
    status: 'Failed',
    failureReason: 'Dock Capacity Limit Exceeded (96%)',
    priority: 'Urgent',
    placedAt: '35 mins ago',
    courier: 'Pending Reallocation'
  },
  {
    id: 'ORD-12475',
    customer: 'Aditya Rao',
    city: 'Hyderabad',
    hub: 'Hyderabad (HYD-02)',
    items: 'iPhone 16 128GB Teal x 2',
    amount: '$1,598',
    status: 'Completed',
    priority: 'Normal',
    placedAt: '42 mins ago',
    courier: 'Van Route 09'
  },
  {
    id: 'ORD-12474',
    customer: 'Priya Joshi',
    city: 'Delhi',
    hub: 'Delhi (NCR-01)',
    items: 'Magic Keyboard with Touch ID x 1',
    amount: '$199',
    status: 'Completed',
    priority: 'Normal',
    placedAt: '49 mins ago',
    courier: 'Bike Express 33'
  }
];

export const INITIAL_WORKERS_ROSTER = [
  { id: 'WRK-01', name: 'Vikram Mehta', role: 'Lead Dispatcher', hub: 'Delhi', status: 'Busy', activeTask: 'Routing Batch #941 to Docks', completedToday: 48, rating: 4.95, avatar: '👨‍💼' },
  { id: 'WRK-02', name: 'Priya Sharma', role: 'Order Picker', hub: 'Mumbai', status: 'Busy', activeTask: 'Picking ORD-12482 (High Value Bin)', completedToday: 62, rating: 4.98, avatar: '👩‍🔧' },
  { id: 'WRK-03', name: 'Arjun Rao', role: 'Forklift Lead', hub: 'Kolkata', status: 'Busy', activeTask: 'Offloading Aisle 4 Overstock', completedToday: 35, rating: 4.88, avatar: '👷‍♂️' },
  { id: 'WRK-04', name: 'Tanvi Nair', role: 'Pack Station Pro', hub: 'Hyderabad', status: 'Available', activeTask: 'Standby for Express Wave', completedToday: 51, rating: 4.92, avatar: '👩‍💻' },
  { id: 'WRK-05', name: 'Rohan Gupta', role: 'Quality Inspector', hub: 'Delhi', status: 'Available', activeTask: 'Ready for Serialization Check', completedToday: 44, rating: 4.90, avatar: '👨‍🔬' },
  { id: 'WRK-06', name: 'Neha Chawla', role: 'Order Picker', hub: 'Mumbai', status: 'Busy', activeTask: 'Batch Packing #BOM-88', completedToday: 59, rating: 4.97, avatar: '👩‍🚀' },
  { id: 'WRK-07', name: 'Manish Das', role: 'Dock Coordinator', hub: 'Kolkata', status: 'Busy', activeTask: 'Handling Gate 3 Bottleneck', completedToday: 29, rating: 4.85, avatar: '👨‍🔧' },
  { id: 'WRK-08', name: 'Kavita Iyer', role: 'Inventory Tech', hub: 'Hyderabad', status: 'Available', activeTask: 'Cycle Count completed', completedToday: 38, rating: 4.91, avatar: '👩‍💼' },
  { id: 'WRK-09', name: 'Siddharth Roy', role: 'Automated AGV Op', hub: 'Delhi', status: 'Offline', activeTask: 'Scheduled Rest / Shift Handover', completedToday: 41, rating: 4.89, avatar: '👨‍🔧' },
  { id: 'WRK-10', name: 'Meera Nambiar', role: 'Returns Specialist', hub: 'Mumbai', status: 'Offline', activeTask: 'Shift Ended', completedToday: 33, rating: 4.87, avatar: '👩‍🔧' },
  { id: 'WRK-11', name: 'Farhan Zaidi', role: 'Pack Station Pro', hub: 'Delhi', status: 'Available', activeTask: 'Standby for Pallet 12', completedToday: 45, rating: 4.93, avatar: '👨‍💻' },
  { id: 'WRK-12', name: 'Ankita Sen', role: 'Order Picker', hub: 'Hyderabad', status: 'Available', activeTask: 'Standby for Express Wave', completedToday: 47, rating: 4.94, avatar: '👩‍🚀' }
];

export const INITIAL_TASKS_ROSTER = [
  { id: 'TSK-1049', title: 'Pick High-Value Secure Vault Bin #9', category: 'Picking', hub: 'Mumbai', priority: 'Urgent', status: 'Processing', assignedWorker: 'Priya Sharma', eta: '3 mins', createdAt: '10:41 AM' },
  { id: 'TSK-1048', title: 'Offload Kolkata Hub Buffer Pallets to HYD', category: 'Logistics', hub: 'Kolkata', priority: 'Urgent', status: 'Pending', assignedWorker: 'Unassigned (18 Available)', eta: 'Immediate', createdAt: '10:39 AM' },
  { id: 'TSK-1047', title: 'Batch Scan & Seal 50x iPhone 16 Pro', category: 'Packing', hub: 'Delhi', priority: 'High', status: 'Processing', assignedWorker: 'Vikram Mehta', eta: '6 mins', createdAt: '10:35 AM' },
  { id: 'TSK-1046', title: 'Dispatch Hyperlocal Van #14 (Hyderabad)', category: 'Dispatch', hub: 'Hyderabad', priority: 'Medium', status: 'Completed', assignedWorker: 'Kavita Iyer', eta: 'Done', createdAt: '10:20 AM' },
  { id: 'TSK-1045', title: 'Resolve Address Zip Mismatch for ORD-12478', category: 'Exception', hub: 'Delhi', priority: 'High', status: 'Failed', assignedWorker: 'Rohan Gupta', eta: 'Action Req', createdAt: '10:15 AM' },
  { id: 'TSK-1044', title: 'Dock Bay 3 Thermal Sensor Calibration', category: 'Maintenance', hub: 'Kolkata', priority: 'Medium', status: 'Processing', assignedWorker: 'Manish Das', eta: '12 mins', createdAt: '10:10 AM' },
  { id: 'TSK-1043', title: 'Inbound Verification Container #IN-8890', category: 'Receiving', hub: 'Mumbai', priority: 'High', status: 'Completed', assignedWorker: 'Neha Chawla', eta: 'Done', createdAt: '09:55 AM' },
  { id: 'TSK-1042', title: 'Repack Fragile Studio Display Box', category: 'Packing', hub: 'Kolkata', priority: 'High', status: 'Failed', assignedWorker: 'Arjun Rao', eta: 'Damaged Seal', createdAt: '09:40 AM' },
  { id: 'TSK-1041', title: 'Queue Serialization Sync for 120 Units', category: 'QC', hub: 'Hyderabad', priority: 'Low', status: 'Pending', assignedWorker: 'Unassigned (18 Available)', eta: 'Queued', createdAt: '09:30 AM' }
];

export const INITIAL_LOGS = [
  { id: 1, time: '10:43:12', level: 'WARN', hub: 'Kolkata', message: 'Kolkata Hub warehouse reached 96% critical capacity limit. Recommend load rebalancing.' },
  { id: 2, time: '10:41:05', level: 'INFO', hub: 'Mumbai', message: 'Order #ORD-12482 assigned to Picker Priya Sharma (Mumbai BOM-04).' },
  { id: 3, time: '10:38:44', level: 'SUCCESS', hub: 'Delhi', message: 'Batch Dispatch #894 completed: 140 packages routed to courier hubs.' },
  { id: 4, time: '10:35:19', level: 'ERROR', hub: 'Delhi', message: 'Order #ORD-12478 failed validation: Payment authorization token expired.' },
  { id: 5, time: '10:30:00', level: 'INFO', hub: 'System', message: '57 Total Workers synchronized. Available: 18, Busy: 37, Offline: 2.' },
  { id: 6, time: '10:24:18', level: 'SUCCESS', hub: 'Hyderabad', message: 'Hyderabad Hub offloaded 420 outbound tasks within SLA limit.' }
];
