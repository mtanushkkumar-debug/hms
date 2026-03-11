import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function ViewAppointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) fetchAppointments();
    }, [user?.id]);

    const fetchAppointments = async () => {
        try {
            const res = await api.get(`/appointments/doctor/${user.id}`);
            // Sort by date, newest first
            const sorted = res.data.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
            setAppointments(sorted);
        } catch (err) {
            console.error('Failed to fetch appointments', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/appointments/${id}/status?status=${newStatus}`);
            fetchAppointments();
        } catch (err) {
            console.error(`Failed to update status to ${newStatus}`, err);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'CONFIRMED': return 'var(--primary-color)';
            case 'COMPLETED': return 'var(--success-color)';
            case 'CANCELLED': return 'var(--danger-color)';
            default: return 'var(--warning-color)';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="mb-4">My Appointments</h2>
            
            <div className="card">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem' }}>Patient Name</th>
                                <th style={{ padding: '0.75rem' }}>Date</th>
                                <th style={{ padding: '0.75rem' }}>Time</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{app.patient.name}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {new Date(app.appointmentDate).toLocaleDateString(undefined, { 
                                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
                                        })}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {app.startTime.substring(0, 5)} - {app.endTime.substring(0, 5)}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <span style={{ 
                                            background: `rgba(${getStatusColor(app.status) === 'var(--success-color)' ? '16, 185, 129' : 
                                                            getStatusColor(app.status) === 'var(--primary-color)' ? '79, 70, 229' :
                                                            getStatusColor(app.status) === 'var(--danger-color)' ? '239, 68, 68' : '245, 158, 11'}, 0.1)`, 
                                            color: getStatusColor(app.status),
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        {app.status === 'BOOKED' && (
                                            <button 
                                                onClick={() => updateStatus(app.id, 'CONFIRMED')}
                                                className="btn"
                                                style={{ background: 'var(--primary-color)', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.875rem', marginRight: '0.5rem' }}
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {app.status === 'CONFIRMED' && (
                                            <button 
                                                onClick={() => updateStatus(app.id, 'COMPLETED')}
                                                className="btn"
                                                style={{ background: 'var(--success-color)', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                        {(app.status === 'BOOKED' || app.status === 'CONFIRMED') && (
                                            <button 
                                                onClick={() => updateStatus(app.id, 'CANCELLED')}
                                                className="btn"
                                                style={{ background: 'transparent', color: 'var(--danger-color)', padding: '0.25rem 0.5rem', fontSize: '0.875rem', border: '1px solid var(--danger-color)', marginLeft: app.status === 'BOOKED' ? 0 : '0.5rem' }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No appointments scheduled yet.
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
