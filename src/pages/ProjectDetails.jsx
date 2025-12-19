import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', due_date: '', priority: 'MEDIUM', assigned_to: '' });
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchProject();
        if (user?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [id]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProject = async () => {
        try {
            const res = await api.get(`/projects/${id}`);
            setProject(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { ...newTask, project_id: id });
            setNewTask({ title: '', due_date: '', priority: 'MEDIUM', assigned_to: '' });
            fetchProject();
        } catch (error) {
            console.warn(error.response?.data?.message || error.message);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            fetchProject();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'IN_PROGRESS': return 'status-inprogress';
            case 'DONE': return 'status-done';
            case 'OVERDUE': return 'status-overdue';
            default: return 'status-todo';
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>;
    if (!project) return <div style={{ color: 'white', padding: '2rem' }}>Project not found</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{project.name}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px' }}>{project.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: user.role === 'ADMIN' ? '1fr 380px' : '1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Task List */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Tasks</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {project.tasks?.map((task) => (
                            <div key={task.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{task.title}</h3>
                                        <span className={`status-badge ${getStatusClass(task.status)}`}>{task.status.replace('_', ' ')}</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ marginRight: '1rem' }}>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                        <span>Assigned: {task.assignee?.name || 'Unassigned'}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {task.status !== 'DONE' && task.status !== 'OVERDUE' && (
                                        <select
                                            value={task.status}
                                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                            style={{ margin: 0, padding: '0.5rem', width: 'auto', fontSize: '0.9rem' }}
                                        >
                                            <option value="TODO">To Do</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                    )}
                                    {task.status === 'OVERDUE' && user.role === 'ADMIN' && (
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'DONE')}
                                            className="primary-btn"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', width: 'auto' }}
                                        >
                                            Close (Done)
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {project.tasks?.length === 0 && (
                            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No tasks found for this project.
                            </div>
                        )}
                    </div>
                </div>

                {/* Create Task Form (Admin Only) */}
                {user.role === 'ADMIN' && (
                    <div className="glass-card">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Create Task</h2>
                        <form onSubmit={handleCreateTask}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Title</label>
                                <input
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                    placeholder="Task Title"
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Due Date</label>
                                <input
                                    type="datetime-local"
                                    value={newTask.due_date}
                                    onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Priority</label>
                                <select
                                    value={newTask.priority}
                                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Assign To</label>
                                <select
                                    value={newTask.assigned_to}
                                    onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                            <button className="primary-btn">Create Task</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
