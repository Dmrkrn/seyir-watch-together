import { AppHeader } from "./AppHeader"
import { AppSidebar } from "./AppSidebar"

interface ShellProps {
    children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <div className="grid lg:grid-cols-[280px_1fr]">
                <aside className="hidden lg:block fixed top-0 left-0 z-30 h-screen w-[280px]">
                    <AppSidebar className="h-full" />
                </aside>
                <main className="flex min-h-screen flex-col lg:pl-[0px] lg:col-start-2">
                    <AppHeader />
                    <div className="flex-1 p-6 md:p-8 pt-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
