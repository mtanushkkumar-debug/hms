import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ManageDepartments from './ManageDepartments';
import ManageDoctors from './ManageDoctors';
import ViewReports from './ViewReports';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('departments');

    const renderContent = () => {
        switch (activeTab) {
            case 'departments': return <ManageDepartments />;
            case 'doctors': return <ManageDoctors />;
            case 'reports': return <ViewReports />;
            default: return <ManageDepartments />;
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div style={{ padding: '0 1rem 2rem' }}>
                    <h3>HMS Admin</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.name}</p>
                </div>
                
                <nav style={{ flex: 1 }}>
                    <button 
                        className={`sidebar-link ${activeTab === 'departments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('departments')}
                        style={{ width: '100%', textAlign: 'left', background: activeTab === 'departments' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', border: 'none' }}
                    >
                        Departments
                    </button>
                    <button 
                        className={`sidebar-link ${activeTab === 'doctors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('doctors')}
                        style={{ width: '100%', textAlign: 'left', background: activeTab === 'doctors' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', border: 'none' }}
                    >
                        Doctors
                    </button>
                    <button 
                        className={`sidebar-link ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                        style={{ width: '100%', textAlign: 'left', background: activeTab === 'reports' ? 'rgba(79, 70, 229, 0.1)' : 'transparent', border: 'none' }}
                    >
                        Reports
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
