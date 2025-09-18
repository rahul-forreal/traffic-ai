import { useEffect, useState } from 'react';

export default function SumoEmbed({ rightPanel = null }) {
    return (
        <div className="w-full h-[70vh] grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded shadow p-2 flex flex-col">
                <div className="text-xs text-gray-500 mb-1">SUMO Live View disabled (running separately)</div>
                <div className="flex-1 border rounded overflow-hidden bg-gray-50 flex items-center justify-center text-gray-500">
                    SUMO visual runs in its own app. Control logic is handled here.
                </div>
            </div>
            <div className="bg-white rounded shadow p-4">
                {rightPanel || <div className="text-gray-600">No emergency selected.</div>}
            </div>
        </div>
    );
}