"use client"

import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, Maximize, Loader2, VolumeX } from "lucide-react" // Import icons
import { cn } from "@/lib/utils"

// Lazy load ReactPlayer to avoid Hydration Mismatch and use standard exports to fix ref forwarding
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
    url?: string;
    onProgress?: (state: { played: number; playedSeconds: number }) => void;
    onDuration?: (duration: number) => void;
    isSyncing?: boolean; // For showing a "Syncing..." overlay
}

// Fallback to a nice cinematic demo video if no URL provided
const DEMO_URL = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4";

export function VideoPlayer({ url = DEMO_URL, onProgress, onDuration, isSyncing = false }: VideoPlayerProps) {
    const playerRef = useRef<ReactPlayer>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Local State (UI only, real sync will come from props later)
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0); // 0 to 1
    const [seeking, setSeeking] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

    // --- Control Visibility Logic ---
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current as NodeJS.Timeout);
        if (playing) {
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
        }
    };

    const handlePlayPause = () => {
        setPlaying(!playing);
        // TODO: In real app, emit "play" or "pause" socket event here
    };

    const handleSeekChange = (value: number[]) => {
        setSeeking(true);
        setPlayed(value[0]);
    };

    const handleSeekMouseUp = (value: number[]) => {
        setSeeking(false);
        playerRef.current?.seekTo(value[0]);
        // TODO: Emit "seek" event
    };

    const toggleFullScreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl border border-border/20"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => playing && setShowControls(false)}
        >
            {/* The Player */}
            <ReactPlayer
                ref={playerRef}
                url={url}
                width="100%"
                height="100%"
                playing={playing}
                volume={volume}
                muted={muted}
                onProgress={(state) => {
                    if (!seeking) setPlayed(state.played);
                    if (onProgress) onProgress(state);
                }}
                controls={false} // We provide custom controls
                config={{
                    youtube: { playerVars: { showinfo: 0, disablekb: 1 } }
                }}
            />

            {/* Sync Overlay (if needed) */}
            {isSyncing && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 text-white/90">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-sm font-medium tracking-wide">Syncing with Host...</span>
                    </div>
                </div>
            )}

            {/* Controls Overlay */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 pt-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300",
                showControls ? "opacity-100" : "opacity-0"
            )}>
                {/* Progress Bar */}
                <div className="mb-4 group/slider">
                    <Slider
                        value={[played]}
                        min={0}
                        max={1}
                        step={0.001}
                        onValueChange={handleSeekChange}
                        onValueCommit={handleSeekMouseUp}
                        className="cursor-pointer"
                    />
                </div>

                {/* Buttons Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-white hover:bg-white/10 hover:text-white rounded-full"
                            onClick={handlePlayPause}
                        >
                            {playing ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current pl-1" />}
                        </Button>

                        <div className="flex items-center gap-2 group/vol">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/80 hover:text-white hover:bg-transparent"
                                onClick={() => setMuted(!muted)}
                            >
                                {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <Slider
                                value={[muted ? 0 : volume]}
                                max={1}
                                step={0.05}
                                onValueChange={(val) => {
                                    setVolume(val[0]);
                                    setMuted(val[0] === 0);
                                }}
                                className="w-20 transition-all opacity-0 group-hover/vol:opacity-100 hidden sm:flex"
                            />
                        </div>

                        <span className="text-xs text-white/70 font-mono tracking-wider ml-2">
                            {/* TODO: Format time logic here */}
                            00:00 / 00:00
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-white/80 hover:bg-white/10 hover:text-white rounded-full"
                            onClick={toggleFullScreen}
                        >
                            <Maximize className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
