import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Plus,
  RefreshCw,
  Package,
  Layers,
  History,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function InventorySection() {
  const [inventoryData, setInventoryData] = useState({ products: [], recentMovements: [], warehouses: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSku, setSelectedSku] = useState(null);
  const [isReplenishOpen, setIsReplenishOpen] = useState(false);
  const [replenishForm, setReplenishForm] = useState({ hubCode: 'DEL-01', sku: 'lap-mbp-14', quantity: 50 });
  const [isLoading, setIsLoading] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/inventory');
      const data = await res.json();
      setInventoryData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleReplenish = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/inventory/replenish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(replenishForm)
      });
      setIsReplenishOpen(false);
      fetchInventory();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = (inventoryData.products || []).filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSKUs = (inventoryData.products || []).length;
  const totalStockUnits = (inventoryData.products || []).reduce((acc, p) => acc + (p.totalStock || 0), 0);
  const totalReservedUnits = (inventoryData.products || []).reduce((acc, p) => acc + (p.totalReserved || 0), 0);
  const totalAvailableUnits = (inventoryData.products || []).reduce((acc, p) => acc + (p.totalAvailable || 0), 0);

  const getMovementBadge = (type) => {
    switch (type) {
      case 'STOCK_IN': return <span className="badge badge-success">+ Stock In</span>;
      case 'ALLOCATED': return <span className="badge badge-info">Allocated</span>;
      case 'RELEASED': return <span className="badge badge-warning">Released</span>;
      case 'ADJUSTMENT': return <span className="badge badge-purple">Adjustment</span>;
      default: return <span className="badge badge-neutral">{type}</span>;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Warehouse Inventory & Stock Allocation
            </h1>
            <span className="badge badge-info">
              PRD Section 6
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Multi-superhub SKU tracking, thread-safe reservation quotas, and auditable stock movement history.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={fetchInventory}
            className="btn-secondary"
            style={{ fontSize: '12px' }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setIsReplenishOpen(true)}
            className="btn-primary"
            style={{ fontSize: '12.5px' }}
          >
            <Plus size={14} />
            Replenish Stock
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active SKUs
            </span>
            <Database size={16} color="var(--primary)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalSKUs || 6}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            Tracked across 4 SuperHubs
          </div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Stock Units
            </span>
            <Package size={16} color="var(--primary)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--primary)' }}>
            {totalStockUnits.toLocaleString()}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            Physical warehouse inventory
          </div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Available Headroom
            </span>
            <CheckCircle2 size={16} color="var(--success)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--success)' }}>
            {totalAvailableUnits.toLocaleString()}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--success)' }}>
            Ready for instant allocation
          </div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Reserved for Orders
            </span>
            <Layers size={16} color="var(--warning)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--warning)' }}>
            {totalReservedUnits.toLocaleString()}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--warning)' }}>
            Locked by C++ atomic mutexes
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="panel-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            SuperHub SKU Stock Allocation Breakdown
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '320px', flex: 1 }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Filter by SKU, Product name, or Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input"
              style={{ padding: '6px 10px', fontSize: '12px' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product SKU</th>
                <th>Category</th>
                <th>Delhi (NCR-01)</th>
                <th>Mumbai (BOM-04)</th>
                <th>Hyderabad (HYD-02)</th>
                <th>Kolkata (CCU-03)</th>
                <th>Available / Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isOutOfStock = p.totalAvailable <= 0;
                const isLowStock = p.totalAvailable > 0 && p.totalAvailable < 50;

                return (
                  <tr key={p.sku}>
                    <td>
                      <div>
                        <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{p.name}</strong>
                        <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                          {p.sku}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontWeight: 600, color: p.hubs?.['DEL-01'] > 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                        {p.hubs?.['DEL-01'] ?? 0} units
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontWeight: 600, color: p.hubs?.['BOM-04'] > 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                        {p.hubs?.['BOM-04'] ?? 0} units
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontWeight: 600, color: p.hubs?.['HYD-02'] > 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                        {p.hubs?.['HYD-02'] ?? 0} units
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontWeight: 600, color: p.hubs?.['CCU-03'] > 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                        {p.hubs?.['CCU-03'] ?? 0} units
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums" style={{ fontWeight: 700 }}>
                        <span style={{ color: isOutOfStock ? 'var(--danger)' : isLowStock ? 'var(--warning)' : 'var(--success)' }}>
                          {p.totalAvailable}
                        </span>
                        {' '}/ {p.totalStock}
                      </span>
                    </td>
                    <td>
                      {isOutOfStock ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : isLowStock ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement History Log */}
      {inventoryData.recentMovements && inventoryData.recentMovements.length > 0 && (
        <div className="panel-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={16} color="var(--primary)" />
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Recent Inventory Ledger Movements
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Hub</th>
                  <th>Product SKU</th>
                  <th>Movement Type</th>
                  <th>Quantity</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.recentMovements.map((m, idx) => (
                  <tr key={idx}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{m.timestamp || 'Just now'}</td>
                    <td><span style={{ fontWeight: 600 }}>{m.hubCode}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{m.sku}</td>
                    <td>{getMovementBadge(m.type)}</td>
                    <td className="tabular-nums" style={{ fontWeight: 700, color: m.quantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
                      {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.reference || 'Auto Allocation'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Replenish Modal */}
      {isReplenishOpen && (
        <div className="modal-overlay" onClick={() => setIsReplenishOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Replenish Hub Stock Quota
            </h3>
            <form onSubmit={handleReplenish} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Target SuperHub
                </label>
                <select
                  value={replenishForm.hubCode}
                  onChange={(e) => setReplenishForm({ ...replenishForm, hubCode: e.target.value })}
                  className="admin-select"
                >
                  <option value="DEL-01">Delhi SuperHub (DEL-01)</option>
                  <option value="BOM-04">Mumbai MegaPort (BOM-04)</option>
                  <option value="HYD-02">Hyderabad Cyber Node (HYD-02)</option>
                  <option value="CCU-03">Kolkata Gateway (CCU-03)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Product SKU
                </label>
                <select
                  value={replenishForm.sku}
                  onChange={(e) => setReplenishForm({ ...replenishForm, sku: e.target.value })}
                  className="admin-select"
                >
                  {(inventoryData.products || []).map((p) => (
                    <option key={p.sku} value={p.sku}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Replenishment Units
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={replenishForm.quantity}
                  onChange={(e) => setReplenishForm({ ...replenishForm, quantity: Number(e.target.value) })}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setIsReplenishOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Inflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
