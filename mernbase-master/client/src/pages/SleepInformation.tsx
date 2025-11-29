import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Stack,
  useTheme,
} from "@mui/material";
import Plot from "react-plotly.js";

type SampleLineGraphProps = {
  title: string;
  subtitle?: string;
};

const SampleLineGraph: React.FC<SampleLineGraphProps> = ({ title, subtitle }) => {
  const theme = useTheme();
  const PlotlyComponent: any = Plot;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <CardHeader
        title={title}
        subheader={subtitle}
        sx={{
          "& .MuiCardHeader-title": {
            fontWeight: 700,
            fontSize: 16,
          },
          "& .MuiCardHeader-subheader": {
            fontSize: 13,
          },
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <PlotlyComponent
          data={[
            {
              x: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              y: [6, 7.5, 5.5, 8, 7, 6.5, 7.2],
              type: "scatter",
              mode: "lines+markers",
              marker: { color: theme.palette.primary.main },
              line: { width: 3, color: theme.palette.primary.main },
            },
          ]}
          layout={{
            autosize: true,
            height: 280,
            margin: { t: 10, l: 40, r: 10, b: 40 },
            paper_bgcolor: "transparent",
            plot_bgcolor: theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#f9fafb",
            font: {
              color: theme.palette.text.primary,
            },
            xaxis: {
              gridcolor: theme.palette.divider,
              zeroline: false,
            },
            yaxis: {
              gridcolor: theme.palette.divider,
              zeroline: false,
            },
          }}
          style={{ width: "100%", height: "100%" }}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
        />
      </CardContent>
    </Card>
  );
};

const SleepInformation: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("7d");
  const [view, setView] = React.useState<"overview" | "quality" | "hydration">(
    "overview"
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "linear-gradient(180deg, #eef2ff 0%, #f9fafb 40%, #f4f4f5 100%)",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            mb: { xs: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: 0.2,
                mb: 1,
              }}
            >
              Sleep & Hydration Insights
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 520,
                color: theme.palette.text.secondary,
              }}
            >
              Track how your sleep duration, consistency, and hydration interact
              over time. Use the filters to explore different time ranges and
              focus areas.
            </Typography>
          </Box>

          {/* Controls / Filters */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            {/* Left group: primary filters */}
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant={timeRange === "7d" ? "contained" : "outlined"}
                onClick={() => setTimeRange("7d")}
              >
                Last 7 days
              </Button>
              <Button
                size="small"
                variant={timeRange === "30d" ? "contained" : "outlined"}
                onClick={() => setTimeRange("30d")}
              >
                30 days
              </Button>
              <Button
                size="small"
                variant={timeRange === "90d" ? "contained" : "outlined"}
                onClick={() => setTimeRange("90d")}
              >
                90 days
              </Button>
            </Stack>

            {/* Right group: view toggles + action */}
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant={view === "overview" ? "contained" : "text"}
                onClick={() => setView("overview")}
              >
                Overview
              </Button>
              <Button
                size="small"
                variant={view === "quality" ? "contained" : "text"}
                onClick={() => setView("quality")}
              >
                Sleep Quality
              </Button>
              <Button
                size="small"
                variant={view === "hydration" ? "contained" : "text"}
                onClick={() => setView("hydration")}
              >
                Hydration Focus
              </Button>

              <Button
                size="small"
                variant="contained"
                sx={{
                  ml: { xs: 0, sm: 1 },
                  borderRadius: 999,
                }}
              >
                Export data
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Grid of charts */}
        <Grid
          container
          spacing={{ xs: 2.5, md: 3 }}
          sx={{ alignItems: "stretch" }}
        >
          <Grid item xs={12} md={6}>
            <SampleLineGraph
              title="Sleep Duration"
              subtitle="Average hours slept per night"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <SampleLineGraph
              title="Bedtime Consistency"
              subtitle="Variation from target bedtime"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <SampleLineGraph
              title="Wake-up Variability"
              subtitle="Consistency of wake-up times"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <SampleLineGraph
              title="Hydration vs Sleep"
              subtitle="Daily water intake vs sleep duration"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SleepInformation;
