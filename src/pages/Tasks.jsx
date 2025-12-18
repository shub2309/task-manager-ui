import { useEffect, useState } from 'react';
import api from '../api/axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

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

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p className="text-gray-500">Project: {task.project?.name}</p>
              <p className="text-sm">Due: {new Date(task.due_date).toLocaleString()}</p>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{task.status}</span>
            </div>
            <div className="flex items-center">
              {task.status !== 'DONE' && task.status !== 'OVERDUE' && (
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="TODO">Todo</option>
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
