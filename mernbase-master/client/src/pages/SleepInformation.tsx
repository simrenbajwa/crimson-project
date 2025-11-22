import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
} from "@mui/material";

const SampleLineGraph = () => (
  <svg width="100%" height="100%" viewBox="0 0 300 120">
    <polyline
      fill="none"
      stroke="#2e5cf5"
      strokeWidth="4"
      points="10,90 60,70 110,80 160,40 210,60 260,20"
    />
  </svg>
);



const SleepInformation: React.FC = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f4f4" }}>

      <Container sx={{ mt: 8 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Graphics:
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button variant="contained" color="inherit">Filter</Button>
            <Button variant="contained" color="inherit">Option 1</Button>
            <Button variant="contained" color="inherit">Option 2</Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} md={6} key={i}>
              <Stack spacing={2}>
                {/* Top graph (line chart) */}
                <Card
                  sx={{
                    height: 250,
                    bgcolor: "#ffffff",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SampleLineGraph />
                </Card>

                {/* Bottom graph (bar chart) */}
                <Card
                  sx={{
                    height: 120,
                    bgcolor: "#ffffff",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                </Card>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SleepInformation;
