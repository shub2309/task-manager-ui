import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import Swal from 'sweetalert2';

const Users = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'USER' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', newUser);
            setNewUser({ name: '', email: '', password: '', role: 'USER' });
            fetchUsers();
            Swal.fire({
                title: 'Success!',
                text: 'User created successfully.',
                icon: 'success',
                background: '#1e1b4b',
                color: '#fff',
                confirmButtonColor: '#f472b6'
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to create user',
                icon: 'error',
                background: '#1e1b4b',
                color: '#fff',
                confirmButtonColor: '#f472b6'
            });
        }
    };

    if (user?.role !== 'ADMIN') {
        return <div style={{ color: 'white', padding: '2rem' }}>Unauthorized</div>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>User Management</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* User List */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Existing Users</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {users.map((u) => (
                            <div key={u.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                                </div>
                                <span className={`status-badge ${u.role === 'ADMIN' ? 'status-done' : 'status-inprogress'}`}>
                                    {u.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Create User Form */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Create New User</h2>
                    <form onSubmit={handleCreateUser}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Name</label>
                            <input
                                type="text"
                                value={newUser.name}
                                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                required
                                placeholder="Full Name"
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                required
                                placeholder="Email Address"
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
                            <input
                                type="password"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                required
                                placeholder="Password"
                                minLength={8}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Role</label>
                            <select
                                value={newUser.role}
                                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <button className="primary-btn" type="submit">Create User</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Users;
