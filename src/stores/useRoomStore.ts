import { create } from 'zustand'
import { Room, RoomEvent, Participant } from 'livekit-client'

interface RoomStore {
    room: Room | null;
    participants: Participant[];
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;

    connect: (url: string, token: string) => Promise<void>;
    disconnect: () => void;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
    room: null,
    participants: [],
    isConnected: false,
    isConnecting: false,
    error: null,

    connect: async (url, token) => {
        set({ isConnecting: true, error: null });

        try {
            const room = new Room({
                adaptiveStream: true,
                dynacast: true,
            });

            // Setup Event Listeners
            room
                .on(RoomEvent.Connected, () => {
                    set({ isConnected: true, isConnecting: false });
                    // Update participants list
                    set({ participants: Array.from(room.participants.values()) });
                })
                .on(RoomEvent.Disconnected, () => {
                    set({ isConnected: false, room: null, participants: [] });
                })
                .on(RoomEvent.ParticipantConnected, (participant) => {
                    set((state) => ({ participants: [...state.participants, participant] }));
                })
                .on(RoomEvent.ParticipantDisconnected, (participant) => {
                    set((state) => ({
                        participants: state.participants.filter(p => p.sid !== participant.sid)
                    }));
                });

            await room.connect(url, token);
            set({ room });

        } catch (e: any) {
            set({ error: e.message, isConnecting: false });
        }
    },

    disconnect: () => {
        const { room } = get();
        if (room) {
            room.disconnect();
        }
        set({ room: null, isConnected: false });
    }
}))
