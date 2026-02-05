"use client";

import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    ControlBar,
    DisconnectButton,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { Loader2, Video, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveKitComponentProps {
    room: string;
    username: string;
}

export default function LiveKitComponent({ room, username }: LiveKitComponentProps) {
    const [token, setToken] = useState("");
    const [shouldConnect, setShouldConnect] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch(
                    `/api/livekit/token?room=${room}&username=${username}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [room, username]);

    if (token === "") {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-secondary/10 rounded-lg m-2">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-xs">Preparing Token...</p>
            </div>
        );
    }

    // Audio Context Fix: Require user interaction to start
    if (!shouldConnect) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 bg-secondary/10 rounded-lg p-4 text-center">
                <p className="text-sm font-medium">Ready to join?</p>
                <Button
                    onClick={() => setShouldConnect(true)}
                    size="sm"
                    className="gap-2"
                >
                    <Video className="h-4 w-4" />
                    Join Verification
                </Button>
            </div>
        )
    }

    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            data-lk-theme="default"
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            {/* The standard VideoConference handles layout automatically */}
            <div className="flex-1 relative overflow-hidden bg-black/80 rounded-lg border border-white/10 mx-2 mt-2">
                <VideoConference />
            </div>

            <RoomAudioRenderer />

            {/* Minimal Controls */}
            <div className="p-2">
                <ControlBar variation="minimal" controls={{ microphone: true, camera: true, chat: false, screenShare: false, leave: false }} />
            </div>
        </LiveKitRoom>
    );
}
