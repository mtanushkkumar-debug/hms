import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManageDepartments() {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ name: '', consultationFee: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments');
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/departments', {
                ...formData,
                consultationFee: parseFloat(formData.consultationFee)
            });
            setFormData({ name: '', consultationFee: '' });
            fetchDepartments();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="mb-4">Manage Departments</h2>
            
            <div className="grid grid-cols-2">
                <div className="card">
                    <h3 className="mb-4">Add Department</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input 
                                type="text" 
                                className="form-control"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group mb-4">
                            <label className="form-label">Consultation Fee ($)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                min="0"
                                className="form-control"
                                value={formData.consultationFee}
                                onChange={e => setFormData({...formData, consultationFee: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Department</button>
                    </form>
                </div>

                <div className="card">
                    <h3 className="mb-4">Department List</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.75rem' }}>Name</th>
                                    <th style={{ padding: '0.75rem' }}>Fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map(dept => (
                                    <tr key={dept.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem' }}>{dept.name}</td>
                                        <td style={{ padding: '0.75rem' }}>${dept.consultationFee.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {departments.length === 0 && (
                                    <tr>
                                        <td colSpan="2" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No departments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
