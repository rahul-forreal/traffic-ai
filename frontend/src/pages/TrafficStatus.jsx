import { useEffect, useState } from "react";

export default function TrafficStatus() {
    const [data, setData] = useState({ mode: 'MNL', junctions: [], source: 'UNKNOWN' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let t;
        const load = async () => {
            try {
                const res = await fetch('http://127.0.0.1:5001/status');
                const json = await res.json();
                setData(json);
                setError('');
            } catch (e) {
                setError('Unable to load status from controller');
            }
            setLoading(false);
        };
        load();
        t = setInterval(load, 2000);
        return () => clearInterval(t);
    }, []);

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
                                Traffic Junction Details
                            </h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)',
                                background: 'var(--neutral-gray-50)',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-light)'
                            }}>
                                Mode: {data.mode} • Source: {data.source}
                            </div>
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
                {loading ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                        <p style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Loading junction data...</p>
                    </div>
                ) : error ? (
                    <div className="card" style={{ 
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        border: '1px solid #fca5a5',
                        textAlign: 'center',
                        padding: '3rem'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <p style={{ fontWeight: '500', color: 'var(--accent-red)' }}>{error}</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem'
                    }}>
                        {data.junctions.map((j) => (
                            <div key={j.id} className="card" style={{ position: 'relative' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '1rem'
                                }}>
                                    <span style={{
                                        fontWeight: '600',
                                        fontSize: '1.125rem',
                                        color: 'var(--text-primary)'
                                    }}>
                                        {j.id}
                                    </span>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: 'var(--white)',
                                        background: j.state?.includes('G') 
                                            ? 'var(--secondary-green)' 
                                            : j.state?.includes('Y') 
                                                ? 'var(--accent-orange)' 
                                                : 'var(--accent-red)'
                                    }}>
                                        {j.state?.includes('G') ? 'GREEN' : j.state?.includes('Y') ? 'YELLOW' : 'RED'}
                                    </span>
                                </div>
                                
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.75rem'
                                }}>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)',
                                        fontWeight: '500'
                                    }}>
                                        Queue Length
                                    </span>
                                    <span style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '700',
                                        color: 'var(--text-primary)'
                                    }}>
                                        {j.queue}
                                    </span>
                                </div>
                                
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    textAlign: 'center',
                                    marginTop: '0.5rem'
                                }}>
                                    vehicles waiting
                                </div>
                                
                                {/* Status indicator */}
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: j.state?.includes('G') 
                                        ? 'var(--secondary-green)' 
                                        : j.state?.includes('Y') 
                                            ? 'var(--accent-orange)' 
                                            : 'var(--accent-red)',
                                    animation: 'pulse 2s infinite'
                                }}></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}