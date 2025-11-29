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

type TimeRange = "7d" | "30d" | "90d";

type SampleLineGraphProps = {
  title: string;
  subtitle?: string;
  x: string[];
  y: number[];
  yLabel?: string;
  type?: "line" | "bar";
};

const PlotlyComponent: any = Plot;

/* ------------ Data helpers ------------ */

const generateDays = (range: TimeRange): string[] => {
  if (range === "7d") {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  }
  const length = range === "30d" ? 30 : 90;
  return Array.from({ length }, (_, i) => `Day ${i + 1}`);
};

const generateSleepDuration = (range: TimeRange): number[] => {
  const len = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const base = 7;
  return Array.from({ length: len }, (_, i) =>
    Number((base + Math.sin(i / 3) * 0.7 + (i % 4) * 0.15).toFixed(2))
  );
};

const generateBedtimeOffset = (range: TimeRange): number[] => {
  const len = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  // difference from target bedtime in hours (-1 to +1)
  return Array.from({ length: len }, (_, i) =>
    Number((Math.sin(i / 2.5) * 0.8).toFixed(2))
  );
};

const generateWakeVariability = (range: TimeRange): number[] => {
  const len = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  // variability in hours (0 to 2)
  return Array.from({ length: len }, (_, i) =>
    Number((1 + Math.cos(i / 3) * 0.6).toFixed(2))
  );
};

const generateSleepQualityHeatmap = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const blocks = [
    "10pm–12am",
    "12am–2am",
    "2am–4am",
    "4am–6am",
    "6am–8am",
    "8am–10am",
    "10am–12pm",
    "12pm–2pm",
  ];

  const z = days.map((_, dayIdx) =>
    blocks.map((__, blockIdx) => {
      const base = 3.5 + Math.sin(dayIdx / 2) * 0.8;
      const noise = (blockIdx % 3) * 0.2;
      return Number(Math.max(1, Math.min(5, base - noise)).toFixed(2));
    })
  );

  return { days, blocks, z };
};

/* ------------ Generic chart component ------------ */

const SampleLineGraph: React.FC<SampleLineGraphProps> = ({
  title,
  subtitle,
  x,
  y,
  yLabel,
  type = "line",
}) => {
  const theme = useTheme();

  const trace =
    type === "bar"
      ? {
          x,
          y,
          type: "bar" as const,
          marker: { color: theme.palette.primary.main },
        }
      : {
          x,
          y,
          type: "scatter" as const,
          mode: "lines+markers",
          marker: { color: theme.palette.primary.main },
          line: { width: 3, color: theme.palette.primary.main },
        };

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
          data={[trace]}
          layout={{
            autosize: true,
            height: 280,
            margin: { t: 10, l: 50, r: 10, b: 40 },
            paper_bgcolor: "transparent",
            plot_bgcolor:
              theme.palette.mode === "dark"
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
              title: yLabel,
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

/* ------------ Heatmap component ------------ */

const SleepQualityHeatmap: React.FC = () => {
  const theme = useTheme();
  const { days, blocks, z } = generateSleepQualityHeatmap();

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
        title="Sleep Quality Heatmap"
        subheader="Subjective quality across nights and time blocks (1–5)"
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
              z,
              x: blocks,
              y: days,
              type: "heatmap",
              colorscale: "Blues",
              colorbar: { title: "Quality" },
              hovertemplate:
                "%{y}<br>%{x}<br>Quality: %{z}<extra></extra>",
            },
          ]}
          layout={{
            autosize: true,
            height: 280,
            margin: { t: 10, l: 70, r: 20, b: 70 },
            paper_bgcolor: "transparent",
            plot_bgcolor:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : "#f9fafb",
            font: {
              color: theme.palette.text.primary,
            },
            xaxis: {
              tickangle: -45,
            },
            yaxis: {
              automargin: true,
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

/* ------------ Page component ------------ */

const SleepInformation: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = React.useState<TimeRange>("7d");
  const [view, setView] = React.useState<
    "overview" | "quality" | "hydration"
  >("overview"); // keep type but repurpose label

  const days = React.useMemo(() => generateDays(timeRange), [timeRange]);
  const sleepDuration = React.useMemo(
    () => generateSleepDuration(timeRange),
    [timeRange]
  );
  const bedtimeOffset = React.useMemo(
    () => generateBedtimeOffset(timeRange),
    [timeRange]
  );
  const wakeVariability = React.useMemo(
    () => generateWakeVariability(timeRange),
    [timeRange]
  );

  const renderCharts = () => {
    if (view === "quality") {
      return (
        <>
          <Grid item xs={12} md={6}>
            <SampleLineGraph
              title="Sleep Duration"
              subtitle="Average hours slept per night"
              x={days}
              y={sleepDuration}
              yLabel="Hours"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SleepQualityHeatmap />
          </Grid>
        </>
      );
    }

    if (view === "hydration") {
      // repurposed as "Sleep Rhythm"
      return (
        <>
          <Grid item xs={12} md={6}>
            <SampleLineGraph
              title="Sleep Duration"
              subtitle="Total hours per night"
              x={days}
              y={sleepDuration}
              yLabel="Hours"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SampleLineGraph
              title="Wake-up Time Variability"
              subtitle="Difference from your usual wake time"
              x={days}
              y={wakeVariability}
              yLabel="Hours"
              type="bar"
            />
          </Grid>
        </>
      );
    }

    // overview
    return (
      <>
        <Grid item xs={12} md={6}>
          <SampleLineGraph
            title="Sleep Duration"
            subtitle="Average hours slept per night"
            x={days}
            y={sleepDuration}
            yLabel="Hours"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SampleLineGraph
            title="Bedtime Consistency"
            subtitle="Offset from target bedtime"
            x={days}
            y={bedtimeOffset}
            yLabel="Hours from target"
            type="bar"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SampleLineGraph
            title="Wake-up Variability"
            subtitle="How much your wake time moves"
            x={days}
            y={wakeVariability}
            yLabel="Hours"
          />
        </Grid>
      </>
    );
  };

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
              Sleep Insights
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 520,
                color: theme.palette.text.secondary,
              }}
            >
              Track how your sleep duration, bedtime consistency, and wake-up
              rhythm change over time. Use the filters to explore different
              ranges and angles.
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
                Sleep Rhythm
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
          {renderCharts()}
        </Grid>
      </Container>
    </Box>
  );
};

export default SleepInformation;
