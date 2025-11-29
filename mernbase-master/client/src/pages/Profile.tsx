import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  TextField,
  Stack,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

type Gender = "male" | "female" | "other" | "";

type UserProfile = {
  email: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
  age?: number | null;
  weight?: number | null;
};

type ProfilePageProps = {
  user?: UserProfile; // ← MADE OPTIONAL
  onSubmit?: (updated: UserProfile) => void;
};

const Profile: React.FC<ProfilePageProps> = ({ user, onSubmit }) => {
  const theme = useTheme();

  // fallback user if none is passed
  const safeUser: UserProfile = user ?? {
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    age: null,
    weight: null,
  };

  const [gender, setGender] = React.useState<Gender>(safeUser.gender ?? "");
  const [age, setAge] = React.useState<string>(
    safeUser.age != null ? String(safeUser.age) : ""
  );
  const [weight, setWeight] = React.useState<string>(
    safeUser.weight != null ? String(safeUser.weight) : ""
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const fullName =
    `${safeUser.firstName} ${safeUser.lastName}`.trim() || "User";

  const parsedWeight = Number(weight);
  const mlPerKg =
    gender === "male" ? 40 : gender === "female" ? 35 : gender === "other" ? 33 : 0;
  const hydrationLiters =
    !isNaN(parsedWeight) && parsedWeight > 20 && mlPerKg > 0
      ? Number(((parsedWeight * mlPerKg) / 1000).toFixed(2))
      : null;

  const handleSave = () => {
    setIsSaving(true);

    const updated: UserProfile = {
      ...safeUser,
      gender,
      age: age ? Number(age) : undefined,
      weight: weight ? Number(weight) : undefined,
    };

    onSubmit?.(updated);

    setTimeout(() => setIsSaving(false), 400);
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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Profile
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 520, color: "text.secondary" }}>
            Add your gender, age, and weight to get more accurate Hydrow insights.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* LEFT FORM */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
                    <PersonIcon />
                  </Avatar>
                }
                title={<Typography variant="h6" fontWeight={700}>Account Details</Typography>}
                subheader={
                  <Typography variant="body2" color="text.secondary">
                    Basic info from signup + your additional health data.
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {/* Signup-only data */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First name"
                      value={safeUser.firstName}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last name"
                      value={safeUser.lastName}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      value={safeUser.email}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  {/* Editable data */}
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="gender">Gender</InputLabel>
                      <Select
                        labelId="gender"
                        value={gender}
                        label="Gender"
                        onChange={(e) => setGender(e.target.value as Gender)}
                      >
                        <MenuItem value="">Prefer not to say</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Age"
                      type="number"
                      size="small"
                      fullWidth
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      size="small"
                      fullWidth
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={handleSave}
                        disabled={isSaving}
                        sx={{ px: 4, borderRadius: 999 }}
                      >
                        {isSaving ? "Saving..." : "Save changes"}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT SUMMARY */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  Summary
                </Typography>

                <Typography variant="body1" mb={2}>{fullName}</Typography>

                <Stack spacing={1}>
                  <Typography variant="body2">Email: <strong>{safeUser.email}</strong></Typography>
                  <Typography variant="body2">
                    Gender: <strong>{gender || "Not set"}</strong>
                  </Typography>
                  <Typography variant="body2">Age: <strong>{age || "Not set"}</strong></Typography>
                  <Typography variant="body2">
                    Weight: <strong>{weight ? `${weight} kg` : "Not set"}</strong>
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(59,130,246,0.08)",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                    Hydration Preview
                  </Typography>

                  {hydrationLiters ? (
                    <Typography variant="body2">
                      Estimated target: <strong>{hydrationLiters} L/day</strong>.
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Add gender & weight to show your hydration target.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
