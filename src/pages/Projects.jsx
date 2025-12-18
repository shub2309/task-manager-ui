import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newProjectName });
      setNewProjectName('');
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {user?.role === 'ADMIN' && (
          <form onSubmit={handleCreateProject} className="flex gap-2">
            <input
              type="text"
              placeholder="New Project Name"
              className="border p-2 rounded"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-6 rounded shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-600">{project.description || 'No description'}</p>
            <div className="mt-4 text-sm text-gray-400">Owner: {project.owner?.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
