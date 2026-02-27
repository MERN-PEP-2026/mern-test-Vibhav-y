import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';

const DashboardPage = () => {
  const { user, logout, setError } = useAuth();
  const navigate = useNavigate();
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
      setMessage({ type: 'success', text: 'Task created successfully.' });
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
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return `${completed}/${tasks.length} completed`;
  }, [tasks]);

  return (
    <main className="dashboard-page">
      <section className="dashboard-topbar">
        <div>
          <h1 className="dashboard-title">Task Dashboard</h1>
          <p className="muted-text">{summary}</p>
        </div>
        <div className="dashboard-topbar-actions">
          <span className="muted-text">Signed in as {user?.name}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Create task</CardTitle>
          <CardDescription>Add title, due date, details, and tags.</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`ui-alert ${message.type === 'error' ? 'ui-alert-error' : 'ui-alert-success'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleCreate} className="form-grid form-grid-2">
            <Input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <Input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
            <Textarea
              name="description"
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="form-span-2"
            />
            <Input
              name="tags"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={handleChange}
              className="form-span-2"
            />
            <Button type="submit" className="form-span-2">
              Add task
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All tasks</CardTitle>
          <CardDescription>Track progress and keep work moving.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="muted-text">Loading tasks...</p>}
          <div className="task-list">
            {!loading && tasks.length === 0 && <p className="muted-text">No tasks yet.</p>}
            {tasks.map((task) => (
              <article key={task._id} className="task-item">
                <div className="task-item-header">
                  <Badge variant={task.status === 'completed' ? 'success' : 'warning'}>
                    {task.status}
                  </Badge>
                  <span className="muted-text">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                <h3>{task.title}</h3>
                {task.description && <p className="muted-text">{task.description}</p>}
                <div className="task-item-footer">
                  <div>
                    {task.dueDate && (
                      <span className="muted-text">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.tags?.length > 0 && (
                      <div className="tag-list">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(task)}>
                      Toggle status
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeTask(task._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default DashboardPage;
