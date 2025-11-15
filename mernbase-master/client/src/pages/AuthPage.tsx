import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type Mode = "login" | "signup";

const API_BASE =
  process.env.REACT_APP_API_URL?.trim() ||
  "http://localhost:5000";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const AuthPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const qs = useQuery();

  const initialMode = (qs.get("mode") === "signup" ? "signup" : "login") as Mode;
  const [mode, setMode] = useState<Mode>(initialMode);

  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // signup only
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("mode", mode);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
  }, [mode]);

  const title = mode === "login" ? "Welcome back" : "Create your account";
  const subtitle =
    mode === "login"
      ? "Log in to continue."
      : "Sign up to get started.";

  const validate = () => {
    if (!email || !email.includes("@")) return "Please enter a valid email.";
    if (mode === "signup" && name.trim().length < 2) return "Please enter your full name.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      const url =
        mode === "login"
          ? `${API_BASE}/api/auth/login`
          : `${API_BASE}/api/auth/signup`;

      const payload =
        mode === "login"
          ? { email, password, remember }
          : { name, email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "Request failed.";
        try {
          const data = await res.json();
          msg = data?.message || data?.error || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();

      if (data?.token) {
        if (remember) localStorage.setItem("token", data.token);
        else sessionStorage.setItem("token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setSuccessMsg(mode === "login" ? "Logged in successfully." : "Account created successfully.");
      setTimeout(() => navigate("/"), 600);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const FormCard = (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: 750,
        alignContent:"center",
        mx: "auto",
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backdropFilter: "blur(6px)",
      }}
      component="form"
      onSubmit={handleSubmit}
      noValidate
    
    >
      <Stack spacing={2.5}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate("/")} size="small" aria-label="Back to home">
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="overline" color="text.secondary">Back</Typography>
        </Stack>

        <Typography variant="h4" fontWeight={800}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        {mode === "signup" && (
          <TextField
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <TextField
          label="Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((s) => !s)}
                  edge="end"
                >
                  {showPw ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {mode === "login" && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <FormControlLabel
              control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
              label="Remember me"
            />
            <Link component="button" underline="hover" onClick={() => alert("Hook up your reset flow.")}>
              Forgot password?
            </Link>
          </Stack>
        )}

        <Button type="submit" variant="contained" size="large" disabled={submitting}>
          {submitting ? (mode === "login" ? "Logging in..." : "Creating account...") : (mode === "login" ? "Log in" : "Sign up")}
        </Button>

        <Typography textAlign="center" color="text.secondary">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link component="button" onClick={() => setMode("signup")}>
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link component="button" onClick={() => setMode("login")}>
                Log in
              </Link>
            </>
          )}
        </Typography>
      </Stack>
    </Paper>
  );

  return (
    // Give the page enough vertical space so the footer sits at the end,
    // while the auth section feels centered (no “footer immediately under cards”).
    <Box sx={{ minHeight: { xs: "auto", md: "100svh" }, display: "grid", alignContent: "center" }}>
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          // keep layout narrower on huge screens so it doesn't look sparse
          sx={{ maxWidth: 1200, mx: "auto" }}
        >
          {/* Form */}
          <Grid item xs={12} sm={8} md={6} lg={5} display="flex">
            <Box sx={{ width: "100%", display: "grid", alignContent: "center" }}>
              {FormCard}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthPage;
