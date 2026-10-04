import {BrowserRouter, Routes, Route} from "react-router-dom";
import { CssBaseline, Container, ThemeProvider, Toolbar } from "@mui/material";
import { theme } from "./theme/theme";
import Header from "./components/Header";
import TasksPage from "./pages/TasksPage";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import HomePage from "./pages/HomePage.tsx";

function Layout() {
    return (
        <>
            <Header />
            <Toolbar /> {/* spacer: the AppBar is fixed */}
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