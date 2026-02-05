import { Shell } from "@/components/layout/Shell";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, MessageSquare, Settings, Users } from "lucide-react";
import LiveKitComponent from "@/components/livekit/LiveKitComponent";
import { RoomSyncManager } from "@/components/room/RoomSyncManager";
import { ChatComponent } from "@/components/room/ChatComponent";

interface RoomPageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RoomPage(props: RoomPageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const usernameParam = searchParams.username;
    // Handle array or string case, satisfy TS
    const rawUsername = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam;

    const username = rawUsername || `User-${Math.floor(Math.random() * 1000)}`;

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
                        <LiveKitComponent room={params.id} username={username} />
                    </div>

                    {/* Chat Component */}
                    <div className="flex-1 overflow-hidden">
                        <ChatComponent username={username} />
                    </div>
                </aside>
            </div>
        </div>
    )
}
