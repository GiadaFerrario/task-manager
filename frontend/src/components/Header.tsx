import { AppBar, Toolbar, Typography, Button, IconButton, Tooltip, Box } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Link, NavLink } from "react-router-dom";

const navLinkSx = {
    color: "text.secondary",
    "&.active": { color: "primary.main", bgcolor: "action.selected" },
};

function ThemeToggle() {
    const { mode, systemMode, setMode } = useColorScheme();
    const isDark = (mode === "system" ? systemMode : mode) === "dark";
    return (
        <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
            <IconButton
                color="inherit"
                aria-label="Toggle color scheme"
                onClick={() => setMode(isDark ? "light" : "dark")}
            >
                {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
        </Tooltip>
    );
}

export default function Header() {
    return (
        <AppBar>
            <Toolbar sx={{ gap: 0.5 }}>
                <Box
                    component={Link}
                    to="/"
                    sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1, color: "primary.main", textDecoration: "none" }}
                >
                    <TaskAltIcon />
                    <Typography variant="h6" component="span" color="text.primary" noWrap sx={{ display: { xs: "none", sm: "inline" } }}>
                        Task Manager
                    </Typography>
                </Box>
                <Button component={NavLink} to="/tasks" sx={navLinkSx}>
                    Tasks
                </Button>
                <Button component={NavLink} to="/categories" sx={navLinkSx}>
                    Categories
                </Button>
                <ThemeToggle />
            </Toolbar>
        </AppBar>
    );
}
