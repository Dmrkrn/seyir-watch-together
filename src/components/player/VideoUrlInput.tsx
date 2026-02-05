"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Link2 } from "lucide-react";

export function VideoUrlInput() {
    const { changeUrl } = usePlayerStore();
    const [url, setLocalUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;
        changeUrl(url);
        setLocalUrl("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl mx-auto">
            <div className="relative flex-1">
                <Link2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="YouTube veya MP4 linki yapıştır..."
                    value={url}
                    onChange={(e) => setLocalUrl(e.target.value)}
                    className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
                />
            </div>
            <Button type="submit" size="sm">
                Aç
            </Button>
        </form>
    )
}
