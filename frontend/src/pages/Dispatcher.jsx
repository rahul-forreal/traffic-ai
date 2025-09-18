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
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-bold">Dispatcher</h2>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded shadow p-4 space-y-3">
                    <label className="block text-sm font-medium">Patient Location (junction ID)</label>
                    <input className="border rounded p-2 w-full" value={patientLocation} onChange={(e) => setPatientLocation(e.target.value)} />
                    <label className="block text-sm font-medium">Severity</label>
                    <select className="border rounded p-2 w-full" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                        <option>Mild</option>
                        <option>Moderate</option>
                        <option>Critical</option>
                    </select>
                    <label className="block text-sm font-medium">Mode</label>
                    <select className="border rounded p-2 w-full" value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="MNL">MNL</option>
                        <option value="VAC">VAC</option>
                    </select>
                    <button className="w-full bg-blue-600 text-white rounded py-2" onClick={searchAmbulances}>Find Nearest Ambulance</button>
                </div>
                <div className="bg-white rounded shadow p-4">
                    <h3 className="font-semibold mb-2">Candidates</h3>
                    <div className="space-y-2">
                        {candidates.map((c) => (
                            <div key={c.id} className="flex items-center justify-between border rounded p-2">
                                <div>
                                    <div className="font-medium">Ambulance {c.id}</div>
                                    <div className="text-sm text-gray-500">Driver {c.driver}</div>
                                </div>
                                <button className="bg-emerald-600 text-white rounded px-3 py-1" onClick={() => assign(c)}>Assign</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-white rounded shadow p-4">
                        <h3 className="font-semibold mb-2">Assigned</h3>
                        <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(assigned, null, 2)}</pre>
                    </div>
                    <SimpleChart data={chartData} />
                </div>
            </div>
        </div>
    );
}