// src/pages/AuthPage.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
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

import api from "../services/api";

type Mode = "login" | "signup";

interface AuthUser {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  [key: string]: any;
}

interface AuthResponse {
  message?: string;
  error?: string;
  user?: AuthUser;
}

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // keep mode in URL (?mode=login/signup)
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

  const validate = useCallback((): string | null => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      return "Please enter a valid email address.";
    }
    if (mode === "signup") {
      if (!firstName.trim()) return "Please enter your first name.";
      if (!lastName.trim()) return "Please enter your last name.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  }, [email, password, firstName, lastName, mode]);

  const persistUser = (user?: AuthUser) => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSuccessMsg(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "signup") {
        const payload = { firstName, lastName, email, password };
        const res = await api.post<AuthResponse>("/api/auth/signup", payload);
        persistUser(res.data.user);
        setSuccessMsg(res.data.message || "Account created successfully.");
      } else {
        const payload = { email, password };
        const res = await api.post<AuthResponse>("/api/auth/login", payload);
        persistUser(res.data.user);

        // “Remember me” can be used for token later; for now we just keep user
        if (!remember) {
          // if you later add tokens, you can put them in sessionStorage here
        }

        setSuccessMsg(res.data.message || "Logged in successfully.");
      }

      setTimeout(() => navigate("/"), 600);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleMode = (nextMode: Mode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setError(null);
    setSuccessMsg(null);
    setPassword("");
  };

  const FormCard = (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        maxWidth: 750,
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
          <IconButton
            onClick={() => navigate("/")}
            size="small"
            aria-label="Back to home"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography variant="overline" color="text.secondary">
            Back
          </Typography>
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
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              required
              fullWidth
              disabled={submitting}
            />
            <TextField
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              required
              fullWidth
              disabled={submitting}
            />
          </Stack>
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          fullWidth
          disabled={submitting}
        />

        <TextField
          label="Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          fullWidth
          disabled={submitting}
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={submitting}
                />
              }
              label="Remember me"
            />
            <Link
              component="button"
              underline="hover"
              onClick={() => alert("Hook up your reset flow.")}
              disabled={submitting}
            >
              Forgot password?
            </Link>
          </Stack>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          fullWidth
        >
          {submitting
            ? mode === "login"
              ? "Logging in..."
              : "Creating account..."
            : mode === "login"
            ? "Log in"
            : "Sign up"}
        </Button>

        <Typography textAlign="center" color="text.secondary">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link component="button" onClick={() => handleToggleMode("signup")}>
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link component="button" onClick={() => handleToggleMode("login")}>
                Log in
              </Link>
            </>
          )}
        </Typography>
      </Stack>
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "100svh" },
        display: "grid",
        alignContent: "center",
      }}
    >
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{ maxWidth: 1200, mx: "auto" }}
        >
          <Grid item xs={12} sm={8} md={6} lg={5} display="flex">
            <Box
              sx={{ width: "100%", display: "grid", alignContent: "center" }}
            >
              {FormCard}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthPage;
