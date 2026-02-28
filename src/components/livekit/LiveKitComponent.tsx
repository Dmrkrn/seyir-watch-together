"use client";

import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
    ControlBar,
    DisconnectButton,
    useLiveKitRoom,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { Loader2, Video, Mic } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

function RoomConnectionHandler() {
    const { room } = useLiveKitRoom();

    useEffect(() => {
        if (!room) return;

        const onConnected = async () => {
            console.log("Room Connected, enabling camera/mic...");
            try {
                // Kamera ve Mikrofonu en düşük gecikme ve L1T1 (katmansız) modunda zorla
                await room.localParticipant.enableCameraAndMicrophone({
                    videoCodec: 'h264',
                    simulcast: true,
                    // @ts-ignore
                    videoEncoding: {
                        maxBitrate: 1500000,
                        maxFramerate: 30,
                    }
                });
                console.log("Camera/Mic enabled successfully");
            } catch (error) {
                console.error("Failed to enable camera/mic:", error);
            }
        }

        // Eğer zaten bağlıysa direkt çalıştır
        if (room.state === 'connected') {
            onConnected();
        }

        room.on('connected', onConnected);
        return () => {
            room.off('connected', onConnected);
        }
    }, [room]);

    return null;
}

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
            video={false} // Manüel yayınlayacağız
            audio={false} // Manüel yayınlayacağız
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            options={{
                adaptiveStream: true,
                dynacast: true,
                publishDefaults: {
                    videoCodec: 'vp9',
                    videoContentHint: 'motion',
                    simulcast: false,
                    screenShareEncoding: {
                        maxBitrate: 8000000,
                        maxFramerate: 60,
                    }
                },
                screenShareCaptureDefaults: {
                    resolution: { width: 1920, height: 1080, frameRate: 60 },
                }
            }}
            style={{ height: '100%' }}
            className="flex flex-col flex-1 w-full h-full"
        >
            <RoomConnectionHandler />
            <RoomAudioRenderer />
            {children}
        </LiveKitRoom>
    );
}
