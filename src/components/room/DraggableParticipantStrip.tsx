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

    // Resize state
    const [stripHeight, setStripHeight] = useState(130); // Default height (px)
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartRef = useRef(0);
    const initialHeightRef = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only drag if not clicking buttons or resize handle
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.resize-handle')) return;

        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        initialPosRef.current = { ...position };
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);
        resizeStartRef.current = e.clientY;
        initialHeightRef.current = stripHeight;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const dx = e.clientX - dragStartRef.current.x;
                const dy = e.clientY - dragStartRef.current.y;
                setPosition({
                    x: initialPosRef.current.x + dx,
                    y: initialPosRef.current.y + dy,
                });
            }
            if (isResizing) {
                // Moving mouse UP should increase height (since it's anchored at bottom)
                // Actually it's translated from center, but visual bottom is fixed relative to screen bottom?
                // The container has `bottom: 100px`. Increasing height grows it UPWARDS.
                // So dragging mouse UP (y decreases) -> height increases.
                const dy = resizeStartRef.current - e.clientY;
                const newHeight = Math.min(Math.max(initialHeightRef.current + dy, 80), 400); // Min 80px, Max 400px
                setStripHeight(newHeight);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        if (isDragging || isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isResizing]);

    // If no cameras, don't render anything (Moved to end)
    if (tracks.length === 0) return null;

    return (
        <div
            className={`absolute z-50 flex flex-col items-center gap-1 p-2 rounded-xl backdrop-blur-md border border-white/10 transition-colors duration-300 ${isMinimized ? "bg-black/40" : "bg-black/60"}`}
            style={{
                transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
                bottom: "100px",
                left: "50%",
                cursor: isDragging ? "grabbing" : "grab"
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Resize Handle (Top Edge) */}
            {!isMinimized && (
                <div
                    className="resize-handle absolute -top-2 left-0 right-0 h-4 cursor-ns-resize flex justify-center items-center group/handle opacity-0 hover:opacity-100 transition-opacity"
                    onMouseDown={handleResizeMouseDown}
                    title="Boyutlandırmak için sürükle"
                >
                    <div className="w-16 h-1 bg-white/40 rounded-full shadow-lg" />
                </div>
            )}

            {/* Collapse/Expand Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Don't drag when clicking button
                    setIsMinimized(!isMinimized);
                }}
                className="relative z-10 bg-black/80 rounded-full p-0.5 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer mb-1"
                title={isMinimized ? "Göster" : "Gizle"}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {isMinimized ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
            </button>

            {/* Video Strip (Hidden if minimized) */}
            {!isMinimized && (
                <div className="flex flex-nowrap gap-2 overflow-x-auto max-w-[80vw] p-1 mt-1 relative z-0 scrollbar-hide">
                    {tracks.map((track) => (
                        <div
                            key={track.publication.trackSid}
                            className="relative shrink-0 rounded-md overflow-hidden bg-black shadow-lg border border-white/5 transition-[width,height] duration-75"
                            style={{
                                height: `${stripHeight}px`,
                                width: `${stripHeight * 1.5}px`
                            }}
                        >
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
