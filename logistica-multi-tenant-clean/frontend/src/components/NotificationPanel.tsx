import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useLanguage, translateText, TRANSLATIONS } from '../i18n';

interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  entityType: 'product' | 'transport' | 'vehicle';
  entityId: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read?: boolean;
}

interface NotificationResponse {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  notifications: Notification[];
}

const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse>({
    total: 0, critical: 0, high: 0, medium: 0, low: 0, notifications: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string>('');
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key: keyof typeof TRANSLATIONS) => translateText(TRANSLATIONS[key], language);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/notifications');
      if (response.data && typeof response.data === 'object' && Array.isArray(response.data.notifications)) {
        setNotifications(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message && typeof error.response.data.message === 'string'
          ? error.response.data.message
          : error?.message ?? 'Error loading notifications';
      console.error('Error loading notifications:', msg);
      setError(msg);
      setNotifications({ total: 0, critical: 0, high: 0, medium: 0, low: 0, notifications: [] });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      const updated = notifications.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n,
      );
      setNotifications({
        ...notifications,
        notifications: updated,
        total: updated.filter(n => !n.read).length,
      });
    } catch { console.error('Error marking as read'); }
  };

  const clearAllNotifications = async () => {
    if (!window.confirm(t('clearAllNotificationsConfirm'))) return;
    try {
      await api.delete('/notifications/all');
      setNotifications({ total: 0, critical: 0, high: 0, medium: 0, low: 0, notifications: [] });
    } catch { console.error('Error clearing notifications'); }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      const updated = notifications.notifications.map(n => ({ ...n, read: true }));
      setNotifications({ ...notifications, notifications: updated, total: 0 });
    } catch { console.error('Error marking all as read'); }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.entityType === 'product')        navigate(`/products/${notification.entityId}`);
    else if (notification.entityType === 'transport') navigate('/transports');
    else if (notification.entityType === 'vehicle')   navigate('/vehicles');
    setIsOpen(false);
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-900/20 border border-red-500/30 rounded-lg p-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="bg-gradient-to-br from-amber-900/30 to-amber-900/20 border border-amber-500/30 rounded-lg p-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'info':
        return (
          <div className="bg-gradient-to-br from-red-900/30 to-red-900/20 border border-red-500/30 rounded-lg p-2">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-900/20 border border-emerald-500/30 rounded-lg p-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getPriorityClass = (priority: string, read: boolean) => {
    const op = read ? 'opacity-70' : '';
    switch (priority) {
      case 'critical': return `border-l-4 border-red-500/70    ${read ? 'bg-red-900/15'    : 'bg-red-900/25'}    ${op}`;
      case 'high':     return `border-l-4 border-amber-500/70  ${read ? 'bg-amber-900/15'  : 'bg-amber-900/25'}  ${op}`;
      case 'medium':   return `border-l-4 border-amber-400/50  ${read ? 'bg-amber-900/10'  : 'bg-amber-900/15'}  ${op}`;
      default:         return `border-l-4 border-red-500/50   ${read ? 'bg-red-900/10'   : 'bg-red-900/15'}   ${op}`;
    }
  };

  const getTimeAgo = (date: string) => {
    const diffMs   = Date.now() - new Date(date).getTime();
    const diffMins  = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays  = Math.floor(diffHours / 24);
    if (diffDays > 0)  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0)  return `${diffMins}min ago`;
    return 'just now';
  };

  const unreadCount  = notifications.notifications.filter(n => !n.read).length;
  const criticalCount = notifications.critical;

  return (
    <div className="relative">

      {/* ── Bell button ─────────────────────────────────────────────── */}
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) loadNotifications(); }}
        className="relative p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-900/20 border border-transparent hover:border-amber-500/30 transition-all"
        title={t('notificationsTitle')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full ${
            criticalCount > 0
              ? 'bg-red-500 animate-pulse border border-red-300'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-300'
          }`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown panel ──────────────────────────────────────────── */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border-2 border-amber-500/30 z-50 max-h-[32rem] overflow-hidden flex flex-col">

            {/* Header */}
            <div className="p-4 border-b-2 border-amber-500/20 bg-gradient-to-r from-slate-900 to-black">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-white">{t('notificationsTitle')}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Priority pills */}
              <div className="flex gap-2 text-xs flex-wrap">
                {criticalCount > 0 && (
                  <span className="px-2 py-1 bg-red-900/40 text-red-400 border border-red-500/30 rounded-full font-semibold">
                    {criticalCount} critical{criticalCount > 1 ? 's' : ''}
                  </span>
                )}
                {notifications.high > 0 && (
                  <span className="px-2 py-1 bg-amber-900/40 text-amber-400 border border-amber-500/30 rounded-full font-semibold">
                    {notifications.high} important{notifications.high > 1 ? 's' : ''}
                  </span>
                )}
                {notifications.medium > 0 && (
                  <span className="px-2 py-1 bg-amber-900/20 text-amber-300 border border-amber-500/20 rounded-full font-semibold">
                    {notifications.medium} medium{notifications.medium > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              {notifications.notifications.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={markAllAsRead}
                    className="flex-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
                  >
                    Mark all as read
                  </button>
                  <button
                    onClick={clearAllNotifications}
                    className="flex-1 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <svg className="w-14 h-14 text-red-400/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 font-semibold text-sm">{error}</p>
                  <button
                    onClick={loadNotifications}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg"
                  >
                    Try again
                  </button>
                </div>
              ) : notifications.notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <svg className="w-14 h-14 text-amber-500/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-amber-400 font-bold">{t('noNotifications')}</p>
                  <p className="text-sm text-slate-400 mt-1">{t('notificationsEmptyInfo')}</p>
                </div>
              ) : (
                <div className="divide-y divide-amber-500/10">
                  {notifications.notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-amber-900/10 cursor-pointer transition-all relative ${getPriorityClass(notification.priority, notification.read || false)}`}
                    >
                      <div className="flex gap-3" onClick={() => handleNotificationClick(notification)}>
                        <div className="flex-shrink-0">{getIconByType(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`text-sm font-semibold line-clamp-1 ${notification.read ? 'text-slate-400' : 'text-white'}`}>
                              {notification.title}
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full ml-2 animate-pulse" />
                              )}
                            </p>
                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              {getTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <p className={`text-xs line-clamp-2 ${notification.read ? 'text-slate-500' : 'text-slate-300'}`}>
                            {notification.message}
                          </p>

                          {notification.priority === 'critical' && !notification.read && (
                            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-red-900/40 text-red-400 border border-red-500/30 rounded-full text-xs font-bold">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd" />
                              </svg>
                              CRITICAL
                            </span>
                          )}
                        </div>
                      </div>

                      {!notification.read && (
                        <button
                          onClick={e => markAsRead(notification.id, e)}
                          title={t('markAsReadTitle')}
                          className="absolute top-2 right-2 p-1 text-amber-400 hover:text-amber-300 hover:bg-amber-900/30 rounded-lg border border-amber-500/20 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.notifications.length > 0 && (
              <div className="p-3 border-t-2 border-amber-500/20 bg-gradient-to-r from-slate-900 to-black">
                <button
                  onClick={() => { navigate('/products'); setIsOpen(false); }}
                  className="w-full text-sm text-amber-400 hover:text-amber-300 font-bold text-center hover:bg-amber-900/20 py-2 rounded-xl transition-colors"
                >
                  View all products →
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
