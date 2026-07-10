import React from 'react';
import { Button, Input, Card, Badge, Alert } from '../components/common';

const Updates: React.FC = () => {
  const releases = [
    { version: 'v1.4.0', data: '2026-02-20', notes: ['Performance improvements in tracking', 'Fixes in transport filters'] },
    { version: 'v1.3.2', data: '2026-01-10', notes: ['User permission adjustments', 'Logging improvements'] },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header>
        <h1 className="text-3xl font-extrabold text-white">Updates & Changelog</h1>
        <p className="text-gray-400 mt-2">Version history, release notes and how they affect your operation.</p>
      </header>

      <main className="mt-6 space-y-6">
        {releases.map(r => (
          <div key={r.version} className="bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-white font-semibold">{r.version}</h3>
                <p className="text-sm text-gray-400">Released on {r.data}</p>
              </div>
            </div>
            <ul className="mt-3 ml-4 list-disc text-gray-300">
              {r.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        ))}
      </main>

      <footer className="mt-8 text-gray-400 text-sm">
        <p>To see the roadmap and planning, consult the project documentation or contact via help center.</p>
      </footer>
    </div>
  );
};

export default Updates;
