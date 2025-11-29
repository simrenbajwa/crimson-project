import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Fade,
  Zoom,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import InsightsIcon from "@mui/icons-material/Insights";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const Section: React.FC<
  React.PropsWithChildren<{ id: string; bg?: string }>
> = ({ id, bg, children }) => (
  <Box
    id={id}
    component="section"
    sx={{
      minHeight: "100svh",
      display: "grid",
      alignContent: "center",
      position: "relative",
      bgcolor: bg || "transparent",
      py: { xs: 6, md: 10 },
    }}
  >
    {children}
  </Box>
);

const Home: React.FC = () => {
  const theme = useTheme();
  const [infoVisible, setInfoVisible] = React.useState(false);

  React.useEffect(() => {
    // Simple mount animation for the info section
    const timer = setTimeout(() => setInfoVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      {/* HERO SECTION */}
      <Box
        sx={{
          backgroundImage:
            'url("https://150299151.v2.pressablecdn.com/wp-content/uploads/2021/06/2021-06-08_NTwomen_013-13-scaled.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: { xs: "70vh", md: "90vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          position: "relative",
          px: { xs: 2, sm: 3, md: 0 },
        }}
      >
        {/* Optional dark overlay for readability */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.35)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            maxWidth: { xs: "100%", sm: "80%", md: "60%" },
          }}
        >
          <Typography
            fontWeight={700}
            sx={{
              mb: 3,
              fontSize: { xs: 26, sm: 32, md: 40 },
              lineHeight: 1.2,
              color: "white",
            }}
          >
            Hydrow: Information about Hydration at Your Fingertips
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              component={Link}
              to="/auth?mode=signup"
              variant="contained"
              color="primary"
              sx={{
                mt: { xs: 1, sm: 2, md: 3 },
                bgcolor: "#123379ff",
                px: { xs: 3, sm: 4, md: 5 },
                py: { xs: 1.2, md: 1.5 },
                fontSize: { xs: 16, sm: 18, md: 20 },
                borderRadius: 999,
                "&:hover": { bgcolor: "#06164bff" },
              }}
            >
              Get Started
            </Button>

            <Button
              variant="text"
              onClick={() => scrollTo("info")}
              sx={{
                mt: { xs: 0, sm: 2, md: 3 },
                color: "white",
                fontSize: { xs: 14, sm: 16 },
                textDecoration: "underline",
              }}
            >
              Learn more
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* INFO SECTION */}
      <Box
        id="info"
        sx={{
          bgcolor: theme.palette.mode === "dark" ? "background.default" : "#f9fafb",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 5, md: 7 },
        }}
      >
        <Fade in={infoVisible} timeout={700}>
          <Container maxWidth="lg">
            {/* Top text */}
            <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 20, md: 26 },
                  mb: 1,
                }}
              >
                What is Hydrow used for?
              </Typography>
              <Typography
                sx={{
                  maxWidth: 600,
                  mx: "auto",
                  fontSize: { xs: 14, sm: 15 },
                  color: "text.secondary",
                }}
              >
                Hydrow helps you understand how much water your body actually
                needs, track what you drink, and see how your hydration links
                with your daily life — energy, sleep, focus, and more.
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* WHAT IT'S USED FOR */}
              <Grid item xs={12} md={6}>
                <Zoom in={infoVisible} style={{ transitionDelay: infoVisible ? "150ms" : "0ms" }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      p: { xs: 2.5, md: 3 },
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 16, md: 18 },
                        mb: 2,
                      }}
                    >
                      What the website is used for
                    </Typography>

                    <Stack spacing={2.5}>
                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "primary.light",
                            flexShrink: 0,
                          }}
                        >
                          <LocalDrinkIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>
                            Understand your hydration needs
                          </Typography>
                          <Typography
                            fontSize={13}
                            color="text.secondary"
                          >
                            Get a daily target based on your body, routine, and goals,
                            instead of a generic “8 glasses” rule.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "secondary.light",
                            flexShrink: 0,
                          }}
                        >
                          <QueryStatsIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>
                            Visualize trends over time
                          </Typography>
                          <Typography
                            fontSize={13}
                            color="text.secondary"
                          >
                            See how your hydration changes across days and weeks,
                            and how it correlates with sleep or energy.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "success.light",
                            flexShrink: 0,
                          }}
                        >
                          <NotificationsActiveIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>
                            Stay on track during the day
                          </Typography>
                          <Typography
                            fontSize={13}
                            color="text.secondary"
                          >
                            Get nudges when you’re falling behind your goal so you
                            don’t have to think about it constantly.
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card>
                </Zoom>
              </Grid>

              {/* WHAT YOU CAN DO */}
              <Grid item xs={12} md={6}>
                <Zoom in={infoVisible} style={{ transitionDelay: infoVisible ? "250ms" : "0ms" }}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      p: { xs: 2.5, md: 3 },
                      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: 16, md: 18 },
                        mb: 2,
                      }}
                    >
                      What you can do on Hydrow
                    </Typography>

                    <Stack spacing={2.5}>
                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "info.light",
                            flexShrink: 0,
                          }}
                        >
                          <InsightsIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>
                            Log your daily water intake
                          </Typography>
                          <Typography
                            fontSize={13}
                            color="text.secondary"
                          >
                            Quickly add glasses, bottles, or custom amounts so your
                            dashboard stays up to date.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "warning.light",
                            flexShrink: 0,
                          }}
                        >
                          <QueryStatsIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>
                            Explore detailed charts
                          </Typography>
                          <Typography
                            fontSize={13}
                            color="text.secondary"
                          >
                            Switch between daily, weekly, and monthly views to spot
                            patterns and adjust your routine.
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "primary.light",
                            flexShrink: 0,
                          }}
                        >
                          <NotificationsActiveIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>
                            Set goals & reminders
                          </Typography>
                          <Typography
                            fontSize={13}
                            color="text.secondary"
                          >
                            Customize your daily target and reminder schedule so it fits
                            your real life, not the other way around.
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card>
                </Zoom>
              </Grid>
            </Grid>
          </Container>
        </Fade>
      </Box>
    </Box>
  );
};

export default Home;