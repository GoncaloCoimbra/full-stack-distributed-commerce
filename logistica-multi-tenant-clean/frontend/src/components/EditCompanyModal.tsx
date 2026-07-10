import React, { useState, useEffect } from 'react';
import { theme } from '../theme.config';

interface Company {
  id: string;
  name: string;
  domain: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface EditCompanyModalProps {
  company: Company;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ company, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      name: company.name || '',
      domain: company.domain || '',
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || ''
    });
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/company/${company.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const date = await response.json();
        throw new Error(date.message || 'Error updating company');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error updating company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.cards.form} max-w-md w-full max-h-[90vh] overflow-y-auto`}>        
        {/* Header */}
        <div className={`sticky top-0 ${theme.backgrounds.header} px-6 py-4 flex items-center justify-between border-b border-slate-700`}>          
          <h2 className="text-2xl font-bold text-white">Edit Company</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className={theme.alerts.error + " mb-4"}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2" htmlFor="name">
              Company Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={theme.inputs.base}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2" htmlFor="domain">
              Domínio *
            </label>
            <input
              type="text"
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className={theme.inputs.base}
              required
            />
            <p className="text-slate-400 text-xs mt-1">Used to identify the company in the system</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={theme.inputs.base}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={theme.inputs.base}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={theme.inputs.base}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={theme.buttons.primary + " disabled:opacity-50"}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyModal;