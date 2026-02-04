import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, Users, Globe } from "lucide-react";

export default function Home() {
  return (
    <Shell>
      <div className="flex flex-col space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lobby</h1>
            <p className="text-muted-foreground">
              Your command center for shared entertainment.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Watch Party
            </Button>
          </div>
        </div>

        {/* Featured Rooms / Active Parties */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Anime Night
              </CardTitle>
              <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-primary-foreground">Live</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Play className="h-4 w-4 fill-current text-red-500" />
                One Piece #1071
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Users className="h-3 w-3" /> 4 Friends watching
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Movie Marathon
              </CardTitle>
              <Badge variant="outline">Starting Soon</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Interstellar
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Users className="h-3 w-3" /> Waiting for host
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1 border-dashed bg-secondary/20 flex flex-col items-center justify-center p-6 text-center hover:bg-secondary/40 cursor-pointer transition-colors">
            <div className="rounded-full bg-secondary p-3 mb-2">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium">Create New Room</p>
            <p className="text-xs text-muted-foreground">Start a private session</p>
          </Card>
        </div>

        {/* Recent Activity / Friend Status */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {/* Placeholder for Activity Feed */}
              <div className="space-y-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-sm"><span className="font-medium">Ahmet</span> created a room "Comedy Nite"</p>
                  <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-sm"><span className="font-medium">Ayşe</span> started watching "Dune"</p>
                  <span className="text-xs text-muted-foreground ml-auto">15m ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Settings</CardTitle>
              <CardDescription>Audio & Video Preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Whisper Mode</span>
                  <Badge variant="secondary">Off</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mic Status</span>
                  <span className="text-sm text-green-500 font-medium">Ready</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
