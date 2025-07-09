import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProject = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        target_amount: '',
        start_date: '',
        end_date: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [project, setProject] = useState(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('user_data');
        if (storedUserData) {
            try {
                setCurrentUser(JSON.parse(storedUserData));
            } catch {
                setCurrentUser(null);
            }
        }
        const fetchProject = async () => {
            const accessToken = localStorage.getItem('access_token');
            try {
                const res = await axios.get(`http://localhost:8000/api/projects/projects/${projectId}/`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                setForm({
                    title: res.data.title || '',
                    description: res.data.description || '',
                    target_amount: res.data.target_amount || '',
                    start_date: res.data.start_date || '',
                    end_date: res.data.end_date || ''
                });
                setProject(res.data);
            } catch (err) {
                console.error("Fetch project error:", err, err?.response);
                setError('Failed to load project data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    useEffect(() => {
        if (project && currentUser) {
            if (Number(project.owner) === Number(currentUser.id)) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        }
    }, [project, currentUser]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const accessToken = localStorage.getItem('access_token');
        try {
            await axios.put(`http://localhost:8000/api/projects/${projectId}/`, form, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            setSuccess('Project updated successfully!');
            setTimeout(() => navigate('/view-projects'), 1200);
        } catch (err) {
            console.error("Update project error:", err, err?.response);
            setError('Failed to update project.');
        }
    };

    if (loading) {
        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
                style={{ padding: '20px' }}>
                <div className="card shadow-lg border-0" style={{ maxWidth: 400, width: '100%' }}>
                    <div className="card-body p-5 text-center">
                        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                        <h5 className="text-dark">Loading project data...</h5>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
                style={{ padding: '20px' }}>
                <div className="card shadow-lg border-0" style={{ maxWidth: 500, width: '100%' }}>
                    <div className="card-body p-5 text-center">
                        <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                            style={{ width: 80, height: 80 }}>
                            <i className="fas fa-exclamation-triangle" style={{ fontSize: 40 }}></i>
                        </div>
                        <h2 className="text-dark fw-bold mb-3">Error</h2>
                        <div className="alert alert-danger border-0 shadow-sm mb-4" 
                            style={{ background: 'linear-gradient(135deg, #fee 0%, #fcc 100%)' }}>
                            {error}
                        </div>
                        <button 
                            className="btn btn-primary btn-lg px-5"
                            onClick={() => navigate('/view-projects')}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                fontWeight: '600'
                            }}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Projects
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!isOwner) {
        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
                style={{ padding: '20px' }}>
                <div className="card shadow-lg border-0" style={{ maxWidth: 500, width: '100%' }}>
                    <div className="card-body p-5 text-center">
                        <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                            style={{ width: 80, height: 80 }}>
                            <i className="fas fa-lock" style={{ fontSize: 40 }}></i>
                        </div>
                        <h2 className="text-dark fw-bold mb-3">Access Denied</h2>
                        <div className="alert alert-warning border-0 shadow-sm mb-4"
                            style={{ background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)' }}>
                            You are not authorized to edit this project.
                        </div>
                        <button 
                            className="btn btn-primary btn-lg px-5"
                            onClick={() => navigate('/view-projects')}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                fontWeight: '600'
                            }}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Projects
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
            style={{ padding: '20px' }}>
            <div className="card shadow-lg border-0" style={{ maxWidth: 700, width: '100%' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                            style={{ width: 60, height: 60 }}>
                            <i className="fas fa-edit" style={{ fontSize: 24 }}></i>
                        </div>
                        <h2 className="text-dark fw-bold">Edit Project</h2>
                        <p className="text-muted">Update your project information</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show border-0 shadow-sm mb-4" role="alert"
                            style={{ background: 'linear-gradient(135deg, #fee 0%, #fcc 100%)' }}>
                            <div className="d-flex align-items-center">
                                <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{ width: 40, height: 40 }}>
                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: 16 }}></i>
                                </div>
                                <div className="flex-grow-1">
                                    <strong>Error:</strong> {error}
                                </div>
                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success alert-dismissible fade show border-0 shadow-sm mb-4" role="alert"
                            style={{ background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' }}>
                            <div className="d-flex align-items-center">
                                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{ width: 40, height: 40 }}>
                                    <i className="fas fa-check" style={{ fontSize: 16 }}></i>
                                </div>
                                <div className="flex-grow-1">
                                    <strong>Success:</strong> {success}
                                </div>
                                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fas fa-heading me-2 text-primary"></i>
                                Project Title
                            </label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                name="title" 
                                value={form.title} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter project title"
                                style={{ borderColor: '#e1e5e9' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fas fa-align-left me-2 text-primary"></i>
                                Description
                            </label>
                            <textarea 
                                className="form-control form-control-lg" 
                                name="description" 
                                value={form.description} 
                                onChange={handleChange} 
                                rows="4" 
                                required 
                                placeholder="Enter project description"
                                style={{ borderColor: '#e1e5e9' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fas fa-dollar-sign me-2 text-primary"></i>
                                Target Amount
                            </label>
                            <input 
                                type="number" 
                                className="form-control form-control-lg" 
                                name="target_amount" 
                                value={form.target_amount} 
                                onChange={handleChange} 
                                required 
                                min="0" 
                                placeholder="Enter target amount"
                                style={{ borderColor: '#e1e5e9' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fas fa-calendar-plus me-2 text-primary"></i>
                                Start Date
                            </label>
                            <input 
                                type="date" 
                                className="form-control form-control-lg" 
                                name="start_date" 
                                value={form.start_date} 
                                onChange={handleChange} 
                                required 
                                style={{ borderColor: '#e1e5e9' }}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                <i className="fas fa-calendar-check me-2 text-primary"></i>
                                End Date
                            </label>
                            <input 
                                type="date" 
                                className="form-control form-control-lg" 
                                name="end_date" 
                                value={form.end_date} 
                                onChange={handleChange} 
                                required 
                                style={{ borderColor: '#e1e5e9' }}
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button 
                                type="button" 
                                className="btn btn-secondary btn-lg px-4"
                                onClick={() => navigate('/view-projects')}
                                style={{ fontWeight: '600' }}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg px-5"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fas fa-save me-2"></i>
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProject; 