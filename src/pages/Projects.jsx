import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

  const handleDeleteProject = (e, projectId) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      background: '#1e1b4b',
      color: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#f472b6',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/projects/${projectId}`).then(() => {
          fetchProjects();
          Swal.fire({
            title: 'Deleted!',
            text: 'Your project has been deleted.',
            icon: 'success',
            background: '#1e1b4b',
            color: '#fff',
            confirmButtonColor: '#f472b6'
          });
        });
      }
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Projects</h1>
        {user?.role === 'ADMIN' && (
          <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              placeholder="New Project Name"
              style={{ width: '250px', margin: 0 }}
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
            />
            <button type="submit" className="primary-btn" style={{ width: 'auto' }}>Create</button>
          </form>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map((project) => (
          <div
            key={project.id}
            className="glass-card"
            style={{ padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>{project.name}</h2>
            {user?.role === 'ADMIN' && (
              <button
                onClick={(e) => handleDeleteProject(e, project.id)}
                className="status-overdue"
                style={{ border: 'none', cursor: 'pointer', fontSize: '0.8rem', marginTop: '1rem', padding: '0.5rem 1rem' }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
