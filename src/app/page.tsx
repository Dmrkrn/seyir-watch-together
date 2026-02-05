"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Plus, Users, Globe, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleJoin = () => {
    if (!roomId) return;
    // If username is empty, just redirect to room (JoinForm will show up)
    if (!username) {
      router.push(`/room/${roomId}`);
    } else {
      router.push(`/room/${roomId}?username=${encodeURIComponent(username)}`);
    }
  };

  const handleCreate = () => {
    if (!username) return;
    const newRoomId = Math.random().toString(36).substring(2, 9);
    // Mark creator as owner via query param (simple client-side check)
    router.push(`/room/${newRoomId}?username=${encodeURIComponent(username)}&owner=true`);
  };

  return (
    <div className="dark min-h-screen flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden p-4">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent pb-2">
            Seyir
          </h1>
          <p className="text-muted-foreground text-lg">
            Arkadaşlarınla bir şeyler izlemenin en eğlenceli yolu.
          </p>
        </div>

        <Card className="w-full border-white/10 shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Partiye Katıl</CardTitle>
            <CardDescription>Başlamak için bir takma ad seç.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                placeholder="Örn: Kaptan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary/50 border-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* JOIN EXISTING */}
              <div className="col-span-2 space-y-2 bg-secondary/20 p-4 rounded-lg border border-white/5">
                <Label htmlFor="room" className="text-xs font-semibold uppercase text-muted-foreground">Mevcut Odaya Gir</Label>
                <div className="flex gap-2">
                  <Input
                    id="room"
                    placeholder="Oda ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="bg-background/50 border-white/10"
                    onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  />
                  <Button onClick={handleJoin} disabled={!roomId} variant="secondary">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* CREATE NEW */}
              <div className="col-span-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Veya
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="default"
                className="col-span-2 w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCreate}
                disabled={!username}
              >
                <Plus className="h-4 w-4" />
                Yeni Oda Oluştur
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground opacity-50">
          <a href="https://cagridemirkiran.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            Developed by Çağrı Demirkıran
          </a>
          <span className="mx-2">•</span>
          v1.0
        </p>
      </div>
    </div>
  );
}
