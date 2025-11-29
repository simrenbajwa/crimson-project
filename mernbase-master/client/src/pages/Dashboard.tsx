import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";

type PlaceholderProps = { height?: number };

const Placeholder: React.FC<PlaceholderProps> = ({ height = 200 }) => (
  <Paper
    elevation={2}
    sx={{
      height,
      backgroundColor: "#bdbdbd",
      borderRadius: 1,
    }}
  />
);

type SectionProps = { title: string; children?: React.ReactNode };

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
      {title}
    </Typography>
    {children}
  </Box>
);

type StackedPlaceholdersProps = { count?: number };

const StackedPlaceholders: React.FC<StackedPlaceholdersProps> = ({ count = 4 }) => (
  <Grid container spacing={2}>
    {Array.from({ length: count }).map((_, i) => (
      <Grid item xs={12} key={i}>
        <Placeholder height={60} />
      </Grid>
    ))}
  </Grid>
);

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      {/* Benchmark Section */}
      <Section title="Benchmark">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Placeholder height={250} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Placeholder height={250} />
          </Grid>
        </Grid>
      </Section>
    </Box>
  );
};

export default Dashboard;
