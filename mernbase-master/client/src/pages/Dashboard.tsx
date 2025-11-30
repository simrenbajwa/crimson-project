import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import Plot from "react-plotly.js";

const PlotlyComponent: any = Plot;

type Gender = "Male" | "Female";
type WeightCategory = "Lightweight" | "Open weight" | "All";

type BenchmarkRow = {
  distance: string;
  type: string;
  weightCategory?: "Lightweight" | "Open weight";
  gender: Gender;
  timeLabel: string; // e.g. "06:10.2" or "6:30s and under"
  seconds: number; // numeric approximation for chart
};

// Approximated numeric times for plotting
const BENCHMARKS: BenchmarkRow[] = [
  {
    distance: "2000m",
    type: "Olympic Rower",
    gender: "Male",
    weightCategory: "Open weight",
    timeLabel: "06:10.2",
    seconds: 6 * 60 + 10.2,
  },
  {
    distance: "2000m",
    type: "Olympic Rower",
    gender: "Female",
    weightCategory: "Open weight",
    timeLabel: "07:03.9",
    seconds: 7 * 60 + 3.9,
  },
  {
    distance: "2000m",
    type: "High School Novice Rower",
    gender: "Male",
    weightCategory: "Open weight",
    timeLabel: "07:40.9",
    seconds: 7 * 60 + 40.9,
  },
  {
    distance: "2000m",
    type: "High School Novice Rower",
    gender: "Female",
    weightCategory: "Open weight",
    timeLabel: "09:11.7",
    seconds: 9 * 60 + 11.7,
  },
  {
    distance: "2000m",
    type: "D1 Rower",
    gender: "Male",
    weightCategory: "Lightweight",
    timeLabel: "6:30s and under",
    seconds: 6 * 60 + 30, // ~6:30
  },
  {
    distance: "2000m",
    type: "D1 Rower",
    gender: "Female",
    weightCategory: "Lightweight",
    timeLabel: "under 7:35",
    seconds: 7 * 60 + 35, // ~7:35
  },
  {
    distance: "2000m",
    type: "D3 Rower",
    gender: "Male",
    weightCategory: "Lightweight",
    timeLabel: "6:40s and under",
    seconds: 6 * 60 + 40,
  },
  {
    distance: "2000m",
    type: "D3 Rower",
    gender: "Female",
    weightCategory: "Lightweight",
    timeLabel: "under 7:55",
    seconds: 7 * 60 + 55,
  },
  {
    distance: "2000m",
    type: "D1 Rower",
    gender: "Male",
    weightCategory: "Open weight",
    timeLabel: "6:10s and under",
    seconds: 6 * 60 + 10,
  },
  {
    distance: "2000m",
    type: "D1 Rower",
    gender: "Female",
    weightCategory: "Open weight",
    timeLabel: "low 7:20s and under",
    seconds: 7 * 60 + 20,
  },
  {
    distance: "2000m",
    type: "D3 Rower",
    gender: "Male",
    weightCategory: "Open weight",
    timeLabel: "mid 6:20s to 6:40",
    seconds: 6 * 60 + 30,
  },
  {
    distance: "2000m",
    type: "D3 Rower",
    gender: "Female",
    weightCategory: "Open weight",
    timeLabel: "mid 7:20s to 7:30s",
    seconds: 7 * 60 + 25,
  },
];

// Helper to format seconds back into mm:ss
const formatSeconds = (s: number): string => {
  const minutes = Math.floor(s / 60);
  const seconds = s - minutes * 60;
  const padded = seconds.toFixed(1).padStart(4, "0");
  return `${minutes}:${padded}`;
};

