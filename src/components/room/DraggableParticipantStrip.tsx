"use client";

import { ParticipantTile, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useState, useEffect, useRef } from "react";
import { GripHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { ParticipantWithVolume } from "./ParticipantWithVolume";

export function DraggableParticipantStrip() {
    const tracks = useTracks([Track.Source.Camera]);

    // Drag state
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Relative to initial center-bottom
    const [isDragging, setIsDragging] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
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
            className={`absolute z-50 flex flex-col items-center gap-1 p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all duration-300 ${isMinimized ? "bg-black/40" : "bg-black/60"}`}
            style={{
                transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
                bottom: "100px",
                left: "50%",
                cursor: isDragging ? "grabbing" : "grab"
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Collapse/Expand Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Don't drag when clicking button
                    setIsMinimized(!isMinimized);
                }}
                className="absolute -top-3 bg-black/80 rounded-full p-0.5 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                title={isMinimized ? "Göster" : "Gizle"}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {isMinimized ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
            </button>

            {/* Video Strip (Hidden if minimized) */}
            {!isMinimized && (
                <div className="flex flex-nowrap gap-2 overflow-x-auto max-w-[80vw] p-1 mt-1 relative z-0 scrollbar-hide">
                    {tracks.map((track) => (
                        <div key={track.publication.trackSid} className="h-32 w-48 relative shrink-0 rounded-md overflow-hidden bg-black shadow-lg border border-white/5">
                            <ParticipantWithVolume trackRef={track} />
                        </div>
                    ))}
                </div>
            )}

            {/* Minimized State Indicator */}
            {isMinimized && (
                <div className="text-xs font-medium text-white/70 px-2 py-1">
                    {tracks.length} Katılımcı
                </div>
            )}
        </div>
    );
}
