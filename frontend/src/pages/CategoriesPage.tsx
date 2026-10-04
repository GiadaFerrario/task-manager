import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {Alert, Box, Button, CircularProgress, Typography} from "@mui/material";
import type {Category} from "../models/Category.ts";
import {getCategories} from "../api/categoryService.ts";
import {getErrorMessage} from "../api/getErrorMessage.ts";
import CategoryCard from "../components/cards/CategoryCard.tsx";
import CustomList from "../components/list/CustomList.tsx";
import CategoryFormDialog from "../components/forms/CategoryFormDialog.tsx";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const dialogOpen = searchParams.get("new") === "1";

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch((e) => setError(getErrorMessage(e, "Unable to load categories")))
            .finally(() => setLoading(false));
    }, []);

    const openDialog = () => setSearchParams({new: "1"});
    const closeDialog = () => setSearchParams({});

    const handleSaved = (category: Category) => {
        setCategories((current) => [...current, category]);
        closeDialog();
    };

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} sx={{width: "33vw"}}>
                <Typography variant="h5">Categories</Typography>
                <Button variant="contained" onClick={openDialog}>Add Category</Button>
            </Box>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            {loading
                ? <CircularProgress/>
                : <CustomList items={categories} renderItem={(category) => <CategoryCard category={category}/>}/>}
            <CategoryFormDialog open={dialogOpen} onClose={closeDialog} onSaved={handleSaved}/>
        </>
    );
}
