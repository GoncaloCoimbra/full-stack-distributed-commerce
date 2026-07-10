import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, Badge, Alert } from '../components/common';

const cookieTypes = [
  {
    name: 'Essential',
    badge: 'Always active',
    badgeColor: 'text-green-400 bg-green-400/10',
    description:
      'Required for the platform to function. They enable core features like authentication, session management, and security.',
  },
  {
    name: 'Analytics',
    badge: 'Optional',
    badgeColor: 'text-yellow-400 bg-yellow-400/10',
    description:
      'Help us understand how users interact with our application so we can improve performance and usability.',
  },
  {
    name: 'Preferences',
    badge: 'Optional',
    badgeColor: 'text-yellow-400 bg-yellow-400/10',
    description:
      'Remember your settings and customizations such as language, theme, and display preferences across sessions.',
  },
];

const sections = [
  {
    title: 'What Are Cookies?',
    content:
      'Cookies are small text files stored on your device by your browser. They help us deliver a more consistent experience by remembering information about your visit.',
  },
  {
    title: 'Managing Cookies',
    content:
      'You can control or delete cookies through your browser settings at any time. Note that disabling certain cookies may affect the functionality and performance of our platform.',
  },
];

const Cookies: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
          ← Back
        </Link>
        <div className="mt-4">
            <h1 className="text-3xl font-extrabold text-white leading-tight">Cookie Policy</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: March 2026</p>
        </div>
        <p className="text-gray-400 mt-4 leading-relaxed">
          This Cookie Policy explains how we use cookies and similar tracking technologies on our
          logistics multi-tenant application.
        </p>
      </header>

      <main className="space-y-4">
        {sections.map((section, i) => (
          <section key={i} className="bg-gray-900 p-6 rounded">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{section.content}</p>
          </section>
        ))}

        <section className="bg-gray-900 p-6 rounded">
          <h2 className="text-lg font-semibold text-white mb-4">Types of Cookies We Use</h2>
          <div className="space-y-3">
            {cookieTypes.map((cookie, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-800 rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{cookie.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${cookie.badgeColor}`}>
                      {cookie.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{cookie.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-900 p-6 rounded">
          <h2 className="text-lg font-semibold text-white mb-3">Contact Us</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            Questions about our Cookie Policy? Get in touch with our privacy team.
          </p>
          <a
            href="mailto:privacy@example.com"
            className="inline-block bg-purple-600 hover:bg-purple-500 transition-colors px-4 py-2 rounded text-sm text-white font-medium"
          >
            privacy@example.com
          </a>
        </section>
      </main>
    </div>
    </div>
  );
};

export default Cookies;