import { useNavigate } from "react-router-dom";
import { useState } from "react";

const roles = [
    { key: "dispatcher", label: "Dispatcher" },
    { key: "driver", label: "Driver" },
    { key: "traffic", label: "Traffic Control Centre" },
    { key: "police", label: "Traffic Police" },
    { key: "hospital", label: "Hospital Operator" },
];

export default function Landing() {
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    const go = () => {
        if (!role) return;
        navigate(/${role});
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Emergency Ambulance Dispatch & Traffic Management</h1>
                <label className="block mb-2 font-medium">Select User Role</label>
                <select className="w-full border rounded p-2 mb-4" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">-- Choose Role --</option>
                    {roles.map((r) => (
                        <option key={r.key} value={r.key}>
                            {r.label}
                        </option>
                    ))}
                </select>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded" onClick={go}>
                    Continue
                </button>
            </div>
        </div>
    );
}