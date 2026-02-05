import { create } from 'zustand'

export interface VideoState {
    isPlaying: boolean;
    currentTime: number; // in seconds
    duration: number; // in seconds
    volume: number; // 0 to 1
    isMuted: boolean;
    url: string;
}

interface PlayerStore extends VideoState {
    setPlaying: (playing: boolean) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    setUrl: (url: string) => void;

    // High-level Actions (connected to Sync Engine later)
    play: () => void;
    pause: () => void;
    seekTo: (time: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    // Initial State
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    url: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4", // Demo default

    // Setters
    setPlaying: (playing) => set({ isPlaying: playing }),
    setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ duration }),
    setVolume: (volume) => set({ volume }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    setUrl: (url) => set({ url }),

    // Actions
    play: () => {
        // TODO: Emit socket event 'play'
        set({ isPlaying: true });
    },
    pause: () => {
        // TODO: Emit socket event 'pause'
        set({ isPlaying: false });
    },
    seekTo: (time) => {
        // TODO: Emit socket event 'seek' with timestamp
        set({ currentTime: time });
    }
}))
