import React, { useEffect, useState } from 'react';
import { getStatusBadgeClass, statusLabels } from '../theme.config';

interface HistoryEntry {
  id: number;
  previousStatus: string;
  newStatus: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  reason?: string;
  location?: string;
  quantity?: number;
}

interface ProductHistoryProps {
  productId: number;
}

export const ProductHistory: React.FC<ProductHistoryProps> = ({ productId }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [productId]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/movements`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error loading history');
      }
      
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        <span className="ml-3 text-amber-300">Loading history...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Movement History
        </h2>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-amber-500/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-amber-300/70">No movements recorded</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div 
              key={entry.id}
              className="bg-gradient-to-br from-amber-900/20 to-amber-900/10 rounded-lg p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      {entry.previousStatus && (
                        <span className={`px-2 py-1 text-xs rounded ${getStatusBadgeClass('product', entry.previousStatus)}`}>
                          {statusLabels.product[entry.previousStatus] || entry.previousStatus}
                        </span>
                      )}
                      <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusBadgeClass('product', entry.newStatus)}`}>
                        {statusLabels.product[entry.newStatus] || entry.newStatus}
                      </span>
                    </div>

                    <div className="text-sm text-amber-300 mb-1">
                      <span className="font-medium">Por:</span> {entry.user.name}
                    </div>

                    {entry.reason && (
                      <div className="mt-3 text-sm text-amber-200 bg-amber-900/30 p-3 rounded border border-amber-500/20 italic">
                        "{entry.reason}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-amber-400/70 ml-4 whitespace-nowrap">
                  {new Date(entry.createdAt).toLocaleString('en-GB')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};