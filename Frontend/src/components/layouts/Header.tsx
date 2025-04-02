import { Bell, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
    return (
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
            <Button variant="ghost" size="icon" className="md:hidden">
                <GraduationCap className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2 md:ml-auto">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback>LJ</AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
