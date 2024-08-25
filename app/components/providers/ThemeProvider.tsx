import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';

export enum THEMES {
    dark = 'dark',
    light = 'light',
}

interface ThemeContextType {
    theme: THEMES;
    setTheme: (theme: THEMES) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const getCurrentTheme = () => {
    if (localStorage.theme === THEMES.dark || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add(THEMES.dark)
        return THEMES.dark

    } else {
        return THEMES.light
    }
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<THEMES>(THEMES.light);

    useEffect(() => {
        setTheme(getCurrentTheme())
    }, [])

    const themeContextValue = {
        theme,
        setTheme,
    };

    const darkTheme = createTheme({
        palette: {
            mode: theme,
        },
    });

    return (
        <ThemeContext.Provider value={themeContextValue}>
            <MUIThemeProvider theme={darkTheme}>
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
