import { useDarkMode } from "@/context/DarkModeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DarkModeToggle() {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <Button variant="outline" size="icon" onClick={toggleDark}>
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
