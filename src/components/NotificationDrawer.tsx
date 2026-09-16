import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Calendar,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'deadline'>('all');
  const [browserNotifStatus, setBrowserNotifStatus] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const requestBrowserPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Browser notifications are not supported by this browser.');
      return;
    }
    const permission = await Notification.requestPermission();
    setBrowserNotifStatus(permission);
    if (permission === 'granted') {
      new Notification('PakUni Admissions Hub', {
        body: '🔔 Notifications active! You will receive alerts for upcoming university test dates and deadlines.',
        icon: '/favicon.ico'
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const filteredAlerts = alerts.filter((item) => {
    if (filter === 'unread') return !item.read;
    if (filter === 'deadline') return item.type === 'deadline';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Admissions Notifications
                </h3>
                <p className="text-xs text-slate-500">
                  Deadlines, test dates & merit alerts
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Browser Notification Permission Banner */}
          <div className="px-4 py-3 bg-emerald-50/80 border-b border-emerald-200/70 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Browser Push Alerts:</span>
              </div>
              {browserNotifStatus === 'granted' ? (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Enabled ✓
                </span>
              ) : (
                <button
                  type="button"
                  onClick={requestBrowserPermission}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  Enable Alerts
                </button>
              )}
            </div>
            {testSent && (
              <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                ✓ Test notification sent to your device!
              </p>
            )}
          </div>

          {/* Filter Bar */}
          <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between bg-white text-xs">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  filter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  filter === 'unread'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Unread ({alerts.filter((a) => !a.read).length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('deadline')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  filter === 'deadline'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Deadlines
              </button>
            </div>

            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No alerts in this view</p>
              </div>
            ) : (
              filteredAlerts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onMarkAsRead(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    item.read
                      ? 'bg-white border-slate-200 opacity-80'
                      : 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.read ? 'bg-slate-300' : 'bg-emerald-600'
                        }`}
                      />
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-2.5"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
