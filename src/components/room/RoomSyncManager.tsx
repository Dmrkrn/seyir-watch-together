"use client";

import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";

export function RoomSyncManager({ roomId }: { roomId: string }) {
    const { connectSocket, disconnectSocket } = usePlayerStore();

    useEffect(() => {
        // Connect to the separate Signaling Server process
        connectSocket("http://localhost:4000", roomId);

        return () => {
            disconnectSocket();
        }
    }, [roomId, connectSocket, disconnectSocket]);

    return null; // This component is invisible
}
