import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [users, setUsers] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', due_date: '', priority: 'MEDIUM', assigned_to: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProject();
        if (user.role === 'ADMIN') {
            fetchUsers();
        }
    }, [id]);

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

    const fetchUsers = async () => {
        // We need an endpoint to get all users for dropdown. Assuming /users exists or we mock it? 
        // Laravel logic usually requires a User Controller index. I didn't implement User::index for Admin. 
        // I will implement a quick one or assumes it exists? 
        // Actually, I can't assign tasks without users.
        // Let's assume I can fetch users. If not, I'll add the endpoint.
        // For now, I'll try /users if I added it? I didn't add a general /users in api.php.
        // I'll add logic to fetch users in a bit.
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'TODO': return 'bg-gray-200 text-gray-800';
            case 'IN_PROGRESS': return 'bg-blue-200 text-blue-800';
            case 'DONE': return 'bg-green-200 text-green-800';
            case 'OVERDUE': return 'bg-red-200 text-red-800';
            default: return 'bg-gray-100';
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-gray-600 mb-8">{project.description}</p>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
                    <div className="space-y-4">
                        {project.tasks?.map((task) => (
                            <div key={task.id} className="border p-4 rounded shadow bg-white flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{task.title}</h3>
                                    <p className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Assigned: {task.assignee?.name}</p>
                                    <span className={`text-xs px-2 py-1 rounded inline-block mt-2 ${getStatusColor(task.status)}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <div>
                                    {/* Actions */}
                                    {task.status !== 'DONE' && task.status !== 'OVERDUE' && (
                                        <select
                                            value={task.status}
                                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                            className="border p-1 rounded"
                                        >
                                            <option value="TODO">Todo</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                    )}
                                    {task.status === 'OVERDUE' && user.role === 'ADMIN' && (
                                        <button
                                            onClick={() => updateTaskStatus(task.id, 'DONE')}
                                            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                                        >
                                            Close (Done)
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Create Task Form (Admin Only) */}
                {user.role === 'ADMIN' && (
                    <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded h-fit">
                        <h2 className="text-xl font-bold mb-4">Create Task</h2>
                        <form onSubmit={handleCreateTask}>
                            <div className="mb-2">
                                <label className="block text-sm">Title</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm">Due Date</label>
                                <input
                                    type="datetime-local"
                                    className="w-full border p-2 rounded"
                                    value={newTask.due_date}
                                    onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm">Priority</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={newTask.priority}
                                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm">Assign To (User ID for now)</label>
                                <input
                                    type="number"
                                    placeholder="User ID"
                                    className="w-full border p-2 rounded"
                                    value={newTask.assigned_to}
                                    onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
                                    required
                                />
                                {/* Ideally this is a select dropdown of users */}
                            </div>
                            <button className="w-full bg-blue-600 text-white p-2 rounded">Create Task</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
