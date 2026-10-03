import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          minWidth: 380,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h3" sx={{ mb: 5, fontWeight: 600 }}>
          Task Manager
        </Typography>

        <Stack spacing={4}>
          {/* --- TASKS SECTION --- */}
          <Box>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                component={Link}
                to="/tasks"
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                Go to Tasks
              </Button>
              <Button
                variant="outlined"
                component={Link}
                //to="/tasks/new"
                to=""
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >

                Add Task
              </Button>
            </Stack>
          </Box>

          {/* --- CATEGORIES SECTION --- */}
          <Box>
              <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                component={Link}
                to="/categories"
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                Go to Categories
              </Button>
              <Button
                variant="outlined"
                component={Link}
                //to="/categories/new"
                to=""
                sx={{
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                Add Category
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
