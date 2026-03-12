import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Register() {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        role: 'PATIENT',
        department: null,
        specialization: ''
    });
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.role === 'DOCTOR') {
            fetchDepartments();
        }
    }, [formData.role]);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments');
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'departmentId') {
            const dept = departments.find(d => String(d.id) === String(value));
            setFormData(prev => ({ ...prev, department: dept || null }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 className="text-center mb-4">Create Account</h2>
                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            className="form-control" 
                            required 
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="form-control" 
                            required 
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="form-control" 
                            required 
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select 
                            name="role" 
                            className="form-control"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="DOCTOR">Doctor</option>
                            {/* <option value="ADMIN">Admin</option> */}
                        </select>
                    </div>

                    {formData.role === 'DOCTOR' && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Specialization</label>
                                <input 
                                    type="text" 
                                    name="specialization"
                                    className="form-control" 
                                    required 
                                    value={formData.specialization}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select 
                                    name="departmentId" 
                                    className="form-control"
                                    value={formData.department?.id || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Department...</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <button 
                        type="submit" 
                        className="btn btn-primary mt-2" 
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                
                <div className="text-center mt-4" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
}
