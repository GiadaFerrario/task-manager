import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <AppBar>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }} component={Link} to="/" color="inherit">
                    Task Manager
                </Typography>
                <Button color="inherit" component={Link} to="/tasks">
                    Tasks
                </Button>
                <Button color="inherit" component={Link} to="/categories">
                    Categories
                </Button>
            </Toolbar>
        </AppBar>
    );
}
