"use client";

import {
    LiveKitRoom,
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    ControlBar,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface LiveKitComponentProps {
    room: string;
    username: string;
}

export default function LiveKitComponent({ room, username }: LiveKitComponentProps) {
    const [token, setToken] = useState("");

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
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Connecting to secure server...</p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            video={true} // Start with video on
            audio={true} // Start with audio on
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            // Use the new simplified data attribute for theme
            data-lk-theme="default"
            style={{ height: '100%' }}
        >
            <MyVideoConference />
            <RoomAudioRenderer />
            {/* Remove ControlBar if you want custom controls, keeping for testing now */}
            <ControlBar />
        </LiveKitRoom>
    );
}

function MyVideoConference() {
    // Logic to show participants
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
        ],
        { onlySubscribed: false } // Show self too
    );

    return (
        <GridLayout
            tracks={tracks}
            style={{ height: '100%' }} // Take full height of parent
        >
            <ParticipantTile />
        </GridLayout>
    );
}
