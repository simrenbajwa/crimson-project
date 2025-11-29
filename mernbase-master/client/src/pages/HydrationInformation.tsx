import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  TextField,
  useTheme,
  CardHeader,
  CardContent,
} from "@mui/material";
import Plot from "react-plotly.js";

type Gender = "male" | "female" | "other";

type HydrationChartProps = {
  title: string;
  subtitle?: string;
  recommendedLiters: number;
  variant?: "planner" | "weekly";
};

const HydrationChart: React.FC<HydrationChartProps> = ({
  title,
  subtitle,
  recommendedLiters,
  variant = "planner",
}) => {
  const theme = useTheme();
  const PlotlyComponent: any = Plot;

  let x: string[] = [];
  let data: any[] = [];

  if (variant === "planner") {
    // Distribute recommended intake across the day (cumulative)
    x = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"];
    const perInterval = recommendedLiters / x.length;
    const cumulative = x.map((_, idx) =>
      Number((perInterval * (idx + 1)).toFixed(2))
    );

    data = [
      {
        x,
        y: cumulative,
        type: "scatter",
        mode: "lines+markers",
        name: "Cumulative intake",
        marker: { color: theme.palette.primary.main },
        line: { width: 3, color: theme.palette.primary.main },
        fill: "tozeroy",
        fillcolor:
          theme.palette.mode === "dark"
            ? "rgba(59,130,246,0.15)"
            : "rgba(37,99,235,0.15)",
      },
    ];
  } else {
    // Weekly: bars for actual vs target line
    x = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const base = recommendedLiters;
    const actual = x.map((_, idx) =>
      Number((base + (idx - 3) * 0.1).toFixed(2))
    );

    data = [
      {
        x,
        y: actual,
        type: "bar",
        name: "Actual (L)",
        marker: { color: theme.palette.primary.main },
      },
      {
        x,
        y: Array(x.length).fill(recommendedLiters),
        type: "scatter",
        mode: "lines",
        name: `Target (${recommendedLiters} L)`,
        line: {
          width: 2,
          dash: "dash",
          color: theme.palette.secondary.main,
        },
      },
    ];
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
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
          data={data}
          layout={{
            autosize: true,
            height: 280,
            margin: { t: 10, l: 50, r: 20, b: 40 },
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
              title: "Liters",
            },
            barmode: "group",
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

const HydrationInformation: React.FC = () => {
  const theme = useTheme();

  const [gender, setGender] = React.useState<Gender>("female");
  const [weight, setWeight] = React.useState<number>(60); // kg

  // heuristic (not medical advice)
  const mlPerKg =
    gender === "male" ? 40 : gender === "female" ? 35 : 33;
  const recommendedLiters = Number(((weight * mlPerKg) / 1000).toFixed(2));

  const handleWeightChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = Number(e.target.value);
    if (isNaN(val)) return;
    if (val < 20 || val > 200) return;
    setWeight(val);
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
              Hydration Insights
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: 600,
                color: "text.secondary",
              }}
            >
              Adjust your gender and weight to see how your recommended daily
              water intake changes, then explore how it can be spaced across
              the day and over the week.
            </Typography>
          </Box>

          {/* Controls */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            {/* Gender buttons */}
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant={gender === "female" ? "contained" : "outlined"}
                onClick={() => setGender("female")}
              >
                Female
              </Button>
              <Button
                size="small"
                variant={gender === "male" ? "contained" : "outlined"}
                onClick={() => setGender("male")}
              >
                Male
              </Button>
              <Button
                size="small"
                variant={gender === "other" ? "contained" : "outlined"}
                onClick={() => setGender("other")}
              >
                Other / Custom
              </Button>
            </Stack>

            {/* Weight + recommendation chip */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <TextField
                label="Weight (kg)"
                type="number"
                size="small"
                value={weight}
                onChange={handleWeightChange}
                inputProps={{ min: 20, max: 200, step: 1 }}
              />
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 999,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(125,211,252,0.08)"
                      : "rgba(37,99,235,0.06)",
                }}
              >
                <Typography
                  sx={{ fontSize: 13, fontWeight: 600, color: "primary.main" }}
                >
                  Recommended: {recommendedLiters} L / day
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* Charts */}
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          <Grid item xs={12} md={6}>
            <HydrationChart
              title="Daily Intake Planner"
              subtitle="Cumulative target across your day"
              recommendedLiters={recommendedLiters}
              variant="planner"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <HydrationChart
              title="Weekly Intake vs Target"
              subtitle="Example week relative to your target"
              recommendedLiters={recommendedLiters}
              variant="weekly"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HydrationInformation;
