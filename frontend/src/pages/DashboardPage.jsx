import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout, setError } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', tags: '' });
  const [message, setMessage] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage(null);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      };
      await api.post('/tasks', payload);
      setForm({ title: '', description: '', dueDate: '', tags: '' });
      setMessage({ type: 'success', text: 'Task created' });
      fetchTasks();
    } catch (err) {
      const text = err.response?.data?.message || err.message;
      setMessage({ type: 'error', text });
    }
  };

  const toggleStatus = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        status: task.status === 'pending' ? 'completed' : 'pending'
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const removeTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return `${completed}/${tasks.length} completed`;
  }, [tasks]);

  return (
    <div className="app-shell">
      <div className="page-actions">
        <div className="small-text">
          Signed in as <strong>{user?.name}</strong>
        </div>
        <button className="ghost" onClick={logout} type="button">
          Logout
        </button>
      </div>
      <h1 className="page-heading">My Task Dashboard</h1>
      <p className="small-text">{summary}</p>
      <div className="card">
        <h2>Create a task</h2>
        {message && <div className={`toast ${message.type}`}>{message.text}</div>}
        <form onSubmit={handleCreate} className="form-grid">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={4}
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
          <input
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
          />
          <button className="primary" type="submit">
            Add task
          </button>
        </form>
      </div>

      <div className="card">
        <h2>All tasks</h2>
        {loading && <p className="small-text">Loading tasks…</p>}
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task._id} className="card">
              <div className="task-meta">
                <span className={`status ${task.status}`}>{task.status}</span>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              <h3>{task.title}</h3>
              {task.description && <p className="small-text">{task.description}</p>}
              <div className="task-meta">
                {task.dueDate && (
                  <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
                <div>
                  <button className="ghost" onClick={() => toggleStatus(task)} type="button">
                    Toggle status
                  </button>
                  <button
                    className="ghost"
                    onClick={() => removeTask(task._id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {task.tags?.length > 0 && (
                <div className="tag-list">
                  {task.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {!loading && tasks.length === 0 && <p className="small-text">No tasks created yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
