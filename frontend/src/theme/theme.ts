import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: { main: "#7914e3" },
        background: { default: "#f9f9f9" },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: "#fff",
                    color: "#000",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                },
            },
        },
    },
});
