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
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Traffic Police</h2>
            <div className="bg-white rounded shadow p-4">
                <h3 className="font-semibold mb-2">Nearby Alerts</h3>
                <ul className="list-disc pl-5">
                    {nearby.map((n, idx) => (
                        <li key={idx} className="mb-1">Ambulance {n.ambulanceId} ETA 1 min at {n.junction}</li>
                    ))}
                </ul>
                <button className="mt-2 bg-emerald-600 text-white rounded px-3 py-1" onClick={confirmCleared}>Confirm Cleared</button>
            </div>
        </div>
    );
}