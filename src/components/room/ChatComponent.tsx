"use client";

import { usePlayerStore } from "@/stores/usePlayerStore";
import { MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface ChatComponentProps {
    username: string; // Current user
}

export function ChatComponent({ username }: ChatComponentProps) {
    const { messages, sendMessage } = usePlayerStore();
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        sendMessage(inputValue, username);
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="flex flex-col h-full bg-card border-l overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-card shrink-0">
                <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Sohbet
                </h3>
                <span className="text-xs text-muted-foreground">{messages.length} mesaj</span>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0"
            >
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm mt-10 opacity-50">
                        Henüz mesaj yok.<br />İlk mesajı sen at! 👋
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex gap-2 ${msg.isMe ? "flex-row-reverse" : ""}`}
                    >
                        <div
                            className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white
                            ${msg.isMe ? "bg-blue-500" : "bg-green-500"}`}
                        >
                            {msg.user.substring(0, 2).toUpperCase()}
                        </div>

                        <div className={`space-y-1 flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                            <div className="flex items-baseline gap-2">
                                {!msg.isMe && <span className="text-sm font-semibold">{msg.user}</span>}
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p
                                className={`text-sm p-2 rounded-lg max-w-[200px] break-words
                                ${msg.isMe
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-muted text-foreground/90 rounded-bl-none"}`}
                            >
                                {msg.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t bg-background shrink-0">
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-secondary/50 border-0 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        placeholder="Bir şeyler yaz..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button size="icon" variant="default" onClick={handleSend} disabled={!inputValue.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
