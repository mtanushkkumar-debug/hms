import { useState, useEffect } from 'react';
import api from '../../api';

export default function ViewReports() {
    const [appointmentsPerDoctor, setAppointmentsPerDoctor] = useState({});
    const [revenuePerDepartment, setRevenuePerDepartment] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const [appointmentsRes, revenueRes] = await Promise.all([
                api.get('/admin/reports/appointments-per-doctor'),
                api.get('/admin/reports/revenue-per-department')
            ]);
            setAppointmentsPerDoctor(appointmentsRes.data);
            setRevenuePerDepartment(revenueRes.data);
        } catch (err) {
            console.error('Failed to fetch reports', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading reports...</div>;

    const totalRevenue = Object.values(revenuePerDepartment).reduce((a, b) => a + b, 0);

    return (
        <div>
            <h2 className="mb-4">System Reports</h2>
            
            <div className="grid grid-cols-2 mb-4">
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', color: 'white' }}>
                    <h3 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '0.5rem' }}>Total Revenue</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                        ${totalRevenue.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2">
                <div className="card">
                    <h3 className="mb-4">Revenue Per Department</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.75rem' }}>Department</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(revenuePerDepartment).map(([dept, revenue]) => (
                                    <tr key={dept} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: '500' }}>{dept}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--success-color)', fontWeight: 'bold' }}>
                                            ${revenue.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {Object.keys(revenuePerDepartment).length === 0 && (
                                    <tr>
                                        <td colSpan="2" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No completed appointments yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h3 className="mb-4">Appointments Per Doctor</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.75rem' }}>Doctor</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Total Appointments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(appointmentsPerDoctor).map(([doctor, count]) => (
                                    <tr key={doctor} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem', fontWeight: '500' }}>{doctor}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                            <span style={{ 
                                                background: 'rgba(79, 70, 229, 0.1)', 
                                                color: 'var(--primary-color)',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '1rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {count}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {Object.keys(appointmentsPerDoctor).length === 0 && (
                                    <tr>
                                        <td colSpan="2" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No appointments found.
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
