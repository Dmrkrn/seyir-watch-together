"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
    Home,
    Film,
    Users,
    Settings,
    LogOut,
    Clapperboard,
    Tv
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AppSidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    const links = [
        { name: "Lobby", href: "/", icon: Home },
        { name: "My Watch Party", href: "/room/my-room", icon: Clapperboard },
        { name: "Browse Rooms", href: "/browse", icon: Tv },
        { name: "Friends", href: "/friends", icon: Users },
    ]

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-card/50 backdrop-blur-xl", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-6 px-4">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Film className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Seyir
                        </h2>
                    </div>
                    <div className="space-y-1">
                        {links.map((link) => (
                            <Button
                                key={link.href}
                                variant={pathname === link.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-2",
                                    pathname === link.href && "bg-secondary/50 font-medium"
                                )}
                                asChild
                            >
                                <Link href={link.href}>
                                    <link.icon className="h-4 w-4" />
                                    {link.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <Separator className="mx-4 w-auto opacity-50" />
                <div className="px-3 py-2">
                    <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Your Crew
                    </h3>
                    <div className="space-y-1 px-4">
                        {/* Mock Online Friends */}
                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="relative">
                                <Avatar className="h-8 w-8 border-2 border-background">
                                    <AvatarImage src="/avatars/01.png" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Jane Doe</span>
                                <span className="text-[10px] text-muted-foreground leading-none">Watching generic...</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="relative">
                                <Avatar className="h-8 w-8 border-2 border-background">
                                    <AvatarFallback>AK</AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-yellow-500 border-2 border-background" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Ahmet K.</span>
                                <span className="text-[10px] text-muted-foreground leading-none">In Lobby</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer User Section */}
            <div className="absolute bottom-4 left-0 w-full px-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 backdrop-blur-md border border-border/50">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">Demirkıran</p>
                        <p className="text-xs text-muted-foreground truncate">Free Plan</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
