'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, Category, Skill, Interest } from '@/lib/types';
import {
  ShieldAlert,
  Users,
  Grid,
  Award,
  Lightbulb,
  Plus,
  Trash2,
  Eye,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'taxonomies'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, taxRes] = await Promise.all([
          fetch('/api/users?limit=100'),
          fetch('/api/taxonomies'),
        ]);

        if (usersRes.ok) {
          const data = await usersRes.json();
          setUsers(data.users || []);
        }

        if (taxRes.ok) {
          const data = await taxRes.json();
          setCategories(data.categories || []);
          setSkills(data.skills || []);
          setInterests(data.interests || []);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    // In our architecture, categories are stored in DB
    setCategories(prev => [
      ...prev,
      {
        id: `cat_${Date.now()}`,
        name: newCatName.trim(),
        slug: newCatName.trim().toLowerCase().replace(/\s+/g, '-'),
        description: newCatDesc.trim(),
      },
    ]);
    setNewCatName('');
    setNewCatDesc('');
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-brand-400" />
              <span>Platform Administration</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Taxonomy & User Moderation
            </h1>
          </div>

          <Link href="/dashboard" className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold">
            Back to Dashboard
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'users' ? 'bg-brand-500 text-white shadow-brand-sm' : 'bg-white text-slate-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users Directory ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'categories' ? 'bg-brand-500 text-white shadow-brand-sm' : 'bg-white text-slate-600'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('taxonomies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'taxonomies' ? 'bg-brand-500 text-white shadow-brand-sm' : 'bg-white text-slate-600'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Skills & Interests ({skills.length + interests.length})</span>
          </button>
        </div>

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="glass-card rounded-3xl p-6 bg-white border border-slate-200 shadow-sm overflow-hidden">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4">
              Registered Platform Users
            </h3>
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 font-bold">User</th>
                      <th className="py-3 px-4 font-bold">Role & Org</th>
                      <th className="py-3 px-4 font-bold">Country</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {u.profileImage ? (
                              <img src={u.profileImage} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold">
                                {u.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-slate-400 text-[11px]">@{u.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-700">{u.role || '—'}</p>
                          <p className="text-slate-400">{u.organisation || '—'}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {u.country || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/profile/${u.username}`}
                            className="text-brand-600 hover:underline font-bold flex items-center gap-1"
                          >
                            <span>View</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No registered users yet.</p>
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <form onSubmit={handleAddCategory} className="glass-card rounded-3xl p-6 bg-white border border-slate-200 space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900">Add New Category to Taxonomy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category Name (e.g. Neuroscience)"
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short Description"
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <button type="submit" className="btn-primary px-5 py-2 rounded-xl text-xs font-bold">
                Add Category
              </button>
            </form>

            <div className="glass-card rounded-3xl p-6 bg-white border border-slate-200">
              <h3 className="font-display font-bold text-base text-slate-900 mb-4">Master Categories ({categories.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {categories.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="font-bold text-xs text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{c.description || c.slug}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAXONOMIES TAB */}
        {activeTab === 'taxonomies' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 bg-white border border-slate-200">
              <h3 className="font-display font-bold text-base text-slate-900 mb-4">Skills Taxonomy ({skills.length})</h3>
              <div className="flex flex-wrap gap-1.5 max-h-96 overflow-y-auto">
                {skills.map((s) => (
                  <span key={s.id} className="badge-pill text-xs">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 bg-white border border-slate-200">
              <h3 className="font-display font-bold text-base text-slate-900 mb-4">Interests Taxonomy ({interests.length})</h3>
              <div className="flex flex-wrap gap-1.5 max-h-96 overflow-y-auto">
                {interests.map((i) => (
                  <span key={i.id} className="badge-pill badge-interest text-xs">
                    {i.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
