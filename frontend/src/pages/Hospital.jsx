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
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Hospital Operator</h2>
            <div className="bg-white rounded shadow p-4">
                <p className="mb-2">Live ETA: {eta ? ${eta} min : "--"}</p>
                <div className="flex gap-2">
                    <button className="bg-blue-600 text-white rounded px-3 py-1" onClick={() => setAck("Prepared")}>Prepared</button>
                    <button className="bg-gray-300 rounded px-3 py-1" onClick={() => setAck("Notified")}>Notified</button>
                </div>
                <p className="mt-2 text-sm text-gray-600">Status: {ack}</p>
            </div>
        </div>
    );
}