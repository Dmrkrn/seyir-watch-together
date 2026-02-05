"use client";

import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";

export function RoomSyncManager({ roomId }: { roomId: string }) {
    const { connectSocket, disconnectSocket } = usePlayerStore();

    useEffect(() => {
        // Connect to the separate Signaling Server process
        const envUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
        console.log("DEBUG: Env Var NEXT_PUBLIC_SOCKET_URL:", envUrl);

        const socketUrl = envUrl || "http://localhost:4000";
        console.log("DEBUG: Resolved socketUrl:", socketUrl);

        connectSocket(socketUrl, roomId);

        return () => {
            disconnectSocket();
        }
    }, [roomId, connectSocket, disconnectSocket]);

    return null; // This component is invisible
}
