import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    cssVariables: { colorSchemeSelector: "class" },
    defaultColorScheme: "light",
    colorSchemes: {
        light: {
            palette: {
                primary: { light: "#a45cf0", main: "#7914e3", dark: "#5a0fb0" },
                background: { default: "#f6f5fb", paper: "#ffffff" },
                text: { primary: "#1b1830", secondary: "#605c78" },
                divider: "rgba(27, 24, 48, 0.08)",
            },
        },
        dark: {
            palette: {
                primary: { light: "#c39bff", main: "#a45cf0", dark: "#7914e3" },
                background: { default: "#12101c", paper: "#1c1a2b" },
                text: { primary: "#f0eefa", secondary: "#a9a5c0" },
                divider: "rgba(240, 238, 250, 0.1)",
            },
        },
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        h3: { fontWeight: 700, letterSpacing: "-0.02em" },
        h5: { fontWeight: 700, letterSpacing: "-0.01em" },
        h6: { fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { minHeight: "100vh", WebkitFontSmoothing: "antialiased" },
            },
        },
        MuiAppBar: {
            defaultProps: { elevation: 0, color: "inherit" },
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(12px)",
                    borderBottom: `1px solid ${theme.vars.palette.divider}`,
                    color: theme.vars.palette.text.primary,
                    ...theme.applyStyles("dark", {
                        backgroundColor: "rgba(28, 26, 43, 0.8)",
                    }),
                }),
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: { root: { borderRadius: 10 } },
        },
        MuiCard: {
            defaultProps: { variant: "outlined" },
            styleOverrides: {
                root: ({ theme }) => ({
                    borderColor: theme.vars.palette.divider,
                    boxShadow: "0 1px 2px rgba(27, 24, 48, 0.04), 0 4px 16px rgba(27, 24, 48, 0.04)",
                }),
            },
        },
        MuiDialog: {
            styleOverrides: { paper: { borderRadius: 16 } },
        },
        MuiChip: {
            styleOverrides: { root: { fontWeight: 500 } },
        },
    },
});
