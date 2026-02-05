"use client"

import React, { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, Maximize, Loader2, VolumeX, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePlayerStore } from "@/stores/usePlayerStore"

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
    url?: string;
    onProgress?: (state: { played: number; playedSeconds: number }) => void;
    onDuration?: (duration: number) => void;
    isSyncing?: boolean;
}

const DEMO_URL = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4";

export function VideoPlayer({ url: propUrl, onProgress: propOnProgress, onDuration: propOnDuration, isSyncing = false }: VideoPlayerProps) {
    const playerRef = useRef<ReactPlayer>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Global State
    const {
        isPlaying,
        volume,
        isMuted,
        currentTime,
        url: storeUrl,
        play,
        pause,
        toggleMute,
        setVolume,
        seekTo,
        setCurrentTime
    } = usePlayerStore();

    const url = propUrl || storeUrl;

    // Local State
    const [seeking, setSeeking] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [duration, setDuration] = useState(0); // Safe duration state
    const [ready, setReady] = useState(false);
    const [playError, setPlayError] = useState(false); // Track autoplay failure
    const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Sync ReactPlayer with Store Time
    useEffect(() => {
        if (ready && playerRef.current && Math.abs(playerRef.current.getCurrentTime() - currentTime) > 1.0 && !seeking) {
            playerRef.current.seekTo(currentTime);
        }
    }, [currentTime, seeking, ready]);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current as NodeJS.Timeout);
        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2500);
        }
    };

    const handlePlayPause = () => {
        setPlayError(false); // Clear error on manual interaction
        if (isPlaying) pause();
        else play();
    };

    const handleSeekChange = (value: number[]) => {
        setSeeking(true);
    };

    const handleSeekMouseUp = (value: number[]) => {
        setSeeking(false);
        const d = duration || 1;
        seekTo(value[0] * d);
    };

    const toggleFullScreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    // Calculate progress for slider safely
    const safeDuration = duration > 0 ? duration : 1;
    const progressValue = currentTime / safeDuration;

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group shadow-2xl border border-border/20"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* The Player */}
            <ReactPlayer
                ref={playerRef}
                url={url}
                width="100%"
                height="100%"
                playing={isPlaying}
                volume={volume}
                muted={isMuted}
                onReady={() => setReady(true)}
                onDuration={(d) => setDuration(d)}
                onProgress={(state) => {
                    if (!seeking) {
                        // Optional: Sync store loosely if hosting
                    }
                    if (propOnProgress) propOnProgress(state);
                }}
                onError={(e) => {
                    console.log("Player Error", e);
                    // Standard way to catch autoplay errors isnt via onError prop for some players, 
                    // but we can infer state mismatch easily.
                }}
                controls={false}
                config={{
                    youtube: { playerVars: { showinfo: 0, disablekb: 1 } },
                    file: {
                        attributes: {
                            // Try to catch play promise rejections if possible, but ReactPlayer hides them.
                            // We can rely on user interaction overlay below.
                        }
                    }
                }}
            />

            {/* ERROR / START OVERLAY */}
            {/* If we are supposed to be playing but haven't interacted, show big button */}
            {!ready && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                </div>
            )}

            {/* Play/Pause Overlay for click-to-start (if paused or error) */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 cursor-pointer"
                    onClick={play}
                >
                    <div className="bg-black/50 p-4 rounded-full backdrop-blur-sm hover:scale-110 transition-transform">
                        <Play className="h-12 w-12 text-white fill-white" />
                    </div>
                </div>
            )}

            {/* Controls Overlay */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300",
                showControls ? "opacity-100" : "opacity-0"
            )}>
                <div className="mb-4 group/slider">
                    <Slider
                        value={[progressValue]}
                        min={0}
                        max={1}
                        step={0.001}
                        onValueChange={handleSeekChange}
                        onValueCommit={handleSeekMouseUp}
                        className="cursor-pointer"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-white hover:bg-white/10 hover:text-white rounded-full"
                            onClick={handlePlayPause}
                        >
                            {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current pl-1" />}
                        </Button>

                        <div className="flex items-center gap-2 group/vol">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/80 hover:text-white hover:bg-transparent"
                                onClick={toggleMute}
                            >
                                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <Slider
                                value={[isMuted ? 0 : volume]}
                                max={1}
                                step={0.05}
                                onValueChange={(val) => {
                                    setVolume(val[0]);
                                }}
                                className="w-20 transition-all opacity-0 group-hover/vol:opacity-100 hidden sm:flex"
                            />
                        </div>

                        <span className="text-xs text-white/70 font-mono tracking-wider ml-2">
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
