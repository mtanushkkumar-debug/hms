import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SetAvailability from './SetAvailability';
import ViewAppointments from './ViewAppointments';

export default function DoctorDashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('appointments');

    const renderContent = () => {
        switch (activeTab) {
            case 'appointments': return <ViewAppointments />;
            case 'availability': return <SetAvailability />;
            default: return <ViewAppointments />;
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ padding: '0 1rem 2rem' }}>
                    <h3>Dr. {user.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.specialization}</p>
                </div>
                
                <nav style={{ flex: 1 }}>
                    <button 
                        className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                        style={{ width: '100%', textAlign: 'left', background: activeTab === 'appointments' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', border: 'none' }}
                    >
                        Schedule
                    </button>
                    <button 
                        className={`sidebar-link ${activeTab === 'availability' ? 'active' : ''}`}
                        onClick={() => setActiveTab('availability')}
                        style={{ width: '100%', textAlign: 'left', background: activeTab === 'availability' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', border: 'none' }}
                    >
                        Availability Slots
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
