import { useState, useEffect } from 'react';
import api from '../../api';

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/users/doctors');
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Manage Doctors</h2>
                <a href="/register" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    Add New Doctor
                </a>
            </div>
            
            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem' }}>Name</th>
                                <th style={{ padding: '0.75rem' }}>Email</th>
                                <th style={{ padding: '0.75rem' }}>Specialization</th>
                                <th style={{ padding: '0.75rem' }}>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doctor => (
                                <tr key={doctor.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{doctor.name}</td>
                                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{doctor.email}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{ 
                                            background: 'rgba(79, 70, 229, 0.1)', 
                                            color: 'var(--primary-color)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.875rem'
                                        }}>
                                            {doctor.specialization}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>{doctor.department?.name || 'N/A'}</td>
                                </tr>
                            ))}
                            {doctors.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No doctors found in the system.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
