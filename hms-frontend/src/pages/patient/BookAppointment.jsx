import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function BookAppointment() {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availabilities, setAvailabilities] = useState([]);
    
    const [appointmentData, setAppointmentData] = useState({
        date: '',
        startTime: '',
        endTime: ''
    });

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [docsRes, deptsRes] = await Promise.all([
                api.get('/users/doctors'),
                api.get('/departments')
            ]);
            setDoctors(docsRes.data);
            setFilteredDoctors(docsRes.data);
            setDepartments(deptsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDepartmentChange = (e) => {
        const deptId = e.target.value;
        setSelectedDepartment(deptId);
        if (deptId === '') {
            setFilteredDoctors(doctors);
        } else {
            setFilteredDoctors(doctors.filter(d => d.department?.id === parseInt(deptId)));
        }
        setSelectedDoctor(null);
        setAvailabilities([]);
    };

    const handleDoctorSelection = async (doctor) => {
        setSelectedDoctor(doctor);
        setError('');
        setSuccess('');
        try {
            const res = await api.get(`/availability/doctor/${doctor.id}/upcoming`);
            const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setAvailabilities(sorted);
        } catch (err) {
            console.error('Failed to fetch availability', err);
        }
    };

    const selectTimeSlot = (slot) => {
        setAppointmentData({
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime
        });
        setError('');
        setSuccess('');
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setBooking(true);

        try {
            await api.post('/appointments/book', {
                patient: { id: user.id },
                doctor: { id: selectedDoctor.id },
                appointmentDate: appointmentData.date,
                startTime: appointmentData.startTime,
                endTime: appointmentData.endTime
            });
            setSuccess('Appointment booked successfully!');
            setAppointmentData({ date: '', startTime: '', endTime: '' });
            setSelectedDoctor(null);
        } catch (err) {
            setError(err.response?.data || 'Failed to book appointment. There might be a conflict.');
        } finally {
            setBooking(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="mb-4">Book a New Appointment</h2>
            
            {error && <div className="card mb-4" style={{ background: '#FEE2E2', color: '#B91C1C', borderColor: '#FCA5A5' }}>{error}</div>}
            {success && <div className="card mb-4" style={{ background: '#D1FAE5', color: '#047857', borderColor: '#6EE7B7' }}>{success}</div>}
            
            <div className="card mb-4">
                <div className="form-group mb-0">
                    <label className="form-label">Filter by Department</label>
                    <select 
                        className="form-control"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {!selectedDoctor ? (
                <div className="grid grid-cols-3">
                    {filteredDoctors.map(doctor => (
                        <div key={doctor.id} className="card" style={{ cursor: 'pointer' }} onClick={() => handleDoctorSelection(doctor)}>
                            <h3 className="mb-2">Dr. {doctor.name}</h3>
                            <p className="mb-2 text-muted">{doctor.specialization}</p>
                            <p style={{ fontWeight: '500', color: 'var(--primary-color)' }}>
                                {doctor.department?.name || 'General'}
                            </p>
                            <button className="btn btn-primary mt-4" style={{ width: '100%' }}>
                                View Availabilities
                            </button>
                        </div>
                    ))}
                    {filteredDoctors.length === 0 && (
                        <p style={{ color: 'var(--text-muted)' }}>No doctors found in this department.</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2">
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Select Time Slot</h3>
                            <button onClick={() => setSelectedDoctor(null)} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                                Back to Doctors
                            </button>
                        </div>
                        
                        <p className="mb-4">Doctor: <strong>Dr. {selectedDoctor.name}</strong></p>
                        
                        {availabilities.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>This doctor hasn't set any upcoming availabilities yet.</p>
                        ) : (
                            <div className="grid grid-cols-1" style={{ gap: '0.75rem' }}>
                                {availabilities.map(slot => (
                                    <button 
                                        key={slot.id}
                                        onClick={() => selectTimeSlot(slot)}
                                        className={`btn ${appointmentData.date === slot.date && appointmentData.startTime === slot.startTime ? 'btn-primary' : ''}`}
                                        style={{ 
                                            background: appointmentData.date === slot.date && appointmentData.startTime === slot.startTime ? 'var(--primary-color)' : 'var(--bg-color)',
                                            color: appointmentData.date === slot.date && appointmentData.startTime === slot.startTime ? 'white' : 'var(--text-main)',
                                            border: `1px solid ${appointmentData.date === slot.date && appointmentData.startTime === slot.startTime ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                            justifyContent: 'space-between',
                                            padding: '1rem',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontWeight: '500' }}>
                                            {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span>
                                            {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="card">
                        <h3 className="mb-4">Confirm Booking</h3>
                        {appointmentData.date ? (
                            <form onSubmit={handleBooking}>
                                <div className="mb-4" style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                                    <p className="mb-2"><strong>Doctor:</strong> Dr. {selectedDoctor.name}</p>
                                    <p className="mb-2"><strong>Department:</strong> {selectedDoctor.department?.name}</p>
                                    <p className="mb-2"><strong>Date:</strong> {new Date(appointmentData.date).toLocaleDateString()}</p>
                                    <p className="mb-0"><strong>Time:</strong> {appointmentData.startTime.substring(0, 5)} - {appointmentData.endTime.substring(0, 5)}</p>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={booking}>
                                    {booking ? 'Booking...' : 'Confirm Appointment'}
                                </button>
                            </form>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                                Please select a time slot from the left to continue.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
