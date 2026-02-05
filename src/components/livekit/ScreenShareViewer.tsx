"use client";

import { useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Loader2, Monitor, Share } from "lucide-react";

export function ScreenShareViewer() {
    // Subscribe to Screen Share tracks
    const tracks = useTracks([Track.Source.ScreenShare]);

    const screenShareTrack = tracks[0];

    if (!screenShareTrack) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full bg-black/90 text-white border border-white/10 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-secondary/20 p-6 rounded-full mb-4">
                    <Monitor className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Sahne Boş</h2>
                <p className="text-muted-foreground max-w-md">
                    Henüz kimse ekran paylaşmıyor. <br />
                    Aşağıdaki <Share className="inline h-4 w-4 mx-1" /> butonuna basarak ekranını paylaşabilirsin.
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground/60">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Yayın bekleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl border border-border/20">
            <VideoTrack
                trackRef={screenShareTrack}
                className="w-full h-full object-contain"
            />

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-white text-xs font-medium flex items-center gap-2">
                <Monitor className="h-3 w-3 text-green-400" />
                <span>{screenShareTrack.participant.identity} paylaşıyor</span>
            </div>
        </div>
    );
}
