"use client";

import { ParticipantTile, TrackReference, useParticipantContext, useRemoteParticipant } from "@livekit/components-react";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Track, RemoteAudioTrack } from "livekit-client";

interface ParticipantWithVolumeProps {
    trackRef: TrackReference;
    className?: string; // Allow custom styling
}

export function ParticipantWithVolume({ trackRef, className }: ParticipantWithVolumeProps) {
    const [volume, setVolume] = useState(1); // 0 to 1
    const [isHovered, setIsHovered] = useState(false);

    // We need to access the audio element. LiveKit handles this internally usually.
    // But we can try to find the audio element attached to the track or managing it via the RemoteParticipant.
    // Actually, LiveKit's `ParticipantTile` renders `<AudioTrack>` inside it.
    // The best way to control volume for a remote participant locally is to set the volume on the `<audio>` element.
    // Since we don't have direct ref to the <audio> inside ParticipantTile easily, 
    // we might need to rely on the fact that LiveKit attaches audio elements to the DOM.
    // A more robust way: use the track's attach/detach logic or find the element.

    // HOWEVER, for a simple implementation relative to the tile:
    // We'll trust that the user can accept a specific implementation where we find the audio element by participant ID or similar.

    // BETTER APPROACH:
    // LiveKit `RemoteAudioTrack` objects have a `.setVolume(volume)` method if we could access the standard Web Audio API node, 
    // but typically we just set `.volume` on the attached HTMLMediaElement.

    // Let's iterate over attached elements of the track.

    const handleVolumeChange = (newVol: number) => {
        setVolume(newVol);
        if (!trackRef || !trackRef.participant) return;

        const participant = trackRef.participant;

        // Try to get audio track publication safely
        let audioPub = participant.getTrackPublication?.(Track.Source.Microphone);

        // Fallback for older SDK versions or different object shapes if needed
        if (!audioPub && (participant as any).getTrack) {
            audioPub = (participant as any).getTrack(Track.Source.Microphone);
        }

        const audioTrack = audioPub?.track;

        if (audioTrack instanceof RemoteAudioTrack) {
            audioTrack.setVolume(newVol);
        }
    };

    // Don't show volume control for local user
    const isLocal = trackRef.participant?.isLocal;

    return (
        <div
            className={`relative group h-full w-full ${className || ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <ParticipantTile
                trackRef={trackRef}
                className="w-full h-full object-cover"
            />

            {/* Volume Overlay (Only for remote participants) */}
            {!isLocal && (
                <div className={`absolute bottom-2 right-2 z-10 p-1.5 bg-black/60 backdrop-blur-md rounded-md flex items-center gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                        className="text-white hover:text-blue-400"
                    >
                        {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    />
                </div>
            )}
        </div>
    );
}
