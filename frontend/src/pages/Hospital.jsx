import { useEffect, useState } from "react";
import { useSocket } from "../components/SocketProvider.jsx";

export default function Hospital() {
    const { socket } = useSocket();
    const [eta, setEta] = useState(null);
    const [ack, setAck] = useState("Notified: No");

    useEffect(() => {
        if (!socket) return;
        socket.on("locationUpdate", () => setEta(Math.max(1, Math.floor(Math.random() * 10))));
        return () => socket.off("locationUpdate");
    }, [socket]);

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
                                background: 'linear-gradient(135deg, var(--accent-red) 0%, #ef4444 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>🏥</span>
                            </div>
                            <h1 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                margin: 0
                            }}>
                                Hospital Operator
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
                    {/* Emergency Status Card */}
                    <div className="card">
                        <h2 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '1.5rem',
                            margin: 0
                        }}>
                            Emergency Status
                        </h2>
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                                border: '1px solid #f59e0b',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>⏱️</span>
                                    <p style={{
                                        color: 'var(--accent-orange)',
                                        fontWeight: '600',
                                        margin: 0
                                    }}>
                                        Live ETA: {eta ? `${eta} min` : "--"}
                                    </p>
                                </div>
                                <p style={{
                                    color: 'var(--accent-orange)',
                                    fontSize: '0.875rem',
                                    margin: 0,
                                    opacity: 0.8
                                }}>
                                    Estimated time of arrival for emergency vehicle
                                </p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                <button 
                                    className="btn-primary"
                                    onClick={() => setAck("Prepared")}
                                    style={{ flex: 1 }}
                                >
                                    ✅ Prepared
                                </button>
                                <button 
                                    style={{
                                        flex: 1,
                                        background: 'var(--neutral-gray-100)',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--border-medium)',
                                        borderRadius: '6px',
                                        padding: '0.75rem 1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                    onClick={() => setAck("Notified")}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'var(--neutral-gray-200)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'var(--neutral-gray-100)';
                                    }}
                                >
                                    📢 Notified
                                </button>
                            </div>
                            
                            <div style={{
                                background: 'var(--neutral-gray-50)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '8px',
                                padding: '1rem'
                            }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    margin: 0,
                                    fontWeight: '500'
                                }}>
                                    Status: {ack}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hospital Resources */}
                    <div className="card">
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '1rem',
                            margin: 0
                        }}>
                            Hospital Resources
                        </h3>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                gap: '0.75rem'
                            }}>
                                <div style={{
                                    background: 'var(--neutral-gray-50)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛏️</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>Beds</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available: 12</div>
                                </div>
                                <div style={{
                                    background: 'var(--neutral-gray-50)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👨‍⚕️</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>Doctors</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On Duty: 8</div>
                                </div>
                                <div style={{
                                    background: 'var(--neutral-gray-50)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚑</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>Ambulances</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Incoming: 2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}