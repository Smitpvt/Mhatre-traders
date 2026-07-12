import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth.js';
import authService from '../services/auth.service.js';
import api from '../services/api.js';
import adminToast from '../utils/toast.js';
import ButtonSpinner from '../components/ui/ButtonSpinner.jsx';

export const Settings = () => {
  const { user, refreshUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [companyFormLoading, setCompanyFormLoading] = useState(false);

  const [companyDetails, setCompanyDetails] = useState({
    company_name: '',
    company_legal_name: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    company_gstin: '',
    bank_name: '',
    bank_account_number: '',
    bank_ifsc: '',
    bank_branch: '',
    invoice_prefix: ''
  });

  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    formState: { errors: profileErrors } 
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });

  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    watch, 
    reset: resetPasswordForm,
    formState: { errors: passwordErrors } 
  } = useForm();

  // Load settings variables
  const fetchSettings = async () => {
    setCompanyLoading(true);
    try {
      const res = await api.get('/admin/settings');
      if (res.success && res.data && res.data.settings) {
        const detailsObj = {};
        res.data.settings.forEach(setting => {
          detailsObj[setting.key] = setting.value;
        });
        setCompanyDetails(prev => ({ ...prev, ...detailsObj }));
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setCompanyLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onUpdateProfile = async (data) => {
    setProfileLoading(true);
    try {
      const res = await authService.updateProfile(data.name, data.email);
      if (res.success) {
        await refreshUser();
        adminToast.success('Profile details updated successfully.');
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setPasswordLoading(true);
    try {
      const res = await authService.changePassword(data.oldPassword, data.newPassword);
      if (res.success) {
        adminToast.success('Password updated successfully.');
        resetPasswordForm();
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Company details changes handler
  const handleCompanyFieldChange = (key, value) => {
    setCompanyDetails(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const onUpdateCompanyDetails = async (e) => {
    e.preventDefault();
    setCompanyFormLoading(true);
    try {
      const res = await api.put('/admin/settings/company', companyDetails);
      if (res.success) {
        adminToast.success('Company invoicing configurations updated.');
        fetchSettings();
      }
    } catch (err) {
      adminToast.error(err.message || 'Failed to update company invoicing variables.');
    } finally {
      setCompanyFormLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-[#ECE7DF]">
        <h1 className="font-headings text-2xl font-bold">System Settings</h1>
        <p className="text-xs text-[#676767]">Manage your profile and company invoicing configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. PROFILE INFORMATION FORM */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700">Profile Information</h2>
            <p className="text-[10px] text-zinc-400">Update your email and administrative display name</p>
          </div>

          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Display Name</label>
              <input
                type="text"
                {...registerProfile('name', { required: 'Name cannot be empty' })}
                className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
              />
              {profileErrors.name && (
                <span className="text-xs text-red-500">{profileErrors.name.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
              <input
                type="email"
                {...registerProfile('email', { 
                  required: 'Email cannot be empty',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
              />
              {profileErrors.email && (
                <span className="text-xs text-red-500">{profileErrors.email.message}</span>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="bg-[#B56A45] hover:bg-[#A05C39] disabled:bg-zinc-300 text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
              >
                {profileLoading && <ButtonSpinner />}
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. PASSWORD FORM */}
        <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700">Security Credentials</h2>
            <p className="text-[10px] text-zinc-400">Modify your login password signature</p>
          </div>

          <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...registerPassword('oldPassword', { required: 'Current password is required' })}
                className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
              />
              {passwordErrors.oldPassword && (
                <span className="text-xs text-red-500">{passwordErrors.oldPassword.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...registerPassword('newPassword', { 
                  required: 'New password is required',
                  minLength: { value: 6, message: 'New password must be at least 6 characters' }
                })}
                className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
              />
              {passwordErrors.newPassword && (
                <span className="text-xs text-red-500">{passwordErrors.newPassword.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...registerPassword('confirmPassword', { 
                  required: 'Confirming your new password is required',
                  validate: (val) => watch('newPassword') === val || 'Passwords do not match'
                })}
                className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
              />
              {passwordErrors.confirmPassword && (
                <span className="text-xs text-red-500">{passwordErrors.confirmPassword.message}</span>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-[#B56A45] hover:bg-[#A05C39] disabled:bg-zinc-300 text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
              >
                {passwordLoading && <ButtonSpinner />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* 3. COMPANY DETAILS FORM */}
      <div className="bg-[#FFFFFF] border border-[#ECE7DF] p-6 rounded-xl shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700">Company Invoice Settings</h2>
          <p className="text-[10px] text-zinc-400">Configure default legal parameters and bank account coordinates printed on receipts</p>
        </div>

        {companyLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-zinc-100 rounded-lg w-full" />
            <div className="h-10 bg-zinc-100 rounded-lg w-full" />
          </div>
        ) : (
          <form onSubmit={onUpdateCompanyDetails} className="space-y-6">
            
            {/* Seller Company Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyDetails.company_name}
                  onChange={(e) => handleCompanyFieldChange('company_name', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Legal Business Name</label>
                <input
                  type="text"
                  required
                  value={companyDetails.company_legal_name}
                  onChange={(e) => handleCompanyFieldChange('company_legal_name', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Seller GSTIN</label>
                <input
                  type="text"
                  required
                  value={companyDetails.company_gstin}
                  onChange={(e) => handleCompanyFieldChange('company_gstin', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Contact Number</label>
                <input
                  type="text"
                  required
                  value={companyDetails.company_phone}
                  onChange={(e) => handleCompanyFieldChange('company_phone', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Contact Email</label>
                <input
                  type="email"
                  required
                  value={companyDetails.company_email}
                  onChange={(e) => handleCompanyFieldChange('company_email', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Invoice Number Prefix</label>
                <input
                  type="text"
                  required
                  value={companyDetails.invoice_prefix}
                  onChange={(e) => handleCompanyFieldChange('invoice_prefix', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden focus:border-[#B56A45]"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Physical Legal Address</label>
              <textarea
                required
                rows="2"
                value={companyDetails.company_address}
                onChange={(e) => handleCompanyFieldChange('company_address', e.target.value)}
                className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden resize-none"
              />
            </div>

            {/* Bank details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#ECE7DF]">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Bank Name</label>
                <input
                  type="text"
                  required
                  value={companyDetails.bank_name}
                  onChange={(e) => handleCompanyFieldChange('bank_name', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Account Number</label>
                <input
                  type="text"
                  required
                  value={companyDetails.bank_account_number}
                  onChange={(e) => handleCompanyFieldChange('bank_account_number', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={companyDetails.bank_ifsc}
                  onChange={(e) => handleCompanyFieldChange('bank_ifsc', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Branch Name</label>
                <input
                  type="text"
                  required
                  value={companyDetails.bank_branch}
                  onChange={(e) => handleCompanyFieldChange('bank_branch', e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCFBF8] border border-[#ECE7DF] rounded-lg text-sm focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={companyFormLoading}
                className="bg-[#B56A45] hover:bg-[#A05C39] disabled:bg-zinc-300 text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
              >
                {companyFormLoading && <ButtonSpinner />}
                <span>Save Company details</span>
              </button>
            </div>

          </form>
        )}
      </div>

    </div>
  );
};

export default Settings;
