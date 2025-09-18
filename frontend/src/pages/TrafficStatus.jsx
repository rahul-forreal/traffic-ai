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
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Junction Details</h2>
                <div className="text-sm text-gray-500">Mode: {data.mode} • Source: {data.source}</div>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <div className="grid md:grid-cols-3 gap-4">
                    {data.junctions.map((j) => (
                        <div key={j.id} className="bg-white rounded shadow p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">{j.id}</span>
                                <span className={`px-2 py-1 rounded text-xs text-white ${j.state?.includes('G') ? 'bg-green-500' : j.state?.includes('Y') ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}>
                                    {j.state?.includes('G') ? 'GREEN' : j.state?.includes('Y') ? 'YELLOW' : 'RED'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">Queue: {j.queue} vehicles</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}