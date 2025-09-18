import { useEffect, useState } from "react";
import { useSocket } from "../components/SocketProvider.jsx";

export default function Police() {
    const { socket } = useSocket();
    const [nearby, setNearby] = useState([]);

    useEffect(() => {
        if (!socket) return;
        socket.on("locationUpdate", (d) => {
            // naive filter for demo
            setNearby((prev) => [{ junction: "J4", eta: 60, ambulanceId: d.ambulanceId, ts: d.ts }, ...prev].slice(0, 5));
        });
        return () => socket.off("locationUpdate");
    }, [socket]);

    const confirmCleared = () => socket?.emit("notification", "Police: Road cleared at J4");

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
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>👮</span>
                            </div>
                            <h1 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                margin: 0
                            }}>
                                Traffic Police
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
                    {/* Nearby Alerts */}
                    <div className="card">
                        <h2 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '1.5rem',
                            margin: 0
                        }}>
                            Nearby Emergency Alerts
                        </h2>
                        <div style={{ marginTop: '1.5rem' }}>
                            {nearby.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚦</div>
                                    <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No Active Alerts</p>
                                    <p style={{ fontSize: '0.875rem' }}>All clear in your area</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {nearby.map((n, idx) => (
                                        <div key={idx} style={{
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
                                                    Emergency Vehicle Approaching
                                                </p>
                                            </div>
                                            <div style={{
                                                color: 'var(--accent-orange)',
                                                fontSize: '0.875rem',
                                                margin: 0
                                            }}>
                                                Ambulance {n.ambulanceId} • ETA 1 min at {n.junction}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <button 
                                className="btn-primary"
                                onClick={confirmCleared}
                                style={{ 
                                    width: '100%',
                                    marginTop: '1rem'
                                }}
                            >
                                ✅ Confirm Road Cleared
                            </button>
                        </div>
                    </div>

                    {/* Traffic Management */}
                    <div className="card">
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '1rem',
                            margin: 0
                        }}>
                            Traffic Management
                        </h3>
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                gap: '0.75rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    background: 'var(--neutral-gray-50)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚦</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>Signals</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active: 6</div>
                                </div>
                                <div style={{
                                    background: 'var(--neutral-gray-50)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚧</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>Roadblocks</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active: 2</div>
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
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Transit: 3</div>
                                </div>
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
                                    Quick Actions
                                </h4>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button style={{
                                        background: 'var(--primary-blue)',
                                        color: 'var(--white)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}>
                                        Clear Junction
                                    </button>
                                    <button style={{
                                        background: 'var(--secondary-green)',
                                        color: 'var(--white)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}>
                                        Open Route
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}