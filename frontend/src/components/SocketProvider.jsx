import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const value = useMemo(() => ({ socket }), [socket]);

    useEffect(() => {
        const s = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000", {
            transports: ["websocket"],
        });
        setSocket(s);

        const notify = (msg) => toast.info(msg);
        s.on("connect", () => notify("Connected to realtime server"));
        s.on("disconnect", () => toast.warn("Disconnected from realtime server"));

        const events = [
            "ambulanceAssigned",
            "ambulanceRequest",
            "ambulanceAccepted",
            "locationUpdate",
            "signalModeChange",
            "override",
            "emergencyCompleted",
            "notification",
        ];
        events.forEach((evt) =>
            s.on(evt, (data) => {
                if (typeof data === "string") notify(${ evt }: ${ data });
            })
        );

        return () => {
            events.forEach((evt) => s.off(evt));
            s.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