const Dashboard: React.FC = () => {
  const theme = useTheme();

  const [gender, setGender] = React.useState<Gender>("Female");
  const [weightCategory, setWeightCategory] =
    React.useState<WeightCategory>("All");

  // TODO: later plug this in from user data
  const yourTimeSeconds = 7 * 60 + 30; // Example: 7:30 2k
  const yourTimeLabel = formatSeconds(yourTimeSeconds);

  const filtered = React.useMemo(
    () =>
      BENCHMARKS.filter((b) => {
        if (b.gender !== gender) return false;
        if (weightCategory === "All") return true;
        return b.weightCategory === weightCategory;
      }),
    [gender, weightCategory]
  );

  // Sort fastest -> slowest
  const sorted = [...filtered].sort((a, b) => a.seconds - b.seconds);

  // Find closest benchmark to the user
  const closest =
    sorted.length === 0
      ? undefined
      : sorted.reduce((prev, curr) =>
          Math.abs(curr.seconds - yourTimeSeconds) <
          Math.abs(prev.seconds - yourTimeSeconds)
            ? curr
            : prev
        );

  const fasterThan = sorted.filter((b) => yourTimeSeconds < b.seconds).length;
  const slowerThan = sorted.filter((b) => yourTimeSeconds > b.seconds).length;

  const xLabels = sorted.map(
    (b) => `${b.type}${b.weightCategory ? ` (${b.weightCategory})` : ""}`
  );
  const yTimes = sorted.map((b) => b.seconds);

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        minHeight: "100vh",
        bgcolor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : "linear-gradient(180deg, #eef2ff 0%, #f9fafb 40%, #f4f4f5 100%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: 0.2, mb: 1 }}
          >
            2000m Benchmark Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 640, color: "text.secondary" }}
          >
            Compare your 2000m time against online benchmarks for different
            rowing levels. See how far you are from Olympic, D1, and D3
            standards for your gender and weight category.
          </Typography>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Gender
            </Typography>
            <ToggleButtonGroup
              size="small"
              value={gender}
              exclusive
              onChange={(_, value) => value && setGender(value)}
            >
              <ToggleButton value="Female">Female</ToggleButton>
              <ToggleButton value="Male">Male</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Weight
            </Typography>
            <ToggleButtonGroup
              size="small"
              value={weightCategory}
              exclusive
              onChange={(_, value) => value && setWeightCategory(value)}
            >
              <ToggleButton value="All">All</ToggleButton>
              <ToggleButton value="Lightweight">Lightweight</ToggleButton>
              <ToggleButton value="Open weight">Open</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>

        <Grid container spacing={4}>
          {/* LEFT: chart */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardHeader
                title="Your 2k vs benchmarks"
                subheader={`2000m time comparison (${gender}${
                  weightCategory !== "All" ? ` • ${weightCategory}` : ""
                })`}
                action={
                  <Chip
                    label={`Your 2k: ${yourTimeLabel}`}
                    color="primary"
                    variant="outlined"
                  />
                }
                sx={{
                  "& .MuiCardHeader-title": { fontWeight: 700, fontSize: 16 },
                  "& .MuiCardHeader-subheader": { fontSize: 13 },
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <PlotlyComponent
                  data={[
                    {
                      x: xLabels,
                      y: yTimes,
                      type: "bar",
                      name: "Benchmark",
                      marker: { color: theme.palette.primary.light },
                      hovertemplate:
                        "%{x}<br>%{customdata}<extra>Benchmark</extra>",
                      customdata: sorted.map(
                        (b) => `${b.timeLabel} (${formatSeconds(b.seconds)})`
                      ),
                    },
                    {
                      x: [""],
                      y: [yourTimeSeconds],
                      type: "bar",
                      name: "You",
                      marker: { color: theme.palette.secondary.main },
                      width: 0.3,
                      hovertemplate: `Your 2k<br>${yourTimeLabel}<extra></extra>`,
                    },
                  ]}
                  layout={{
                    barmode: "group",
                    autosize: true,
                    height: 340,
                    margin: { t: 20, l: 70, r: 20, b: 90 },
                    paper_bgcolor: "transparent",
                    plot_bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : "#f9fafb",
                    font: { color: theme.palette.text.primary },
                    xaxis: {
                      title: "",
                      tickangle: -30,
                      automargin: true,
                    },
                    yaxis: {
                      title: "Seconds (lower is faster)",
                      gridcolor: theme.palette.divider,
                      zeroline: false,
                    },
                    legend: { orientation: "h", x: 0, y: 1.15 },
                  }}
                  style={{ width: "100%", height: "100%" }}
                  config={{ displayModeBar: false, responsive: true }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT: summary / “how far away” */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                height: "100%",
              }}
            >
              <CardHeader
                title="Where you stand"
                sx={{
                  "& .MuiCardHeader-title": { fontWeight: 700, fontSize: 16 },
                }}
              />
              <CardContent>
                {closest ? (
                  <>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      Against{" "}
                      <strong>
                        {closest.type}
                        {closest.weightCategory
                          ? ` (${closest.weightCategory})`
                          : ""}
                      </strong>{" "}
                      benchmarks for {gender.toLowerCase()} rowers:
                    </Typography>

                    <Stack spacing={1.2} sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        • Benchmark:{" "}
                        <strong>
                          {closest.timeLabel} (
                          {formatSeconds(closest.seconds)})
                        </strong>
                      </Typography>
                      <Typography variant="body2">
                        • You: <strong>{yourTimeLabel}</strong>
                      </Typography>
                      <Typography variant="body2">
                        • Gap:{" "}
                        <strong>
                          {Math.abs(
                            closest.seconds - yourTimeSeconds
                          ).toFixed(1)}{" "}
                          seconds
                        </strong>{" "}
                        {yourTimeSeconds <= closest.seconds
                          ? "faster"
                          : "slower"}{" "}
                        than that benchmark.
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      sx={{ mb: 2, color: "text.secondary" }}
                    >
                      Within the benchmarks you’re viewing:
                    </Typography>

                    <Stack spacing={0.6}>
                      <Typography variant="body2">
                        • You are faster than{" "}
                        <strong>{fasterThan} benchmark(s)</strong>.
                      </Typography>
                      <Typography variant="body2">
                        • You are slower than{" "}
                          <strong>{slowerThan} benchmark(s)</strong>.
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(34,197,94,0.12)"
                            : "rgba(16,185,129,0.08)",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        “This far away” in plain language
                      </Typography>
                      <Typography variant="body2">
                        You’re{" "}
                        <strong>
                          {Math.abs(
                            closest.seconds - yourTimeSeconds
                          ).toFixed(1)}{" "}
                          seconds
                        </strong>{" "}
                        from rowing at{" "}
                        <strong>
                          {closest.type.toLowerCase()}
                        </strong>{" "}
                        speed over 2000m for this category.
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2">
                    No benchmarks available for the current filters.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
