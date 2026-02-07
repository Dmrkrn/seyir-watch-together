import { GridLayout, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { ParticipantWithVolume } from "./ParticipantWithVolume";

export function SidebarGrid() {
    const tracks = useTracks(
        [Track.Source.Camera],
        { onlySubscribed: false } // Local participant'ı da dahil et
    );
    return (
        <div className="grid grid-cols-1 gap-2 h-full overflow-y-auto content-start">
            {tracks.map((track) => (
                <div key={track.publication.trackSid} className="aspect-video w-full relative bg-black rounded-md overflow-hidden border border-white/5">
                    <ParticipantWithVolume trackRef={track} className="w-full h-full" />
                </div>
            ))}
        </div>
    );
}
