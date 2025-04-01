import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext({
    isDark: false,
    toggleDark: () => { },
});

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (stored === "dark") {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleDark = () => {
        const newMode = !isDark;
        setIsDark(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
        document.documentElement.classList.toggle("dark", newMode);
    };

    return (
        <DarkModeContext.Provider value={{ isDark, toggleDark }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
