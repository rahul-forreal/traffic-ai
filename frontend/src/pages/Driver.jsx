import { useEffect, useState } from "react";
import { useSocket } from "../components/SocketProvider.jsx";

export default function Driver() {
    const { socket } = useSocket();
    const [login, setLogin] = useState({ id: "", pass: "" });
    const [assigned, setAssigned] = useState(null);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        if (!socket) return;
        socket.on("ambulanceAssigned", (d) => setAssigned(d));
        return () => socket.off("ambulanceAssigned");
    }, [socket]);

    useEffect(() => {
        if (!socket || !accepted) return;
        const iv = setInterval(() => {
            socket.emit("locationUpdate", { ambulanceId: assigned?.ambulanceId, ts: Date.now() });
        }, 1000);
        return () => clearInterval(iv);
    }, [socket, accepted, assigned]);

    const accept = () => {
        if (!socket || !assigned) return;
        setAccepted(true);
        socket.emit("ambulanceAccepted", assigned);
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Driver</h2>
            <div className="bg-white rounded shadow p-4 grid md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-2">Login</h3>
                    <input className="border rounded p-2 w-full mb-2" placeholder="Driver ID" value={login.id} onChange={(e) => setLogin({ ...login, id: e.target.value })} />
                    <input className="border rounded p-2 w-full" placeholder="Password" type="password" value={login.pass} onChange={(e) => setLogin({ ...login, pass: e.target.value })} />
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Assignment</h3>
                    <pre className="text-sm bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(assigned, null, 2)}</pre>
                    <button disabled={!assigned || accepted} className="mt-2 bg-emerald-600 disabled:bg-gray-300 text-white rounded px-3 py-1" onClick={accept}>Accept</button>
                </div>
            </div>
        </div>
    );
}