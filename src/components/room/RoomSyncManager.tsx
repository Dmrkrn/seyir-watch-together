"use client";

import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";

export function RoomSyncManager({ roomId }: { roomId: string }) {
    const { connectSocket, disconnectSocket } = usePlayerStore();

    useEffect(() => {
        // Connect to the separate Signaling Server process
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
        connectSocket(socketUrl, roomId);

        return () => {
            disconnectSocket();
        }
    }, [roomId, connectSocket, disconnectSocket]);

    return null; // This component is invisible
}
