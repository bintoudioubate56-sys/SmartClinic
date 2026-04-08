'use client'

import { useState, useEffect } from 'react';
import { getStaffList, inviteStaff, deactivateStaff } from '@/actions/staff';
import { UserRole } from '@/types/database.types';

export default function AdminUsersPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    role: 'doctor' as UserRole,
    firstName: '',
    lastName: '',
    phone: '',
    specialty: '',
  });

  // Clinic ID typically comes from user metadata or context
  const clinicId = 'placeholder-clinic-id'; 

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    const result = await getStaffList(clinicId);
    if (result.success) setStaff(result.data);
    setLoading(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await inviteStaff({ ...formData, clinicId });
    if (result.success) {
      setIsModalOpen(false);
      loadStaff();
      setFormData({ email: '', role: 'doctor', firstName: '', lastName: '', phone: '', specialty: '' });
    } else {
      alert(result.error);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (confirm('Désactiver ce membre du personnel ?')) {
      const result = await deactivateStaff(id);
      if (result.success) loadStaff();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestion du Personnel</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Créer un compte
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Membre</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">Chargement...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">Aucun personnel enregistré.</td></tr>
            ) : staff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{member.id.substring(0,8)}...</div>
                  <div className="text-sm text-gray-500">{member.user_id}</div>
                </td>
                <td className="px-6 py-4 capitalize text-gray-600">{member.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {member.is_active ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {member.is_active && (
                    <button
                      onClick={() => handleDeactivate(member.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Désactiver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold mb-6">Inviter un membre</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Prénom*"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
                <input
                  placeholder="Nom*"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <input
                type="email"
                placeholder="Email*"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                >
                  <option value="doctor">Médecin</option>
                  <option value="receptionist">Réceptionniste</option>
                </select>
                <input
                  placeholder="Téléphone*"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              {formData.role === 'doctor' && (
                <input
                  placeholder="Spécialité"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.specialty}
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                />
              )}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Inviter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
