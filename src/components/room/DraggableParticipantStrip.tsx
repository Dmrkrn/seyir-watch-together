"use client";

import { ParticipantTile, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useState, useEffect, useRef } from "react";
import { GripHorizontal } from "lucide-react";
import { ParticipantWithVolume } from "./ParticipantWithVolume";

export function DraggableParticipantStrip() {
    const tracks = useTracks([Track.Source.Camera]);

    // Drag state
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Relative to initial center-bottom
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const initialPosRef = useRef({ x: 0, y: 0 });



    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        initialPosRef.current = { ...position };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;
            setPosition({
                x: initialPosRef.current.x + dx,
                y: initialPosRef.current.y + dy,
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    // If no cameras, don't render anything (Moved to end)
    if (tracks.length === 0) return null;

    return (
        <div
            className="absolute z-50 flex flex-col items-center gap-1 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 transition-all duration-300"
            style={{
                transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
                bottom: "100px",
                left: "50%",
                cursor: isDragging ? "grabbing" : "default"
            }}
        >
            {/* Drag Area (Functional header) */}
            <div
                className="w-full h-8 absolute top-0 left-0 cursor-grab active:cursor-grabbing z-10 flex items-center justify-center hover:bg-white/5 transition-colors rounded-t-xl"
                onMouseDown={handleMouseDown}
                title="Sürüklemek için tut"
            >
                <GripHorizontal className="text-white/20 w-8 h-8" />
            </div>

            {/* Video Strip */}
            <div className="flex flex-nowrap gap-2 overflow-x-auto max-w-[80vw] p-1 mt-8 relative z-0 scrollbar-hide">
                {tracks.map((track) => (
                    <div key={track.publication.trackSid} className="h-32 w-48 relative shrink-0 rounded-md overflow-hidden bg-black shadow-lg border border-white/5">
                        <ParticipantWithVolume trackRef={track} />
                    </div>
                ))}
            </div>
        </div>
    );
}
