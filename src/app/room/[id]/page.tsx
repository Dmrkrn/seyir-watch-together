import { Shell } from "@/components/layout/Shell";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, MessageSquare, Settings, Users } from "lucide-react";
import LiveKitComponent from "@/components/livekit/LiveKitComponent";
import { RoomSyncManager } from "@/components/room/RoomSyncManager";

interface RoomPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function RoomPage(props: RoomPageProps) {
    const params = await props.params;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Client-side Sync Logic */}
            <RoomSyncManager roomId={params.id} />

            {/* Top Bar for Room */}
            <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
                <h1 className="text-lg font-semibold">Watch Party #{params.id || "Demo"}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Copy className="h-4 w-4" />
                        <span className="hidden sm:inline">Invite Link</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content (Player) */}
                <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 bg-black/5 overflow-hidden justify-center">
                    <div className="mx-auto w-full max-w-6xl space-y-4">
                        <VideoPlayer />

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Big Buck Bunny</h2>
                                <p className="text-muted-foreground">00:10 • 1080p • Demo Source</p>
                            </div>
                            <div className="flex -space-x-2">
                                {/* Mock Viewers */}
                                <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">ME</div>
                                <div className="h-8 w-8 rounded-full bg-green-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">JD</div>
                                <div className="h-8 w-8 rounded-full bg-gray-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold">+2</div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar (Chat & Social) */}
                <aside className="w-80 border-l bg-card hidden xl:flex flex-col">
                    <div className="h-1/3 border-b relative">
                        {/* LiveKit Video Conference Area */}
                        <LiveKitComponent room={params.id} username={`User-${Math.floor(Math.random() * 1000)}`} />
                    </div>

                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> Chat
                        </h3>
                    </div>

                    {/* Chat Messages Placeholder */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-full bg-green-500 shrink-0" />
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-semibold">Jane Doe</span>
                                    <span className="text-[10px] text-muted-foreground">12:42</span>
                                </div>
                                <p className="text-sm text-foreground/90 bg-muted p-2 rounded-r-lg rounded-bl-lg">
                                    This movie is awesome! 🍿
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-row-reverse">
                            <div className="h-8 w-8 rounded-full bg-blue-500 shrink-0" />
                            <div className="space-y-1 items-end flex flex-col">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[10px] text-muted-foreground">12:43</span>
                                    <span className="text-sm font-semibold">You</span>
                                </div>
                                <p className="text-sm text-primary-foreground bg-primary p-2 rounded-l-lg rounded-br-lg text-right">
                                    Wait for the plot twist...
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input Placeholder */}
                    <div className="p-4 border-t mt-auto">
                        <input
                            className="w-full bg-secondary/50 border-0 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Type a message..."
                        />
                    </div>
                </aside>
            </div>
        </div>
    )
}
