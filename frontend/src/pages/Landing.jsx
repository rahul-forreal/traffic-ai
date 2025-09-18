import { useNavigate } from "react-router-dom";
import { useState } from "react";

const roles = [
    { 
        key: "dispatcher", 
        label: "Emergency Dispatcher", 
        description: "Coordinate ambulance dispatch and emergency response",
        icon: "🚑",
        color: "blue"
    },
    { 
        key: "driver", 
        label: "Ambulance Driver", 
        description: "Receive assignments and navigate to emergency locations",
        icon: "🚗",
        color: "green"
    },
    { 
        key: "traffic", 
        label: "Traffic Control Centre", 
        description: "Monitor and control traffic signals for emergency routes",
        icon: "🚦",
        color: "orange"
    },
    { 
        key: "police", 
        label: "Traffic Police", 
        description: "Coordinate traffic management during emergencies",
        icon: "👮",
        color: "purple"
    },
    { 
        key: "hospital", 
        label: "Hospital Operator", 
        description: "Manage hospital resources and patient admissions",
        icon: "🏥",
        color: "red"
    },
];

export default function Landing() {
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const go = () => {
        if (!role) return;
        navigate(`/${role}`);
    };

    const selectedRole = roles.find(r => r.key === role);

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, var(--neutral-gray-50) 0%, var(--white) 50%, var(--neutral-gray-100) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card" style={{ 
                width: '100%', 
                maxWidth: '500px',
                textAlign: 'center'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-light) 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <span style={{ fontSize: '2rem' }}>🚨</span>
                    </div>
                    <h1 className="text-heading" style={{ marginBottom: '0.5rem' }}>
                        Emergency Management System
                    </h1>
                    <p className="text-body" style={{ fontSize: '1rem' }}>
                        Professional Ambulance Dispatch & Traffic Control Platform
                    </p>
                </div>
                
                {/* Role Selection */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: 'var(--neutral-gray-700)',
                        marginBottom: '0.75rem',
                        textAlign: 'left'
                    }}>
                        Select Your Role
                    </label>
                    <select 
                        className="form-select"
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                    >
                        <option value="">-- Choose Your Role --</option>
                        {roles.map((r) => (
                            <option key={r.key} value={r.key}>
                                {r.icon} {r.label}
                            </option>
                        ))}
                    </select>
                    
                    {/* Role Description */}
                    {selectedRole && (
                        <div style={{
                            background: 'var(--neutral-gray-50)',
                            border: '1px solid var(--neutral-gray-200)',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            marginBottom: '1rem',
                            textAlign: 'left'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                marginBottom: '0.5rem' 
                            }}>
                                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                                    {selectedRole.icon}
                                </span>
                                <span style={{ 
                                    fontWeight: '600', 
                                    color: 'var(--neutral-gray-800)' 
                                }}>
                                    {selectedRole.label}
                                </span>
                            </div>
                            <p className="text-body" style={{ margin: 0 }}>
                                {selectedRole.description}
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Continue Button */}
                <button 
                    className={role ? "btn-primary" : "btn-secondary"}
                    onClick={go}
                    disabled={!role}
                    style={{ 
                        width: '100%',
                        opacity: role ? 1 : 0.6,
                        cursor: role ? 'pointer' : 'not-allowed'
                    }}
                >
                    {role ? '🚀 Access Dashboard' : 'Select a Role to Continue'}
                </button>
                
                {/* Footer */}
                <div style={{ 
                    marginTop: '2rem', 
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--neutral-gray-200)'
                }}>
                    <p className="text-body" style={{ fontSize: '0.75rem', margin: 0 }}>
                        Secure • Professional • Real-time Emergency Response System
                    </p>
                </div>
            </div>
        </div>
    );
}