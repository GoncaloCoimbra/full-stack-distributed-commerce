import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, Badge, Alert } from '../components/common';

const sections = [
  {
    title: 'Information We Collect',
    content:
      'We may collect personal information such as your name, email address, and usage data to provide and improve our logistics services. This includes data you provide directly and data collected automatically through your use of the platform.',
  },
  {
    title: 'How We Use Your Information',
    content:
      'Your information is used to operate the application, communicate with you, and enhance user experience. We may also use it for analytics and service improvement purposes.',
  },
  {
    title: 'Data Protection',
    content:
      'We implement industry-standard security measures to protect your data at rest and in transit. We do not share your information with third parties without your explicit consent.',
  },
  {
    title: 'Your Rights',
    content:
      'You have the right to access, correct, or delete your personal data at any time. You may also object to processing or request data portability by contacting our team.',
  },
];

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
          ← Back
        </Link>
        <div className="mt-4">
            <h1 className="text-3xl font-extrabold text-white leading-tight">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mt-1">Last updated: March 2026</p>
        </div>
        <p className="text-gray-400 mt-4 leading-relaxed">
          This Privacy Policy describes how we collect, use, and protect your personal information
          when you use our logistics multi-tenant application.
        </p>
      </header>

      <main className="space-y-4">
        {sections.map((section, i) => (
          <section key={i} className="bg-gray-900 p-6 rounded">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
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
            If you have questions about this Privacy Policy, please reach out to our privacy team.
          </p>
          <a
            href="mailto:privacy@example.com"
            className="inline-block bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded text-sm text-white font-medium"
          >
            privacy@example.com
          </a>
        </section>
      </main>
    </div>
    </div>
  );
};

export default PrivacyPolicy;