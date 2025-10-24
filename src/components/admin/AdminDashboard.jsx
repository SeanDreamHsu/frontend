import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Settings } from 'lucide-react';
import Alert from '../Alert';
import { BACKEND_BASE_URL } from '../../constants';

const AdminDashboard = ({ userToken }) => {
  const [settings, setSettings] = useState({ service_fee_b2c: 0, service_fee_b2b: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const settingsRes = await fetch(`${BACKEND_BASE_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!settingsRes.ok) {
        const body = await settingsRes.text();
        throw new Error(`Settings request failed: ${settingsRes.status} ${settingsRes.statusText} - ${body}`);
      }
      const settingsData = await settingsRes.json();
      setSettings(settingsData);

      const usersRes = await fetch(`${BACKEND_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!usersRes.ok) {
        const body = await usersRes.text();
        throw new Error(`Users request failed: ${usersRes.status} ${usersRes.statusText} - ${body}`);
      }
      const usersData = await usersRes.json();
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveSettings = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_fee_b2c: parseFloat(settings.service_fee_b2c) || 0,
          service_fee_b2b: parseFloat(settings.service_fee_b2b) || 0,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to save settings: ${response.status} ${response.statusText} - ${body}`);
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSuccess('Settings saved successfully.');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    alert(`Changing user ${userId} to ${newRole}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="text-sky-500" />
        <h2 className="text-3xl font-bold text-slate-700">Admin Dashboard</h2>
      </div>
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <section className="p-6 bg-white/90 rounded-2xl border border-sky-100 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Service Fee Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="b2c_fee" className="block text-sm font-medium text-slate-600">
              B2C Service Fee ($)
            </label>
            <input
              type="number"
              step="0.01"
              id="b2c_fee"
              value={settings.service_fee_b2c}
              onChange={(e) => setSettings({ ...settings, service_fee_b2c: e.target.value })}
              className="w-full mt-1 p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            />
          </div>
          <div>
            <label htmlFor="b2b_fee" className="block text-sm font-medium text-slate-600">
              B2B Service Fee ($)
            </label>
            <input
              type="number"
              step="0.01"
              id="b2b_fee"
              value={settings.service_fee_b2b}
              onChange={(e) => setSettings({ ...settings, service_fee_b2b: e.target.value })}
              className="w-full mt-1 p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
            />
          </div>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={handleSaveSettings}
            className="py-2 px-6 rounded-xl font-semibold text-white bg-sky-500 hover:bg-sky-400 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </section>

      <section className="p-6 bg-white/90 rounded-2xl border border-sky-100 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">User Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-sky-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.uid}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                      defaultValue={user.role}
                      className="p-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                    >
                      <option value="b2c">B2C</option>
                      <option value="b2b">B2B</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
