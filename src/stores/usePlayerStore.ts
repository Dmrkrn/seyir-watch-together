import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

export interface VideoState {
    isPlaying: boolean;
    currentTime: number; // in seconds
    duration: number; // in seconds
    volume: number; // 0 to 1
    isMuted: boolean;
    url: string;
}

interface PlayerStore extends VideoState {
    socket: Socket | null;
    roomId: string | null;

    // Chat State
    messages: Array<{ user: string, message: string, timestamp: number, isMe?: boolean }>;

    connectSocket: (serverUrl: string, roomId: string) => void;
    disconnectSocket: () => void;

    setPlaying: (playing: boolean) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    setUrl: (url: string) => void;

    // High-level Actions (Video)
    play: () => void;
    pause: () => void;
    seekTo: (time: number) => void;
    onRemoteUpdate: (type: 'play' | 'pause' | 'seek', time: number) => void;

    // Chat Actions
    sendMessage: (message: string, username: string) => void;
    addMessage: (msg: { user: string, message: string, timestamp: number, isMe?: boolean }) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    // Initial State
    socket: null,
    roomId: null,
    messages: [], // Initialize messages
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4",

    connectSocket: (serverUrl, roomId) => {
        // Prevent multiple connections
        if (get().socket) return;

        console.log(`Connecting to Signaling Server: ${serverUrl} for room ${roomId}`);
        const socket = io(serverUrl);
        set({ socket, roomId });

        socket.emit('join-room', roomId);

        socket.on('connect', () => {
            console.log('Connected to Sync Server');
        });

        socket.on('play', (time) => get().onRemoteUpdate('play', time));
        socket.on('pause', (time) => get().onRemoteUpdate('pause', time));
        socket.on('seek', (time) => get().onRemoteUpdate('seek', time));

        // Listen for Chat
        socket.on('chat-message', (msg) => {
            get().addMessage({ ...msg, isMe: false });
        });

        socket.on('sync-state', (state) => {
            // Initial sync when joining
            console.log('Received initial state:', state);
            if (state.currentTime) set({ currentTime: state.currentTime });
            if (state.isPlaying !== undefined) set({ isPlaying: state.isPlaying });
        });
    },

    disconnectSocket: () => {
        get().socket?.disconnect();
        set({ socket: null });
    },

    // Setters (Local Only)
    setPlaying: (playing) => set({ isPlaying: playing }),
    setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ duration }),
    setVolume: (volume) => set({ volume }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    setUrl: (url) => set({ url }),

    // Actions (Video)
    play: () => {
        set({ isPlaying: true });
        const { socket, roomId, currentTime } = get();
        if (socket && roomId) socket.emit('play', { roomId, currentTime });
    },
    pause: () => {
        set({ isPlaying: false });
        const { socket, roomId, currentTime } = get();
        if (socket && roomId) socket.emit('pause', { roomId, currentTime });
    },
    seekTo: (time) => {
        set({ currentTime: time });
        const { socket, roomId } = get();
        if (socket && roomId) socket.emit('seek', { roomId, currentTime: time });
    },

    // Remote Updates
    onRemoteUpdate: (type, time) => {
        console.log(`Remote Update: ${type} at ${time}`);
        if (type === 'play') set({ isPlaying: true, currentTime: time });
        if (type === 'pause') set({ isPlaying: false, currentTime: time });
        if (type === 'seek') set({ currentTime: time });
    },

    // Chat Actions
    sendMessage: (message, username) => {
        const { socket, roomId } = get();
        if (socket && roomId) {
            socket.emit('chat-message', { roomId, message, user: username });
            // Add locally immediately (optimistic)
            get().addMessage({ user: username, message, timestamp: Date.now(), isMe: true });
        }
    },
    addMessage: (msg) => {
        // Keep only last 50 messages
        set((state) => ({ messages: [...state.messages, msg].slice(-50) }));
    }
}))
