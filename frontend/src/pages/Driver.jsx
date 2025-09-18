import { useEffect, useState } from "react";
import { useSocket } from "../components/SocketProvider.jsx";

export default function Driver() {
    const { socket } = useSocket();
    const [login, setLogin] = useState({ id: "", pass: "" });
    const [assigned, setAssigned] = useState(null);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        if (!socket) return;
        socket.on("ambulanceAssigned", (d) => setAssigned(d));
        return () => socket.off("ambulanceAssigned");
    }, [socket]);

    useEffect(() => {
        if (!socket || !accepted) return;
        const iv = setInterval(() => {
            socket.emit("locationUpdate", { ambulanceId: assigned?.ambulanceId, ts: Date.now() });
        }, 1000);
        return () => clearInterval(iv);
    }, [socket, accepted, assigned]);

    const accept = () => {
        if (!socket || !assigned) return;
        setAccepted(true);
        socket.emit("ambulanceAccepted", assigned);
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%)',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                background: 'var(--background-card)',
                boxShadow: 'var(--shadow-md)',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '64px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(135deg, var(--secondary-green) 0%, var(--secondary-green-light) 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>🚗</span>
                            </div>
                            <h1 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                margin: 0
                            }}>
                                Ambulance Driver
                            </h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className="status-online">Live System</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {/* Login Section */}
                    <div className="card">
                        <h2 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '1.5rem',
                            margin: 0
                        }}>
                            Driver Login
                        </h2>
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: 'var(--text-primary)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Driver ID
                                </label>
                                <input 
                                    className="form-input"
                                    placeholder="Enter your driver ID"
                                    value={login.id} 
                                    onChange={(e) => setLogin({ ...login, id: e.target.value })} 
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: 'var(--text-primary)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Password
                                </label>
                                <input 
                                    className="form-input"
                                    placeholder="Enter your password"
                                    type="password" 
                                    value={login.pass} 
                                    onChange={(e) => setLogin({ ...login, pass: e.target.value })} 
                                />
                            </div>
                            <button 
                                className="btn-primary"
                                style={{ width: '100%' }}
                                onClick={() => {
                                    // Mock login logic
                                    console.log('Login attempted:', login);
                                }}
                            >
                                🚗 Login to System
                            </button>
                        </div>
                    </div>

                    {/* Assignment Section */}
                    <div className="card">
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '1rem',
                            margin: 0
                        }}>
                            Emergency Assignment
                        </h3>
                        <div style={{ marginTop: '1rem' }}>
                            {assigned ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                        border: '1px solid #f59e0b',
                                        borderRadius: '8px',
                                        padding: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>🚨</span>
                                            <p style={{
                                                color: 'var(--accent-orange)',
                                                fontWeight: '600',
                                                margin: 0
                                            }}>
                                                New Emergency Assignment
                                            </p>
                                        </div>
                                        <p style={{
                                            color: 'var(--accent-orange)',
                                            fontSize: '0.875rem',
                                            margin: 0,
                                            opacity: 0.8
                                        }}>
                                            Please review and accept the assignment
                                        </p>
                                    </div>
                                    
                                    <div style={{
                                        background: 'var(--neutral-gray-50)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        padding: '1rem'
                                    }}>
                                        <h4 style={{
                                            fontWeight: '500',
                                            color: 'var(--text-primary)',
                                            marginBottom: '0.5rem',
                                            margin: 0
                                        }}>
                                            Assignment Details
                                        </h4>
                                        <pre style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-secondary)',
                                            margin: 0,
                                            overflow: 'auto'
                                        }}>
                                            {JSON.stringify(assigned, null, 2)}
                                        </pre>
                                    </div>
                                    
                                    <button 
                                        disabled={accepted}
                                        style={{
                                            width: '100%',
                                            background: accepted 
                                                ? 'var(--neutral-gray-300)' 
                                                : 'linear-gradient(135deg, var(--secondary-green) 0%, var(--secondary-green-light) 100%)',
                                            color: 'var(--white)',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '0.75rem 1rem',
                                            fontWeight: '600',
                                            cursor: accepted ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            opacity: accepted ? 0.6 : 1
                                        }}
                                        onClick={accept}
                                    >
                                        {accepted ? '✅ Assignment Accepted' : '🚑 Accept Assignment'}
                                    </button>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                                    <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No Assignment Yet</p>
                                    <p style={{ fontSize: '0.875rem' }}>Waiting for emergency dispatch...</p>
                                </div>
                            )}
                        </div>
                </div>
                </div>
            </div>
        </div>
    );
}