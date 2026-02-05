"use client";

import { useTracks } from "@livekit/components-react";
import { Track, RemoteAudioTrack } from "livekit-client";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";

export function MainVolumeControl() {
    const tracks = useTracks([Track.Source.ScreenShareAudio]);
    const [volume, setVolume] = useState(1);
    const audioTrackRef = tracks[0];

    // Effect to apply volume whenever track changes or volume state changes
    useEffect(() => {
        if (audioTrackRef?.publication?.track instanceof RemoteAudioTrack) {
            const audioTrack = audioTrackRef.publication.track as RemoteAudioTrack;
            audioTrack.attachedElements.forEach(el => {
                el.volume = volume;
            });
        }
    }, [volume, audioTrackRef]);

    // If no screen share audio, don't show controls? Or show disabled?
    // Let's show only if track exists to keep UI clean.
    if (!audioTrackRef) return null;

    return (
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 h-10">
            <button
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="text-white hover:text-blue-400"
                title={volume === 0 ? "Sesi Aç" : "Sesi Kapat"}
            >
                {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
            />
        </div>
    );
}
