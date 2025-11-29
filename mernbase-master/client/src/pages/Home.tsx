import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

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
      minHeight: "100svh", // full viewport height with mobile-safe unit
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
  return (
    <Box>
      <Box
        sx={{
          backgroundImage:
            'url("https://150299151.v2.pressablecdn.com/wp-content/uploads/2021/06/2021-06-08_NTwomen_013-13-scaled.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          fontSize: 16,
          position: "relative",
        }}
      >
        <Typography fontWeight={700} fontSize={40} sx={{ mb: 3, marginTop: -20, color: "black" }}>
          Hydrow: Information about Hydration at Your Fingertips
        </Typography>
        
        <Button
          component={Link}
          to="/auth?mode=signup"
          variant="contained"
          color="primary"
          sx={{
            position: "absolute",
            alignItems: "center",
            bgcolor: "#123379ff",
            padding: "20px 36px",
            fontSize: 20,
            "&:hover": { bgcolor: "#06164bff" },
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* INFO SECTION */}
      <Box sx={{ bgcolor: "white", px: 4, py: 5 }}>
        <Typography fontWeight={700} fontSize={14} sx={{ mb: 3 }}>
          Information about the website and whatever
        </Typography>

        <Container maxWidth="md">
          <Box
            sx={{
              bgcolor: "#e8e8e8",
              height: "auto",
              mb: 2,
              p: 2,
              borderRadius: 1,
            }}
          >
            Placeholder text goes here. Lorem ipsum dolor sit amet.
          </Box>
          <Box
            sx={{
              bgcolor: "#e8e8e8",
              height: "auto",
              mb: 2,
              p: 2,
              borderRadius: 1,
            }}
          >
            More placeholder information about the website.
          </Box>
          <Box
            sx={{
              bgcolor: "#e8e8e8",
              height: "auto",
              p: 2,
              borderRadius: 1,
            }}
          >
            Additional placeholder text describing features or content.
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
