// Mock orders for Customer Quickflow store linking with fulfillment network

export const INITIAL_CUSTOMER_ORDERS = [
  {
    id: 'QF-10482',
    date: 'Today, March 6, 2026',
    status: 'Picking items',
    currentStageIndex: 3, // 0-indexed: 3 = "Picking items" (Stage 4)
    hub: 'Mumbai Fulfillment Center',
    hubCode: 'BOM-04',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pinCode: '751024',
    deliveryAddress: 'Plot 412, Infocity Road, Patia, Bhubaneswar, Odisha 751024',
    deliverySpeed: 'Express Priority (Speed 6)',
    estimatedDelivery: 'Tomorrow by 2:30 PM',
    estimatedCompletionTime: '18 minutes',
    carrier: 'QuickFlow Hyperlocal Air Express',
    trackingPin: '1048',
    subtotal: 157800,
    deliveryFee: 499,
    total: 158299,
    items: [
      {
        id: 'lap-mbp-14',
        name: 'MacBook Pro',
        subtitle: '14-inch, M3 Pro, 18GB Unified Memory, 512GB SSD',
        color: 'Space Black',
        price: 149900,
        quantity: 1,
        aisle: 'Aisle 04-B',
        shelf: 'Shelf 12',
        located: true,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'ms-magic',
        name: 'Magic Mouse',
        subtitle: 'Wireless, Rechargeable, Multi-Touch Surface',
        color: 'White',
        price: 7900,
        quantity: 1,
        aisle: 'Aisle 02-C',
        shelf: 'Shelf 08',
        located: true,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80'
      }
    ],
    stages: [
      {
        name: 'Order confirmed',
        description: 'Payment verified and order authenticated into system',
        timestamp: '10:14 AM',
        node: 'Gateway Node',
        completed: true
      },
      {
        name: 'Inventory reserved',
        description: 'SKUs locked and allocated in Mumbai Central warehouse',
        timestamp: '10:15 AM',
        node: 'Mumbai Central Stock',
        completed: true
      },
      {
        name: 'Fulfillment center selected',
        description: 'Optimal hub BOM-04 chosen by C++ Dijkstra Routing Engine',
        timestamp: '10:16 AM',
        node: 'Mumbai Fulfillment Center (BOM-04)',
        completed: true
      },
      {
        name: 'Picking items',
        description: 'Autonomous AGV robots & station workers collecting items from aisles',
        timestamp: '10:18 AM (In Progress)',
        node: 'Mumbai Fulfillment Center (BOM-04)',
        completed: false,
        active: true
      },
      {
        name: 'Packing',
        description: 'High-grade shock resistant thermal security boxing',
        timestamp: 'Pending',
        node: 'Pack Station 07',
        completed: false
      },
      {
        name: 'Quality check',
        description: 'Optical weight scan and RFID serial verification',
        timestamp: 'Pending',
        node: 'QC Bay 02',
        completed: false
      },
      {
        name: 'Shipped',
        description: 'Handed over to QuickFlow Hyperlocal Air Express fleet',
        timestamp: 'Pending',
        node: 'Outbound Air Dock',
        completed: false
      },
      {
        name: 'Delivered',
        description: 'Direct courier delivery to doorstep in Bhubaneswar',
        timestamp: 'Pending',
        node: 'Bhubaneswar Hub (BBI-01)',
        completed: false
      }
    ]
  },
  {
    id: 'QF-89410',
    date: 'March 6, 2026',
    status: 'Shipped',
    currentStageIndex: 6,
    hub: 'Delhi Northern SuperHub (NCR-01)',
    hubCode: 'DEL-01',
    city: 'New Delhi',
    state: 'Delhi NCR',
    pinCode: '110001',
    deliveryAddress: 'Connaught Place, New Delhi 110001',
    deliverySpeed: 'Same Day (Speed 9)',
    estimatedDelivery: 'Today by 5:30 PM',
    estimatedCompletionTime: 'Completed',
    carrier: 'QuickFlow Express Hyperlocal Fleet',
    trackingPin: '8941',
    total: 39900,
    items: [
      {
        id: 'hp-01',
        name: 'FlowSound ANC Max Wireless',
        subtitle: 'Active Noise Cancellation',
        color: 'Matte Black',
        price: 39900,
        quantity: 1,
        aisle: 'Aisle 01-A',
        shelf: 'Shelf 04',
        located: true,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
      }
    ],
    stages: [
      { name: 'Order confirmed', completed: true },
      { name: 'Inventory reserved', completed: true },
      { name: 'Fulfillment center selected', completed: true },
      { name: 'Picking items', completed: true },
      { name: 'Packing', completed: true },
      { name: 'Quality check', completed: true },
      { name: 'Shipped', completed: true, active: true },
      { name: 'Delivered', completed: false }
    ]
  }
];
