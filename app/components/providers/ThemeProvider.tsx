import { createContext, useState, useContext, ReactNode } from 'react';
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

export const ThemeProvider: React.FC<{ children: ReactNode, initialTheme: any }> = ({ children, initialTheme }) => {
    const [theme, setTheme] = useState<THEMES>(initialTheme || THEMES.light);

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
