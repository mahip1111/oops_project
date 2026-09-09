import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Zap,
  RotateCcw,
  Search,
  UserCheck,
  Cpu
} from 'lucide-react';

export default function TasksSection({
  metrics,
  tasks = [],
  onOpenCreateTaskModal,
  onAutoAssignTasks,
  onRetryTask,
  activeStrategy = 'Hybrid',
  onStrategyChange
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentStrat, setCurrentStrat] = useState(activeStrategy);

  const filteredTasks = tasks.filter((tsk) => {
    const matchesSearch =
      (tsk.id || tsk.taskId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tsk.title || tsk.taskName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tsk.hub || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tsk.assignedWorker || tsk.assignedWorkerId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const statusVal = tsk.status || 'Pending';
    const matchesStatus =
      statusFilter === 'all' || statusVal.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleStrategySwitch = async (newStrat) => {
    setCurrentStrat(newStrat);
    if (onStrategyChange) {
      onStrategyChange(newStrat);
    }
  };

  const getTaskStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s.includes('COMPLETED')) return <span className="badge badge-success">✓ Completed</span>;
    if (s.includes('FAILED') || s.includes('QUARANTINED')) return <span className="badge badge-danger">✗ Failed</span>;
    if (s.includes('PROCESS') || s.includes('PROGRESS')) return <span className="badge badge-info">⚡ Processing</span>;
    return <span className="badge badge-warning">⏳ Pending</span>;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p.includes('URGENT') || p.includes('SAME') || p.includes('P+4')) {
      return <span className="badge badge-danger">Urgent (P+4)</span>;
    }
    if (p.includes('HIGH') || p.includes('P+2')) {
      return <span className="badge badge-warning">High (P+2)</span>;
    }
    return <span className="badge badge-neutral">Standard</span>;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Batch Triggers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Task Pipeline & Scheduling Execution Queue
            </h1>
            <span className="badge badge-info">
              PRD Section 5
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Real-time queue: <strong>{metrics.tasks.pending} Pending</strong> • <strong>{metrics.tasks.processing} Processing</strong> • <strong>{metrics.tasks.completed} Completed</strong> • <strong>{metrics.tasks.failed} Failed</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onAutoAssignTasks && (
            <button onClick={onAutoAssignTasks} className="btn-secondary" style={{ fontSize: '12.5px' }}>
              <UserCheck size={14} />
              <span>Auto-Assign Pool</span>
            </button>
          )}
          {onOpenCreateTaskModal && (
            <button onClick={onOpenCreateTaskModal} className="btn-primary" style={{ fontSize: '12.5px' }}>
              <Plus size={14} />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Schedulers Bar (PRD Section 5) */}
      <div
        className="panel-card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={16} color="var(--primary)" />
          </div>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Active C++ Scheduling Strategy:
            </span>
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginLeft: '6px' }}>
              {currentStrat}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['FIFO', 'Priority', 'Deadline', 'Hybrid'].map((strat) => {
            const isSelected = currentStrat === strat;
            return (
              <button
                key={strat}
                onClick={() => handleStrategySwitch(strat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                {strat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Breakdown Bar */}
      <div className="panel-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Overall Queue Throughput Breakdown</span>
          <span style={{ color: 'var(--text-secondary)' }}>Total: {metrics.tasks.total} Tasks</span>
        </div>
        <div style={{ height: '10px', width: '100%', background: 'var(--bg-surface-elevated)', borderRadius: '9999px', display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: `${(metrics.tasks.completed / metrics.tasks.total) * 100}%`, background: 'var(--success)' }} title="Completed" />
          <div style={{ width: `${(metrics.tasks.processing / metrics.tasks.total) * 100}%`, background: 'var(--info)' }} title="Processing" />
          <div style={{ width: `${(metrics.tasks.pending / metrics.tasks.total) * 100}%`, background: 'var(--warning)' }} title="Pending" />
          <div style={{ width: `${(metrics.tasks.failed / metrics.tasks.total) * 100}%`, background: 'var(--danger)' }} title="Failed" />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '11.5px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Completed ({metrics.tasks.completed})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--info)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Processing ({metrics.tasks.processing})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Pending ({metrics.tasks.pending})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Failed ({metrics.tasks.failed})</span>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="panel-card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by Task ID, Name, Hub, or Worker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'pending', 'processing', 'completed', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: statusFilter === st ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.12s ease'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="panel-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task Title</th>
                <th>Hub</th>
                <th>Priority</th>
                <th>Assigned Specialist / Bot</th>
                <th>ETA</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t.id || t.taskId}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    {t.id || t.taskId}
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.title || t.taskName}</td>
                  <td>{t.hub || 'BOM-04'}</td>
                  <td>{getPriorityBadge(t.priority)}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {t.assignedWorker || t.assignedWorkerId || 'Unassigned'}
                    </span>
                  </td>
                  <td>{t.eta || '12 mins'}</td>
                  <td>{getTaskStatusBadge(t.status)}</td>
                  <td>
                    {t.status === 'Failed' && onRetryTask ? (
                      <button
                        onClick={() => onRetryTask(t.id || t.taskId)}
                        className="btn-danger"
                        style={{ padding: '3px 8px', fontSize: '11px' }}
                      >
                        <RotateCcw size={12} />
                        <span>Retry</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
