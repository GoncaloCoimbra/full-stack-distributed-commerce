import React from 'react';
import { Button, Input, Card, Badge, Alert } from '../components/common';

const SystemStatus: React.FC = () => {
  const services = [
    { name: 'API', status: 'operational' },
    { name: 'Database', status: 'degraded' },
    { name: 'Route Worker', status: 'operational' },
    { name: 'Map Service', status: 'maintenance' },
  ];

  const badge = (s: string) => {
    if (s === 'operational') return <span className="px-2 py-1 text-xs bg-green-600 rounded">Operational</span>;
    if (s === 'degraded') return <span className="px-2 py-1 text-xs bg-yellow-500 rounded">Degraded</span>;
    if (s === 'maintenance') return <span className="px-2 py-1 text-xs bg-red-600 rounded">Maintenance</span>;
    return <span className="px-2 py-1 text-xs bg-gray-600 rounded">Unknown</span>;
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header>
        <h1 className="text-3xl font-extrabold text-white">System Status</h1>
        <p className="text-gray-400 mt-2">Overview of availability of main components.</p>
      </header>

      <main className="mt-6 bg-gray-900 p-6 rounded-lg">
        <div className="space-y-4">
          {services.map(s => (
            <div key={s.name} className="flex items-center justify-between bg-gray-800 p-3 rounded">
              <div>
                <div className="text-white font-medium">{s.name}</div>
                <div className="text-sm text-gray-400">Last check: 2 minutes ago</div>
              </div>
              <div>{badge(s.status)}</div>
            </div>
          ))}
        </div>
      </main>

      <section className="mt-6 text-gray-400 text-sm">
        <p>If there are interruptions, we will automatically check and publish updates on this page. For immediate support, open a ticket.</p>
      </section>
    </div>
  );
};

export default SystemStatus;
