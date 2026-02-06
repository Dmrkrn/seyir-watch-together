"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Copy, Settings, Video, Check, Maximize, Volume2, VolumeX, ChevronDown, ChevronUp } from "lucide-react";
import LiveKitComponent from "@/components/livekit/LiveKitComponent";
import { ChatComponent } from "@/components/room/ChatComponent";
import { SidebarGrid } from "@/components/room/SidebarGrid";
import { RoomSyncManager } from "@/components/room/RoomSyncManager";
import { ScreenShareViewer } from "@/components/livekit/ScreenShareViewer";
import { DraggableParticipantStrip } from "@/components/room/DraggableParticipantStrip";
import { MainVolumeControl } from "@/components/room/MainVolumeControl";
import { ControlBar, DisconnectButton, useRoomContext } from "@livekit/components-react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface RoomLayoutProps {
    roomId: string;
    username: string;
}

export function RoomLayout({ roomId, username }: RoomLayoutProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const mainRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();

    // Check if user is owner (simple check via URL param)
    const isOwner = searchParams.get("owner") === "true";

    const handleCopyInvite = () => {
        // Copy only the base URL without query params (username)
        const url = `${window.location.origin}${window.location.pathname}`;
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            mainRef.current?.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleChange = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);
            // Default to hidden or shown? User said "bi tuşa basınca aşağı, yine basınca yukarı".
            // Let's default to shown.
            setShowControls(true);
        };
        document.addEventListener("fullscreenchange", handleChange);
        return () => document.removeEventListener("fullscreenchange", handleChange);
    }, []);

    return (
        <div className="dark flex h-screen overflow-hidden flex-col bg-background text-foreground relative">
            {/* Background Gradient Effect - Matches Home Page */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background pointer-events-none z-0" />

            <RoomSyncManager roomId={roomId} />
            <LiveKitComponent room={roomId} username={username}>
                {/* Top Bar (Now inside LiveKit context, but effectively just layout) */}
                <header className="flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-md px-6 shrink-0 z-10 relative">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        Seyir <span className="text-muted-foreground font-normal mx-2">|</span> Watch Together
                    </h1>

                    <div className="ml-auto flex items-center gap-2">
                        {/* Room ID Badge */}
                        <div className="hidden md:flex items-center text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md mr-2">
                            ID: <span className="font-mono ml-1 text-foreground">{roomId}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={toggleFullScreen} title="Sinema Modu">
                            <Maximize className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 shadow-sm border transition-all duration-300"
                            onClick={handleCopyInvite}
                        >
                            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            <span className="hidden sm:inline">{isCopied ? "Kopyalandı!" : "Invite Link"}</span>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                // Force disconnect and redirect
                                window.location.href = '/';
                            }}
                        >
                            Odadan Ayrıl
                        </Button>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Main Content (Screen Share Stage) */}
                    <main
                        ref={mainRef}
                        className="flex-1 flex flex-col p-4 md:p-6 bg-black/5 overflow-hidden justify-center relative group"
                    >
                        {/* Resizable Container for Screen Share */}
                        <div className="relative flex justify-center items-center w-full h-full max-w-full max-h-full overflow-hidden resize-none md:resize p-1" style={{ minHeight: '300px' }}>
                            <ScreenShareViewer />
                        </div>

                        {/* Draggable Floating Participant Bar (Only in Fullscreen) */}
                        {isFullscreen && <DraggableParticipantStrip />}

                        {/* Screen Share Control (Absolute at bottom) */}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-xl z-20 transition-all duration-300 ease-in-out flex flex-col items-center gap-2 ${showControls ? "bottom-6 bg-black/50" : "-bottom-20 bg-transparent border-transparent"}`}
                        >
                            {/* Toggle Button */}
                            {isFullscreen && (
                                <button
                                    onClick={() => setShowControls(!showControls)}
                                    className="absolute -top-8 bg-black/50 p-1.5 rounded-full border border-white/10 text-white/70 hover:text-white transition-colors"
                                    title={showControls ? "Kontrolleri Gizle" : "Kontrolleri Göster"}
                                >
                                    {showControls ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                </button>
                            )}

                            {/* Control Bar Content - Only visible when shown or not fullscreen (always show in normal mode?) 
                                Actually, in normal mode this div is static? No, it's absolute.
                                Let's keep logic simple: If not fullscreen, always show. If fullscreen, obey showControls.
                             */}
                            <div className={`${(isFullscreen && !showControls) ? "opacity-0 pointer-events-none" : "opacity-100"} flex items-center gap-2 transition-opacity duration-300`}>
                                <MainVolumeControl />
                                <div className="[&_.lk-button-label]:hidden">
                                    <ControlBar
                                        variation="minimal"
                                        controls={{
                                            microphone: true,
                                            camera: true,
                                            screenShare: isOwner,
                                            chat: false,
                                            leave: false
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Right Sidebar (Cameras & Chat) */}
                    <aside className="w-80 border-l bg-card hidden xl:flex flex-col shrink-0">
                        {/* Camera Grid (sidebar) */}
                        <div className="h-1/2 border-b relative bg-secondary/5 overflow-hidden p-2">
                            <SidebarGrid />
                            {/* Camera Controls */}

                        </div>

                        {/* Chat Component */}
                        <div className="flex-1 overflow-hidden border-t border-border/50">
                            <ChatComponent username={username} />
                        </div>
                    </aside>
                </div>
            </LiveKitComponent>
        </div>
    );
}
