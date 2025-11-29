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
import Plot from "react-plotly.js";
import { CardHeader, CardContent, useTheme } from "@mui/material";

const SampleLineGraph: React.FC = () => {
  const theme = useTheme();
  // Workaround for incompatible React types between react-plotly.js and project @types/react:
  // treat the Plot component as any when used in JSX.
  const PlotlyComponent: any = Plot;

  return (
    <Card sx={{ width: "100%", maxWidth: 700, mx: "auto" }}>
      <CardHeader title="Monthly Values (Plotly)" />

      <CardContent>
        <PlotlyComponent
          data={[
            {
              x: ["Jan", "Feb", "Mar", "Apr", "May"],
              y: [400, 300, 600, 200, 500],
              type: "scatter",
              mode: "lines+markers",
              marker: { color: theme.palette.primary.main },
              line: { width: 3, color: theme.palette.primary.main },
            },
          ]}
          layout={{
            autosize: true,
            height: 350,
            margin: { t: 40, l: 40, r: 20, b: 40 },
            paper_bgcolor: "transparent",
            plot_bgcolor: theme.palette.background.default,
            font: {
              color: theme.palette.text.primary,
            },
            xaxis: {
              gridcolor: theme.palette.divider,
            },
            yaxis: {
              gridcolor: theme.palette.divider,
            },
          }}
          style={{ width: "100%", height: "100%" }}
          config={{
            displayModeBar: false, // clean MUI look
            responsive: true,
          }}
        />
      </CardContent>
    </Card>
  );
};



const HydrationInformation: React.FC = () => {
  return (
    <Box sx={{ minHeight: "200vh", bgcolor: "#f4f4f4" }}>

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
                    height: 500,
                    bgcolor: "#ffffff",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SampleLineGraph />
                </Card>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
export default HydrationInformation;
