import { Card, CardContent, Typography, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import type { Category } from "../../models/Category";

export default function CategoryCard(props: { category: Category; onClick?: () => void }) {
    const color = props.category.color ?? "#7914e3";
    return (
        <Card
            onClick={props.onClick}
            sx={{
                height: "100%",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                    backgroundColor: alpha(color, 0.08),
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(27, 24, 48, 0.12)",
                },
            }}
        >
            <CardContent>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                            color,
                            backgroundColor: alpha(color, 0.15),
                        }}
                    >
                        <LabelOutlinedIcon fontSize="small" />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                        {props.category.name}
                    </Typography>
                </Box>

                {props.category.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                        {props.category.description}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
