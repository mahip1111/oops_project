import React, { useState, useEffect } from 'react';
import AdminNavbar from './components/Navbar/AdminNavbar';
import AdminSidebar from './components/Sidebar/AdminSidebar';
import OverviewSection from './components/Sections/OverviewSection';
import OrdersSection from './components/Sections/OrdersSection';
import FulfillmentSection from './components/Sections/FulfillmentSection';
import TasksSection from './components/Sections/TasksSection';
import WarehouseSection from './components/Sections/WarehouseSection';
import WorkersSection from './components/Sections/WorkersSection';
import InventorySection from './components/Sections/InventorySection';
import SchedulingSection from './components/Sections/SchedulingSection';
import SimulationSection from './components/Sections/SimulationSection';
import AnalyticsSection from './components/Sections/AnalyticsSection';
import SystemEventsSection from './components/Sections/SystemEventsSection';
import SettingsSection from './components/Sections/SettingsSection';
import ReviewQueueSection from './components/Sections/ReviewQueueSection';
import { RebalanceModal, CreateTaskModal, DispatchWaveModal } from './components/Modals/AdminModals';
import ToastAlerts from './components/UI/ToastAlerts';

import {
  INITIAL_METRICS,
  INITIAL_ORDERS_ROSTER,
  INITIAL_WORKERS_ROSTER,
  INITIAL_TASKS_ROSTER,
  INITIAL_LOGS
} from './data/adminInitialData';
import { AdminApiService } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [orders, setOrders] = useState(INITIAL_ORDERS_ROSTER);
  const [workers, setWorkers] = useState(INITIAL_WORKERS_ROSTER);
  const [tasks, setTasks] = useState(INITIAL_TASKS_ROSTER);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [activeStrategy, setActiveStrategy] = useState('Hybrid');
  const [toasts, setToasts] = useState([]);
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ connected: false });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Review Queue state
  const [reviewItems, setReviewItems] = useState([
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
  ]);

  // Sync Dark/Light theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Modal States
  const [isRebalanceModalOpen, setIsRebalanceModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Helper to trigger toast alerts
  const showToast = ({ title, message, type = 'success' }) => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check Backend Health & Establish WebSocket on Mount
  useEffect(() => {
    AdminApiService.fetchOrders().then((orderData) => {
      if (orderData && orderData.list) {
        setOrders(orderData.list);
      }
    });
    AdminApiService.checkBackendHealth().then((status) => {
      setBackendStatus(status);
      if (status.schedulingStrategy) setActiveStrategy(status.schedulingStrategy);
    });

    // Connect to WebSocket API
    let ws;
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = window.location.hostname || 'localhost';
      ws = new WebSocket(wsProtocol + "//" + wsHost + ":5000");
      ws.onopen = () => {
        setBackendStatus({ connected: true });
      };
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'ORDER_CREATED') {
            setOrders((prev) => [payload.data, ...prev]);
            showToast({
              title: 'New Order Dispatched ⚡',
              message: `Order #${payload.data.id} allocated to ${payload.data.hub} via C++ engine.`,
              type: 'info'
            });
          } else if (payload.type === 'ORDER_UPDATED') {
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.data.id ? { ...o, ...payload.data } : o))
            );
          } else if (payload.type === 'WAREHOUSES_REBALANCED') {
            setMetrics((prev) => ({
              ...prev,
              warehouses: payload.data
            }));
          } else if (payload.type === 'STRATEGY_CHANGED') {
            setActiveStrategy(payload.strategy);
            showToast({
              title: 'Strategy Updated ⚡',
              message: `C++ engine recalculated queue with ${payload.strategy} strategy.`,
              type: 'info'
            });
          }
        } catch (e) {}
      };
    } catch (e) {}

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Action: Transition Order State (PRD Section 4 & 7: State Machine Protection)
  const handleTransitionOrderState = async (orderId, targetState, reason) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetState, reason })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast({
          title: 'State Transition Rejected 🛡️',
          message: data.message || `Invalid state transition to ${targetState}. State machine protection active.`,
          type: 'danger'
        });
        return false;
      }
      showToast({
        title: 'State Advanced ✓',
        message: `Order #${orderId} transitioned to ${targetState}`,
        type: 'success'
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...data.order } : o))
      );
      return true;
    } catch (e) {
      showToast({
        title: 'Connection Error',
        message: 'Could not connect to backend state machine endpoint',
        type: 'danger'
      });
      return false;
    }
  };

  // Action: Retry Failed Order
  const handleRetryFailedOrder = async (orderId) => {
    await AdminApiService.retryFailedOrder(orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Processing', priority: 'Urgent' } : o))
    );
    setMetrics((prev) => ({
      ...prev,
      orders: {
        ...prev.orders,
        failed: Math.max(0, prev.orders.failed - 1),
        processing: prev.orders.processing + 1
      }
    }));
    showToast({
      title: 'Order Re-Queued! ⚡',
      message: `Order #${orderId} was reset and prioritized for express fulfillment.`,
      type: 'success'
    });
  };

  // Action: Rebalance Kolkata Hub (96%) -> Hyderabad (61%)
  const handleConfirmRebalance = async ({ fromHub, toHub, transferPercent }) => {
    try {
      await fetch('/api/warehouses/rebalance', { method: 'POST' });
    } catch (e) {}

    setMetrics((prev) => ({
      ...prev,
      warehouses: prev.warehouses.map((wh) => {
        if (wh.city === 'Kolkata' || wh.name?.includes('Kolkata')) {
          return {
            ...wh,
            capacityPercentage: 78,
            utilization: 78,
            status: 'optimal'
          };
        }
        if (wh.city === 'Hyderabad' || wh.name?.includes('Hyderabad')) {
          return {
            ...wh,
            capacityPercentage: 74,
            utilization: 74,
            status: 'optimal'
          };
        }
        return wh;
      })
    }));

    showToast({
      title: 'Hub Rebalancing Executed! 🔄',
      message: `Transferred ${transferPercent}% volume from Kolkata to Hyderabad. Capacity stabilized at 78%!`,
      type: 'success'
    });
  };

  // Action: Handle Strategy Change
  const handleStrategyChange = async (newStrat) => {
    setActiveStrategy(newStrat);
    try {
      await fetch('/api/scheduling/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy: newStrat })
      });
    } catch (e) {}
  };

  // Action: Handle Review Queue Retry
  const handleRetryReviewItem = async (reviewId) => {
    try {
      await fetch(`/api/review-queue/${reviewId}/retry`, { method: 'POST' });
    } catch (e) {}

    setReviewItems((prev) =>
      prev.map((i) => (i.reviewId === reviewId ? { ...i, status: 'RESOLVED_RETRY' } : i))
    );

    showToast({
      title: 'Task Re-Dispatched ⚡',
      message: `Quarantined item ${reviewId} reset with priority worker pod.`,
      type: 'success'
    });
  };

  // Action: Handle Review Queue Reroute
  const handleRerouteReviewItem = async (reviewId, newHub) => {
    try {
      await fetch(`/api/review-queue/${reviewId}/reroute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newHub })
      });
    } catch (e) {}

    setReviewItems((prev) =>
      prev.map((i) => (i.reviewId === reviewId ? { ...i, status: 'RESOLVED_REROUTE', hub: newHub } : i))
    );

    showToast({
      title: 'Order Rerouted 🔄',
      message: `Task ${reviewId} successfully transferred to ${newHub}.`,
      type: 'success'
    });
  };

  // Action: Update Worker Status
  const handleUpdateWorkerStatus = (workerId, newStatus) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status: newStatus } : w))
    );
    showToast({
      title: 'Worker Status Updated',
      message: `Worker ${workerId} is now marked as "${newStatus}".`,
      type: 'info'
    });
  };

  // Action: Create Operations Task
  const handleConfirmCreateTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast({
      title: 'Task Created & Assigned! 📋',
      message: `${newTask.title || newTask.taskName} routed to ${newTask.hub || 'BOM-04'} Hub.`,
      type: 'success'
    });
  };

  // Action: Auto-Assign Tasks
  const handleAutoAssignTasks = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.status === 'Pending'
          ? { ...t, status: 'Processing', assignedWorker: 'Auto-Assigned (Available Pool)' }
          : t
      )
    );
    showToast({
      title: 'Tasks Auto-Assigned! 👷',
      message: 'Idle specialists dispatched to pending fulfillment queues.',
      type: 'success'
    });
  };

  // Action: Dispatch Batch Wave
  const handleConfirmDispatch = (batchCount) => {
    setMetrics((prev) => ({
      ...prev,
      orders: {
        ...prev.orders,
        processing: Math.max(0, prev.orders.processing - batchCount),
        completed: prev.orders.completed + batchCount
      }
    }));
    showToast({
      title: 'Wave Dispatched! 🚀',
      message: `Batch of ${batchCount} packages successfully cleared onto carrier fleets.`,
      type: 'success'
    });
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pendingReviewCount = reviewItems.filter((i) => i.status === 'PENDING_REVIEW').length;

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', background: 'var(--bg-primary)', position: 'relative' }}>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`admin-sidebar-backdrop ${isMobileSidebarOpen ? 'backdrop-open' : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      {/* Left Operations Sidebar (Fixed 100vh height on desktop, drawer on mobile) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        metrics={metrics}
        reviewQueueCount={pendingReviewCount}
        activeStrategy={activeStrategy}
        kolkataAlert={metrics.warehouses?.some((w) => (w.city === 'Kolkata' || w.name?.includes('Kolkata')) && (w.capacityPercentage >= 90 || w.utilization >= 90))}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Right Column: Navbar + Main View Area (Independently scrolling, 100vh full height) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Top Admin Navbar */}
        <AdminNavbar
          activeTab={activeTab}
          metrics={metrics}
          isLiveSimulating={isLiveSimulating}
          setIsLiveSimulating={setIsLiveSimulating}
          onOpenRebalanceModal={() => setIsRebalanceModalOpen(true)}
          onOpenCreateTaskModal={() => setIsCreateTaskModalOpen(true)}
          onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
          backendStatus={backendStatus}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onToggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        {/* Center Content View Area */}
        <main className="admin-main-content" style={{ flex: 1, padding: '20px 24px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          {activeTab === 'overview' && (
            <OverviewSection
              metrics={metrics}
              orders={orders}
              workers={workers}
              tasks={tasks}
              setActiveTab={setActiveTab}
              onOpenRebalanceModal={() => setIsRebalanceModalOpen(true)}
              onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
              onRetryFailedOrder={handleRetryFailedOrder}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersSection
              metrics={metrics}
              orders={orders}
              onRetryFailedOrder={handleRetryFailedOrder}
              onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
              onTransitionOrderState={handleTransitionOrderState}
            />
          )}

          {activeTab === 'fulfillment' && (
            <FulfillmentSection
              orders={orders}
              onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksSection
              metrics={metrics}
              tasks={tasks}
              onOpenCreateTaskModal={() => setIsCreateTaskModalOpen(true)}
              onAutoAssignTasks={handleAutoAssignTasks}
              activeStrategy={activeStrategy}
              onStrategyChange={handleStrategyChange}
              onRetryTask={(taskId) => {
                setTasks((prev) =>
                  prev.map((t) => (t.id === taskId || t.taskId === taskId ? { ...t, status: 'Processing' } : t))
                );
                showToast({ title: 'Task Retried', message: `Task ${taskId} re-queued.` });
              }}
            />
          )}

          {activeTab === 'warehouses' && (
            <WarehouseSection
              warehouses={metrics.warehouses}
              onOpenRebalanceModal={() => setIsRebalanceModalOpen(true)}
              onRebalanceHub={handleConfirmRebalance}
            />
          )}

          {activeTab === 'workers' && (
            <WorkersSection
              metrics={metrics}
              workers={workers}
              onUpdateWorkerStatus={handleUpdateWorkerStatus}
              onOpenCreateTaskModal={() => setIsCreateTaskModalOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventorySection />
          )}

          {activeTab === 'scheduling' && (
            <SchedulingSection
              activeStrategy={activeStrategy}
              onStrategyChange={handleStrategyChange}
            />
          )}

          {activeTab === 'simulation' && (
            <SimulationSection onOpenDispatchModal={() => setIsDispatchModalOpen(true)} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsSection
              metrics={metrics}
              onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
            />
          )}

          {activeTab === 'events' && (
            <SystemEventsSection logs={logs} onClearLogs={() => setLogs([])} />
          )}

          {activeTab === 'settings' && (
            <SettingsSection />
          )}

          {activeTab === 'reviewQueue' && (
            <ReviewQueueSection
              reviewItems={reviewItems}
              onRetryReviewItem={handleRetryReviewItem}
              onRerouteReviewItem={handleRerouteReviewItem}
            />
          )}
        </main>
      </div>

      {/* Rebalance Modal */}
      <RebalanceModal
        isOpen={isRebalanceModalOpen}
        onClose={() => setIsRebalanceModalOpen(false)}
        warehouses={metrics.warehouses}
        onConfirmRebalance={handleConfirmRebalance}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        workers={workers}
        onConfirmCreateTask={handleConfirmCreateTask}
      />

      {/* Dispatch Wave Modal */}
      <DispatchWaveModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onConfirmDispatch={handleConfirmDispatch}
      />

      {/* Floating System Toasts */}
      <ToastAlerts toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
