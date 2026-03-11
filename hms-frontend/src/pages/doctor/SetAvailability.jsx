import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function SetAvailability() {
    const { user } = useAuth();
    const [availabilities, setAvailabilities] = useState([]);
    const [formData, setFormData] = useState({ date: '', startTime: '', endTime: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) fetchAvailabilities();
    }, [user?.id]);

    const fetchAvailabilities = async () => {
        try {
            const res = await api.get(`/availability/doctor/${user.id}/upcoming`);
            setAvailabilities(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/availability', {
                doctor: { id: user.id },
                ...formData
            });
            setFormData({ date: '', startTime: '', endTime: '' });
            fetchAvailabilities();
        } catch (err) {
            console.error(err);
            alert('Failed to set availability.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this slot?')) return;
        try {
            await api.delete(`/availability/${id}`);
            fetchAvailabilities();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    const today = new Date().toISOString().split('T')[0];

    return (
        <div>
            <h2 className="mb-4">Manage Availability</h2>
            
            <div className="card mb-4">
                <h3 className="mb-4">Add Time Slot</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-4">
                    <div className="form-group">
                        <label className="form-label">Date</label>
                        <input 
                            type="date" 
                            min={today}
                            className="form-control"
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Start Time</label>
                        <input 
                            type="time" 
                            className="form-control"
                            value={formData.startTime}
                            onChange={e => setFormData({...formData, startTime: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Time</label>
                        <input 
                            type="time" 
                            className="form-control"
                            value={formData.endTime}
                            onChange={e => setFormData({...formData, endTime: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Slot</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <h3 className="mb-4">Upcoming Schedule</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem' }}>Date</th>
                                <th style={{ padding: '0.75rem' }}>Time Slot</th>
                                <th style={{ padding: '0.75rem', width: '100px', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availabilities.map(slot => (
                                <tr key={slot.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>
                                        {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{ 
                                            background: 'rgba(79, 70, 229, 0.1)', 
                                            color: 'var(--primary-color)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.875rem'
                                        }}>
                                            {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => handleDelete(slot.id)}
                                            style={{ color: 'var(--danger-color)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {availabilities.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No upcoming availability slots defined.
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
