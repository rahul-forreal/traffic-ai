import { useEffect, useState } from "react";
import { useSocket } from "../components/SocketProvider.jsx";
import SumoEmbed from "../components/SumoEmbed.jsx";

export default function TrafficCentre() {
    const { socket } = useSocket();
    const [mode, setMode] = useState("MNL");
    const [emergency, setEmergency] = useState(null);
    const [trafficStatus, setTrafficStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!socket) return;
        socket.on("ambulanceAccepted", (d) => setEmergency(d));
        return () => socket.off("ambulanceAccepted");
    }, [socket]);

    // Fetch traffic status every 2 seconds
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5001/status');
                const data = await response.json();
                setTrafficStatus(data);
                setMode(data.mode || "MNL");
            } catch (error) {
                console.error('Failed to fetch traffic status:', error);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    const toggleMode = async () => {
        const next = mode === "MNL" ? "VAC" : "MNL";
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5001/signal_control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: next })
            });
            const result = await response.json();
            console.log('Mode change result:', result);
            if (result.ok) {
                setMode(result.mode || next);
                socket?.emit("signalModeChange", { mode: result.mode || next });
            } else {
                console.error('Mode change failed:', result.error);
            }
        } catch (error) {
            console.error('Failed to change mode:', error);
        }
        setLoading(false);
    };

    const forceOverride = async (junction, action) => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:5001/signal_control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    override: {
                        junction: junction,
                        action: action,
                        duration: 15
                    }
                })
            });
            const result = await response.json();
            if (result.ok) {
                socket?.emit("override", { junction, action });
            }
        } catch (error) {
            console.error('Failed to override signal:', error);
        }
        setLoading(false);
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
                                <span style={{ fontSize: '1.5rem' }}>🚦</span>
                            </div>
                            <h1 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                margin: 0
                            }}>
                                Traffic Control Centre
                            </h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1,
                                    transition: 'all 0.2s ease-in-out',
                                    background: mode === "MNL" 
                                        ? 'linear-gradient(135deg, var(--secondary-green) 0%, var(--secondary-green-light) 100%)'
                                        : 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%)',
                                    color: 'var(--white)',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                                onClick={toggleMode}
                                disabled={loading}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = 'var(--shadow-lg)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'var(--shadow-sm)';
                                    }
                                }}
                            >
                                {loading ? "Switching..." : `Mode: ${mode}`}
                            </button>
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
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Traffic Signal Status */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div className="card">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '1.5rem'
                            }}>
                                <h2 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    margin: 0
                                }}>
                                    Traffic Signal Status
                                </h2>
                                <a 
                                    style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--primary-blue)',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        background: 'var(--neutral-gray-50)',
                                        border: '1px solid var(--border-light)',
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                    href="/traffic-status" 
                                    target="_blank" 
                                    rel="noreferrer"
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'var(--primary-blue)';
                                        e.target.style.color = 'var(--white)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'var(--neutral-gray-50)';
                                        e.target.style.color = 'var(--primary-blue)';
                                    }}
                                >
                                    View Full Details →
                                </a>
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)',
                                border: '1px solid #93c5fd',
                                borderRadius: '8px',
                                padding: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>ℹ️</span>
                                    <p style={{
                                        color: 'var(--primary-blue)',
                                        fontWeight: '600',
                                        margin: 0
                                    }}>
                                        Quick preview only
                                    </p>
                                </div>
                                <p style={{
                                    color: 'var(--primary-blue)',
                                    fontSize: '0.875rem',
                                    margin: 0,
                                    opacity: 0.8
                                }}>
                                    Click the link above to view all junctions with detailed information
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Status */}
                    <div className="card">
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '1rem',
                            margin: 0
                        }}>
                            Emergency Status
                        </h3>
                        <div style={{ marginTop: '1rem' }}>
                            {emergency ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                        border: '1px solid #fca5a5',
                                        borderRadius: '8px',
                                        padding: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: 'var(--accent-red)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '12px'
                                            }}>
                                                <span style={{ color: 'var(--white)', fontSize: '1rem' }}>⚠️</span>
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: 'var(--accent-red)'
                                                }}>
                                                    Active Emergency
                                                </div>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    color: 'var(--accent-red)',
                                                    opacity: 0.8
                                                }}>
                                                    Route optimization in progress
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        background: 'var(--neutral-gray-50)',
                                        borderRadius: '8px',
                                        padding: '0.75rem'
                                    }}>
                                        <h4 style={{
                                            fontWeight: '500',
                                            color: 'var(--text-primary)',
                                            marginBottom: '0.5rem',
                                            margin: 0
                                        }}>
                                            Emergency Route
                                        </h4>
                                        <pre style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-secondary)',
                                            margin: 0,
                                            overflow: 'auto'
                                        }}>
                                            {JSON.stringify(emergency, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                    <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No Active Emergency</p>
                                    <p style={{ fontSize: '0.875rem' }}>System is operating normally</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SUMO Integration */}
                <div className="card">
                    <SumoEmbed
                        rightPanel={
                            emergency ? (
                                <div>
                                    <h3 style={{
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        marginBottom: '1rem',
                                        margin: 0
                                    }}>
                                        Emergency Route Details
                                    </h3>
                                    <div style={{
                                        background: 'var(--neutral-gray-50)',
                                        borderRadius: '8px',
                                        padding: '1rem'
                                    }}>
                                        <pre style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            margin: 0,
                                            overflow: 'auto'
                                        }}>
                                            {JSON.stringify(emergency, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚦</div>
                                    <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No Active Emergency</p>
                                    <p style={{ fontSize: '0.875rem' }}>SUMO visual runs in its own app</p>
                                </div>
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
}