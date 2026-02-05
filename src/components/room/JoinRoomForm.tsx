"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface JoinRoomFormProps {
    roomId: string;
}

export function JoinRoomForm({ roomId }: JoinRoomFormProps) {
    const router = useRouter();
    const [username, setUsername] = useState("");

    const handleJoin = () => {
        if (!username.trim()) return;
        router.push(`/room/${roomId}?username=${encodeURIComponent(username)}`);
    };

    return (
        <div className="dark min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden p-4">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none" />

            <Card className="z-10 w-full max-w-md border-white/10 shadow-2xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Odaya Katıl</CardTitle>
                    <CardDescription>
                        <strong>{roomId}</strong> numaralı odaya girmek üzeresin.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <Input
                            id="username"
                            placeholder="Takma adın nedir?"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                            className="bg-secondary/50 border-white/10"
                        />
                    </div>
                    <Button
                        onClick={handleJoin}
                        disabled={!username.trim()}
                        className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Video className="h-4 w-4" />
                        Odaya Gir
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
