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
import { Button, buttonVariants } from "@/components/ui/button";

interface LiveKitComponentProps {
    room: string;
    username: string;
    children: React.ReactNode;
}

export default function LiveKitComponent({ room, username, children }: LiveKitComponentProps) {
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
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-muted-foreground bg-secondary/10 rounded-lg m-2">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p className="text-xs">Oda Hazırlanıyor...</p>
            </div>
        );
    }

    if (!shouldConnect) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[80vh] gap-6 bg-background text-center p-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Odaya Katıl</h2>
                    <p className="text-muted-foreground">Kamera ve mikrofon erişimi için onay verin.</p>
                </div>
                <Button
                    onClick={() => setShouldConnect(true)}
                    size="lg"
                    className="gap-2"
                >
                    <Video className="h-5 w-5" />
                    Odaya Gir
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
            <RoomAudioRenderer />
            {children}

            {/* Footer Removed - Controls moved to Layout */}
        </LiveKitRoom>
    );
}
