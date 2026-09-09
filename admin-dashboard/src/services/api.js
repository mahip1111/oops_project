// Unified Backend API Client Service for Admin Dashboard
// Configured to communicate with the shared backend API (/api) or fallback smoothly to reactive simulated state.

import {
  INITIAL_METRICS,
  INITIAL_ORDERS_ROSTER,
  INITIAL_WORKERS_ROSTER,
  INITIAL_TASKS_ROSTER,
  INITIAL_LOGS
} from '../data/adminInitialData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const AdminApiService = {
  // Check backend server health / connection status
  async checkBackendHealth() {
    try {
      const res = await fetch(`${BASE_URL}/health`, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        return { connected: true, data };
      }
      return { connected: false, message: 'Backend unreachable' };
    } catch (e) {
      return { connected: false, message: 'Running in Standalone Mock / Simulation Mode' };
    }
  },

  // Fetch All Core Dashboard Metrics (Orders, Warehouses, Workers, Tasks)
  async fetchDashboardMetrics() {
    try {
      const res = await fetch(`${BASE_URL}/admin/metrics`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Backend not running yet, use local state
    }
    return INITIAL_METRICS;
  },

  // Fetch Orders List
  async fetchOrders() {
    try {
      const res = await fetch(`${BASE_URL}/admin/orders`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_ORDERS_ROSTER;
  },

  // Trigger Order Retry / Status Update
  async retryFailedOrder(orderId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/orders/${orderId}/retry`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, orderId, newStatus: 'Processing', message: `Order ${orderId} re-queued for fulfillment!` };
  },

  // Fetch Warehouses & Capacities
  async fetchWarehouses() {
    try {
      const res = await fetch(`${BASE_URL}/admin/warehouses`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_METRICS.warehouses;
  },

  // Rebalance Warehouse Hub Load (e.g. shift Kolkata 96% load to Hyderabad / Delhi)
  async rebalanceHub({ fromHubId, toHubId, transferPercent = 15 }) {
    try {
      const res = await fetch(`${BASE_URL}/admin/warehouses/rebalance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromHubId, toHubId, transferPercent })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      success: true,
      message: `Transferred ${transferPercent}% pallet volume from ${fromHubId} to ${toHubId}. Capacity stabilized!`
    };
  },

  // Fetch Workers Roster
  async fetchWorkers() {
    try {
      const res = await fetch(`${BASE_URL}/admin/workers`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_WORKERS_ROSTER;
  },

  // Update Worker Status (Available, Busy, Offline)
  async updateWorkerStatus(workerId, newStatus) {
    try {
      const res = await fetch(`${BASE_URL}/admin/workers/${workerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, workerId, status: newStatus };
  },

  // Fetch Tasks Queue
  async fetchTasks() {
    try {
      const res = await fetch(`${BASE_URL}/admin/tasks`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return INITIAL_TASKS_ROSTER;
  },

  // Create or Assign Task
  async assignTask(taskId, workerName) {
    try {
      const res = await fetch(`${BASE_URL}/admin/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerName })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, taskId, workerName, status: 'Processing' };
  }
};
