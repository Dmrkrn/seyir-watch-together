"use client";

import { Shell } from "@/components/layout/Shell";
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
    if (!username || !roomId) return;
    router.push(`/room/${roomId}?username=${encodeURIComponent(username)}`);
  };

  const handleCreate = () => {
    if (!username) return;
    const newRoomId = Math.random().toString(36).substring(2, 9);
    router.push(`/room/${newRoomId}?username=${encodeURIComponent(username)}`);
  };

  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Seyir Watch Party
          </h1>
          <p className="text-muted-foreground text-lg">
            Arkadaşlarınla film izle, sohbet et, senkronize kal.
          </p>
        </div>

        <Card className="w-full max-w-md border-primary/20 shadow-2xl">
          <CardHeader>
            <CardTitle>Partiye Katıl</CardTitle>
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
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* JOIN EXISTING */}
              <div className="col-span-2 space-y-2 bg-secondary/20 p-4 rounded-lg border border-dashed">
                <Label htmlFor="room" className="text-xs font-semibold uppercase text-muted-foreground">Mevcut Odaya Gir</Label>
                <div className="flex gap-2">
                  <Input
                    id="room"
                    placeholder="Oda ID (örn: sinema)"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                  <Button onClick={handleJoin} disabled={!username || !roomId}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* CREATE NEW */}
              <div className="col-span-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
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
                className="col-span-2 w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
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
        <p className="text-xs text-muted-foreground">
          Seyir v1.0 • Açık Kaynak Watch Party Uygulaması
        </p>
      </div>
    </Shell>
  );
}
