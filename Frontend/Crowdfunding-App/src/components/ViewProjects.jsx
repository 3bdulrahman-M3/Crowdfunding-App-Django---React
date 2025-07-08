import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }
        setIsAuthenticated(true);

        // Fetch projects from backend
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/projects/projects/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setProjects(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('Authentication failed. Please login again.');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user_data');
                } else {
                    setError('Failed to fetch projects. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleBackToHome = () => {
        navigate('/home');
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '20px'
                }}>
                <div className="card shadow-lg border-0" style={{ maxWidth: 500, width: '100%' }}>
                    <div className="card-body p-5 text-center">
                        <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                            style={{ width: 80, height: 80 }}>
                            <i className="fas fa-exclamation-triangle" style={{ fontSize: 40 }}></i>
                        </div>
                        <h2 className="text-dark fw-bold mb-3">Access Denied</h2>
                        <p className="text-muted fs-5 mb-4">
                            You need to be logged in to view projects.
                        </p>
                        <button
                            className="btn btn-primary btn-lg px-5"
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                fontWeight: '600'
                            }}
                        >
                            <i className="fas fa-sign-in-alt me-2"></i>
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px'
            }}>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    {/* Header */}
                    <div className="card shadow-lg border-0 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h1 className="text-dark fw-bold mb-1">
                                        <i className="fas fa-project-diagram me-3 text-primary"></i>
                                        All Projects
                                    </h1>
                                    <p className="text-muted mb-0">Discover amazing crowdfunding campaigns</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={handleBackToHome}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Home
                                    </button>
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
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

                    {/* Loading State */}
                    {loading && (
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-5 text-center">
                                <div className="spinner-border text-primary mb-3" role="status" style={{ width: 3 + 'rem', height: 3 + 'rem' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <h4 className="text-dark">Loading Projects...</h4>
                                <p className="text-muted">Please wait while we fetch the latest projects.</p>
                            </div>
                        </div>
                    )}

                    {/* Projects Grid */}
                    {!loading && !error && (
                        <>
                            {projects.length === 0 ? (
                                <div className="card shadow-lg border-0">
                                    <div className="card-body p-5 text-center">
                                        <div className="bg-light text-muted rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                            style={{ width: 100, height: 100 }}>
                                            <i className="fas fa-folder-open" style={{ fontSize: 48 }}></i>
                                        </div>
                                        <h3 className="text-dark fw-bold mb-3">No Projects Found</h3>
                                        <p className="text-muted fs-5 mb-4">
                                            There are currently no projects available. Be the first to create one!
                                        </p>
                                        <button
                                            className="btn btn-primary btn-lg px-5"
                                            onClick={() => navigate('/create-project')}
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                fontWeight: '600'
                                            }}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            Create Project
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {projects.map((project) => (
                                        <div key={project.id} className="col-12 col-md-6 col-lg-4">
                                            <div className="card shadow-lg border-0 h-100" style={{ transition: 'transform 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <h5 className="card-title fw-bold text-dark mb-0" style={{ lineHeight: 1.2 }}>
                                                            {project.title}
                                                        </h5>
                                                        <span className="badge bg-primary rounded-pill">
                                                            <i className="fas fa-user me-1"></i>
                                                            {project.owner}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="card-text text-muted mb-3" style={{ 
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {project.description}
                                                    </p>
                                                    
                                                    <div className="mb-3">
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <span className="text-muted small">Target Amount:</span>
                                                            <span className="fw-bold text-success">
                                                                {formatCurrency(project.target_amount)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="row text-center mb-3">
                                                        <div className="col-6">
                                                            <div className="border-end">
                                                                <div className="text-primary fw-bold small">Start Date</div>
                                                                <div className="text-muted small">{formatDate(project.start_date)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="text-primary fw-bold small">End Date</div>
                                                            <div className="text-muted small">{formatDate(project.end_date)}</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-center">
                                                        <small className="text-muted">
                                                            <i className="fas fa-calendar-alt me-1"></i>
                                                            Created: {formatDate(project.created_at)}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewProjects;