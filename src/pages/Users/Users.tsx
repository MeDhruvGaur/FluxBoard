import React, { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addNotification } from '../../features/notifications/slices/notificationSlice';
import { UserRole } from '../../types/auth.types';

interface Member {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'invited' | 'suspended';
  lastActive: string;
}

const INITIAL_MEMBERS: Member[] = [
  { id: 'usr-1', name: 'Alex Morgan', email: 'alex.morgan@fluxboard.io', role: 'Admin', department: 'Global Architecture', status: 'active', lastActive: '2 mins ago' },
  { id: 'usr-2', name: 'Elena Rostova', email: 'elena.rostova@fluxboard.io', role: 'Analyst', department: 'Data Intelligence', status: 'active', lastActive: '12 mins ago' },
  { id: 'usr-3', name: 'Marcus Chen', email: 'marcus.chen@fluxboard.io', role: 'Manager', department: 'Infrastructure Ops', status: 'active', lastActive: '1 hour ago' },
  { id: 'usr-4', name: 'Sarah Jenkins', email: 'sarah.j@fluxboard.io', role: 'Analyst', department: 'Growth & Monetization', status: 'active', lastActive: '3 hours ago' },
  { id: 'usr-5', name: 'Tariq Al-Mansoor', email: 'tariq.m@fluxboard.io', role: 'Viewer', department: 'Investor Relations', status: 'invited', lastActive: 'Never' },
  { id: 'usr-6', name: 'Chloe Dubois', email: 'chloe.d@fluxboard.io', role: 'Analyst', department: 'Security Compliance', status: 'suspended', lastActive: '4 days ago' }
];

export const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Analyst');
  const [newDept, setNewDept] = useState('Data Platform');

  // Role Guard Check
  if (currentUser?.role === 'Viewer') {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--accent-rose)' }}>Access Restricted</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Your current role (Viewer) does not have authorization to view or manage enterprise team members.
        </p>
      </div>
    );
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newMember: Member = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDept,
      status: 'active',
      lastActive: 'Just now'
    };

    setMembers([newMember, ...members]);
    setIsAddOpen(false);
    setNewName('');
    setNewEmail('');

    dispatch(
      addNotification({
        title: 'Team Member Provisioned',
        message: `${newName} has been granted ${newRole} privileges.`,
        type: 'success'
      })
    );
  };

  const handleRoleChange = (id: string, role: UserRole) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, role } : m)));
    dispatch(
      addNotification({
        title: 'Permissions Updated',
        message: `Member ${id} permissions altered to ${role}.`,
        type: 'info'
      })
    );
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Enterprise User & Access Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
            Role-based access control (RBAC), security audit logs, and directory provisioning
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <UserPlus size={16} /> Add Team Member
        </button>
      </div>

      {/* Access stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Enterprise Seats</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {members.length} / 50
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MFA Enforcement Rate</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', marginTop: '4px' }}>
            100%
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Privileged Admins</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '4px' }}>
            {members.filter((m) => m.role === 'Admin').length} Active
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--accent-primary)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Provision New Enterprise Account</h3>
          <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
              <input type="text" className="form-input" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Liam Walker" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Work Email</label>
              <input type="email" className="form-input" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="name@fluxboard.io" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Assigned Role</label>
              <select className="form-input" value={newRole} onChange={(e) => setNewRole(e.target.value as any)}>
                <option value="Admin">Admin</option>
                <option value="Analyst">Analyst</option>
                <option value="Manager">Manager</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Department</label>
              <input type="text" className="form-input" value={newDept} onChange={(e) => setNewDept(e.target.value)} placeholder="Engineering / SecOps" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Provision</button>
              <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Directory Table */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Team Directory</h3>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.2rem', paddingRight: '0.75rem', height: '36px' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Name & Email</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Department</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Last Active</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.name}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{member.email}</div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        outline: 'none'
                      }}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Manager">Manager</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{member.department}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span
                      className={`badge ${
                        member.status === 'active'
                          ? 'badge-success'
                          : member.status === 'invited'
                          ? 'badge-info'
                          : 'badge-danger'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {member.lastActive}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        setMembers(members.filter((m) => m.id !== member.id));
                        dispatch(
                          addNotification({
                            title: 'Member Removed',
                            message: `Revoked access for ${member.name}.`,
                            type: 'warning'
                          })
                        );
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem', color: 'var(--accent-rose)' }}
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
