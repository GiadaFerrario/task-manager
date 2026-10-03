import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import { CssBaseline, Container, ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import Header from "./components/Header";
import TasksPage from "./pages/TasksPage";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import HomePage from "./pages/HomePage.tsx";

function Layout() {
    const location = useLocation();
    const hideNavbar = location.pathname === "/"; // hide nav bar in home

    return (
        <>
            {!hideNavbar && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
            </Routes>
        </>
    );
}


export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Container sx={{ mt: 4 }}>
                    <Layout/>
                </Container>
            </BrowserRouter>
        </ThemeProvider>
    );
}