import { RoomLayout } from "@/components/room/RoomLayout";
import { JoinRoomForm } from "@/components/room/JoinRoomForm";

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

    // If no username provided in URL, show the Join Form
    if (!rawUsername) {
        return <JoinRoomForm roomId={params.id} />;
    }

    return <RoomLayout roomId={params.id} username={rawUsername} />;
}
