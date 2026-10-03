import { Card, CardContent, Typography, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Category } from "../../models/Category";

export default function CategoryCard(props: { category: Category }) {
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 2,
                transition: "all 0.25s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: alpha(props.category.color ?? "#000", 0.1),
                    transform: "translateY(-3px)",
                    boxShadow: 3,
                },
            }}
        >
            <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                    {props.category.color &&
                        <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: props.category.color,
                            border: "1px solid rgba(0,0,0,0.4)",
                            flexShrink: 0,
                        }}
                    />}
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        color="text.primary"
                    >
                        {props.category.name}
                    </Typography>
                </Box>

                {props.category.description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {props.category.description}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
