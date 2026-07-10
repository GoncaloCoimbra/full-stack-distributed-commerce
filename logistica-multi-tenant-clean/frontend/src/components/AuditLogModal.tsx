import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme.config';

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  user?: { name: string; email: string };
  companyId: string;
  ipAddress?: string;
  createdAt: string;
  metadata?: any;
}

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    action: '',
    entity: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchAuditLogs();
    }
  }, [isOpen]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.action) params.append('action', filters.action);
      if (filters.entity) params.append('entity', filters.entity);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/audit-log?${params.toString()}`);
      setLogs(response.data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchAuditLogs();
  };

  const handleClearFilters = () => {
    setFilters({
      action: '',
      entity: '',
      startDate: '',
      endDate: '',
    });
    fetchAuditLogs();
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={`${theme.cards.form} relative w-full max-w-4xl max-h-[90vh] flex flex-col`}>          
          {/* Header */}
          <div className={`px-6 py-4 flex justify-between items-center rounded-t-lg ${theme.backgrounds.header} border-b border-slate-700`}>            
            <div>
              <h2 className="text-xl font-bold text-white">Activity History</h2>
              <p className="text-slate-300 text-sm mt-1">
                Complete audit of all system operations
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300 rounded-lg p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
                className={theme.inputs.base + " text-sm"}
              >
                <option value="">All actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
              </select>

              <select
                value={filters.entity}
                onChange={(e) => handleFilterChange('entity', e.target.value)}
                className={theme.inputs.base + " text-sm"}
              >
                <option value="">All entities</option>
                <option value="product">Product</option>
                <option value="user">User</option>
                <option value="supplier">Supplier</option>
                <option value="vehicle">Vehicle</option>
                <option value="transport">Transport</option>
              </select>

              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className={theme.inputs.base + " text-sm"}
              />

              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className={theme.inputs.base + " text-sm"}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                Filter
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">
                  <svg className="w-8 h-8 animate-spin mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Loading...
                </div>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-slate-400">No records found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="px-6 py-4 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                          <span className="text-sm font-medium text-white">
                            {log.entity}
                            {log.entityId && ` #${log.entityId.substring(0, 8)}`}
                          </span>
                        </div>

                        <div className="text-sm text-slate-300 mb-2">
                          <p>
                            <span className="font-medium">Utilizador:</span> {log.user?.name || log.userId}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(log.createdAt).toLocaleString('en-GB')}
                          </p>
                          {log.ipAddress && (
                            <p className="text-xs text-slate-400 mt-1">IP: {log.ipAddress}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
