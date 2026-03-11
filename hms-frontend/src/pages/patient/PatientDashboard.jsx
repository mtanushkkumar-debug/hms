import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BookAppointment from './BookAppointment';
import ViewHistory from './ViewHistory';

export default function PatientDashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('book');

    const renderContent = () => {
        switch (activeTab) {
            case 'book': return <BookAppointment />;
            case 'history': return <ViewHistory />;
            default: return <BookAppointment />;
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ padding: '0 1rem 2rem' }}>
                    <h3>Welcome,</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 'bold' }}>{user.name}</p>
                </div>
                
                <nav style={{ flex: 1 }}>
                    <button 
                        className={`sidebar-link ${activeTab === 'book' ? 'active' : ''}`}
                        onClick={() => setActiveTab('book')}
                        style={{ width: '100%', textAlign: 'left', background: activeTab === 'book' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', border: 'none' }}
                    >
                        Book Appointment
                    </button>
                    <button 
                        className={`sidebar-link ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                        style={{ width: '100%', textAlign: 'left', background: activeTab === 'history' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', border: 'none' }}
                    >
                        My Appointments
                    </button>
                </nav>
                
                <div style={{ marginTop: 'auto' }}>
                    <button onClick={logout} className="btn" style={{ width: '100%', color: 'var(--danger-color)' }}>
                        Logout
                    </button>
                </div>
            </aside>
            
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
}
