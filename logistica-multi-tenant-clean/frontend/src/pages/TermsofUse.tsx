import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, Badge, Alert } from '../components/common';

const sections = [
  {
    title: 'User Responsibilities',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access.',
  },
  {
    title: 'Prohibited Activities',
    content:
      'You may not use the service for illegal purposes, to harm others, or to violate any applicable laws or regulations. This includes unauthorized data scraping, reverse engineering, or distributing malware.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount paid by you in the preceding 12 months.',
  },
  {
    title: 'Changes to Terms',
    content:
      'We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes your acceptance of the updated terms.',
  },
];

const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
          ← Back
        </Link>
        <div className="mt-4">
            <h1 className="text-3xl font-extrabold text-white leading-tight">Terms of Use</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: March 2026</p>
        </div>
        <p className="text-gray-400 mt-4 leading-relaxed">
          These Terms of Use govern your access to and use of our logistics multi-tenant application.
          By using the service, you agree to be bound by these terms.
        </p>
      </header>

      <main className="space-y-4">
        {sections.map((section, i) => (
          <section key={i} className="bg-gray-900 p-6 rounded">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{section.content}</p>
          </section>
        ))}

        <section className="bg-gray-900 p-6 rounded">
          <h2 className="text-lg font-semibold text-white mb-3">Contact Us</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            If you have questions about these Terms of Use, our support team is here to help.
          </p>
          <a
            href="mailto:support@example.com"
            className="inline-block bg-green-600 hover:bg-green-500 transition-colors px-4 py-2 rounded text-sm text-white font-medium"
          >
            support@example.com
          </a>
        </section>
      </main>
    </div>
    </div>
  );
};

export default TermsOfUse;