import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    // Placeholder for create task logic - assuming simple title creation for now or expanding later
    // The user asked to create a task button but didn't specify full form fields yet, adding basic implementation
    console.log("Create task clicked");
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed');
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

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>My Tasks</h1>
        {/* Only Admins can create tasks */}
        {user?.role === 'ADMIN' && (
          <button
            className="primary-btn"
            style={{ width: 'auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
            onClick={() => Swal.fire({
              title: 'Create Task',
              text: 'Please go to a specific Project to create and assign tasks contextually.',
              icon: 'info',
              confirmButtonText: 'Go to Projects',
              background: '#1e1b4b',
              color: '#fff',
              confirmButtonColor: '#f472b6'
            }).then((res) => {
              if (res.isConfirmed) navigate('/projects');
            })}
          >
            <span>+</span> Create Task
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {tasks.map(task => (
          <div key={task.id} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{task.title}</h3>
              <span className={`status-badge ${getStatusClass(task.status)}`}>{task.status.replace('_', ' ')}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Project: <span style={{ color: 'white' }}>{task.project?.name}</span>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {task.status !== 'DONE' && task.status !== 'OVERDUE' && (
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
