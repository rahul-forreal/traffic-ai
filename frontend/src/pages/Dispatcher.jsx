import { useEffect, useMemo, useState } from "react";
import { useSocket } from "../components/SocketProvider.jsx";
import SimpleChart from "../components/SimpleChart.jsx";

export default function Dispatcher() {
    const { socket } = useSocket();
    const [patientLocation, setPatientLocation] = useState("");
    const [severity, setSeverity] = useState("Moderate");
    const [mode, setMode] = useState("MNL");
    const [assigned, setAssigned] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (!socket) return;
        socket.on("ambulanceAccepted", (d) => setAssigned(d));
        return () => socket.off("ambulanceAccepted");
    }, [socket]);

    const sampleData = useMemo(
        () => [
            { trip: "T1", mnl: 9, vac: 7 },
            { trip: "T2", mnl: 12, vac: 8 },
            { trip: "T3", mnl: 10, vac: 7 },
        ],
        []
    );

    useEffect(() => setChartData(sampleData), [sampleData]);

    const searchAmbulances = () => {
        // Mock list
        setCandidates([
            { id: "A1", driver: "d1" },
            { id: "A2", driver: "d2" },
            { id: "A3", driver: "d3" },
        ]);
    };

    const assign = async (amb) => {
        const payload = { ambulanceId: amb.id, driver: amb.driver, patientLocation, severity, mode };
        try {
            await fetch("http://localhost:4000/api/emergency/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            setAssigned({ ambulanceId: amb.id, driver: amb.driver });
            // fetch comparison data for chart
            const r = await fetch("http://localhost:4000/api/emergency/compare", { method: "POST" });
            const j = await r.json();
            if (j?.trips) setChartData(j.trips);
        } catch (e) {
            // fallback to socket only if backend call fails
            socket?.emit("ambulanceAssigned", payload);
            setAssigned({ ambulanceId: amb.id, driver: amb.driver });
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--neutral-gray-50)',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                background: 'var(--white)',
                boxShadow: 'var(--shadow-sm)',
                borderBottom: '1px solid var(--neutral-gray-200)'
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
                                background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>🚑</span>
                            </div>
                            <h1 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--neutral-gray-900)',
                                margin: 0
                            }}>
                                Emergency Dispatcher
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
                    {/* Emergency Details Form */}
                    <div className="card">
                        <h2 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--neutral-gray-900)',
                            marginBottom: '1.5rem',
                            margin: 0
                        }}>
                            Emergency Details
                        </h2>
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: 'var(--neutral-gray-700)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Patient Location (Junction ID)
                                </label>
                                <input 
                                    className="form-input"
                                    placeholder="e.g., J1, J2, J3..."
                                    value={patientLocation} 
                                    onChange={(e) => setPatientLocation(e.target.value)} 
                                />
                            </div>
                            
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: 'var(--neutral-gray-700)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Severity Level
                                </label>
                                <select 
                                    className="form-select"
                                    value={severity} 
                                    onChange={(e) => setSeverity(e.target.value)}
                                >
                                    <option value="Mild">🟢 Mild</option>
                                    <option value="Moderate">🟡 Moderate</option>
                                    <option value="Critical">🔴 Critical</option>
                                </select>
                            </div>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: 'var(--neutral-gray-700)',
                                    marginBottom: '0.5rem'
                                }}>
                                    Traffic Mode
                                </label>
                                <select 
                                    className="form-select"
                                    value={mode} 
                                    onChange={(e) => setMode(e.target.value)}
                                >
                                    <option value="MNL">Manual (MNL)</option>
                                    <option value="VAC">Adaptive (VAC)</option>
                                </select>
                            </div>
                            
                            <button 
                                className="btn-primary"
                                onClick={searchAmbulances}
                                style={{ width: '100%' }}
                            >
                                🔍 Find Nearest Ambulance
                            </button>
                        </div>
                    </div>

                    {/* Available Ambulances */}
                    <div className="card">
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--neutral-gray-900)',
                            marginBottom: '1rem',
                            margin: 0
                        }}>
                            Available Ambulances
                        </h3>
                        <div style={{ marginTop: '1rem' }}>
                            {candidates.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: 'var(--neutral-gray-500)'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚑</div>
                                    <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No ambulances found</p>
                                    <p style={{ fontSize: '0.875rem' }}>Enter location and click "Find Nearest Ambulance"</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {candidates.map((c) => (
                                        <div key={c.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            border: '1px solid var(--neutral-gray-200)',
                                            borderRadius: '8px',
                                            padding: '1rem',
                                            background: 'var(--white)',
                                            transition: 'all 0.2s ease-in-out'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: 'var(--neutral-gray-100)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '12px'
                                                }}>
                                                    <span style={{ fontSize: '1.25rem' }}>🚑</span>
                                                </div>
                                                <div>
                                                    <div style={{
                                                        fontWeight: '500',
                                                        color: 'var(--neutral-gray-900)'
                                                    }}>
                                                        Ambulance {c.id}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.875rem',
                                                        color: 'var(--neutral-gray-500)'
                                                    }}>
                                                        Driver: {c.driver}
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                style={{
                                                    background: 'var(--secondary-green)',
                                                    color: 'var(--white)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '0.5rem 1rem',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease-in-out'
                                                }}
                                                onClick={() => assign(c)}
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Assignment Status & Analytics */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card">
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                color: 'var(--neutral-gray-900)',
                                marginBottom: '1rem',
                                margin: 0
                            }}>
                                Assignment Status
                            </h3>
                            <div style={{ marginTop: '1rem' }}>
                                {assigned ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{
                                            background: 'var(--neutral-gray-50)',
                                            border: '1px solid var(--secondary-green)',
                                            borderRadius: '8px',
                                            padding: '1rem'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: 'var(--secondary-green)',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '12px'
                                                }}>
                                                    <span style={{ color: 'var(--white)', fontSize: '1rem' }}>✓</span>
                                                </div>
                                                <div>
                                                    <div style={{
                                                        fontWeight: '500',
                                                        color: 'var(--secondary-green)'
                                                    }}>
                                                        Assignment Confirmed
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.875rem',
                                                        color: 'var(--secondary-green)'
                                                    }}>
                                                        Ambulance {assigned.ambulanceId} assigned
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'var(--neutral-gray-50)',
                                            borderRadius: '8px',
                                            padding: '0.75rem'
                                        }}>
                                            <pre style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--neutral-gray-600)',
                                                margin: 0,
                                                overflow: 'auto'
                                            }}>
                                                {JSON.stringify(assigned, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '2rem',
                                        color: 'var(--neutral-gray-500)'
                                    }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏰</div>
                                        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>No assignment yet</p>
                                        <p style={{ fontSize: '0.875rem' }}>Assign an ambulance to see status</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <SimpleChart data={chartData} />
                    </div>
                </div>
            </div>
        </div>
    );
}