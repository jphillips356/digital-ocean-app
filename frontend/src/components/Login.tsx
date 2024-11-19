import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", monospace',
  },
  palette: {
    primary: {
      main: "#000", // Adjust primary color here
    },
    background: {
      default: "transparent",
    },
  },
});

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function buildPath(route: string): string {
    return process.env.NODE_ENV === "development"
      ? `http://localhost:5000${route}`
      : route;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const endpoint = isRegister ? "/api/register" : "/api/login";
    const userData = isRegister
      ? { login, password, firstName, lastName }
      : { login, password };

    try {
      const response = await fetch(buildPath(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok && (data.success || !data.error)) {
        setMessage(
          isRegister
            ? "Registration successful! You can now log in."
            : "Login successful!"
        );
        if (!isRegister) navigate("/home");
        if (isRegister) setIsRegister(false);
      } else {
        setMessage(
          data.error || (isRegister ? "Registration failed" : "Invalid credentials")
        );
      }
    } catch (error) {
      setMessage(isRegister ? "Error during registration" : "Error logging in");
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "stretch",
          backgroundImage: "url('../background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="xl" sx={{ p: 0 }}>
          <Grid container sx={{ minHeight: "100vh" }}>
            {/* Left side - Image */}
            <Grid item xs={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 4,
                }}
              >
                <img
                  src="../home-screen.png"
                  alt="Workspace"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>

            {/* Right side - Login Form */}
            <Grid item xs={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 4,
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    width: "100%",
                    maxWidth: "400px",
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    padding: "2rem",
                    borderRadius: "8px",
                  }}
                >
                  {isRegister && (
                    <>
                      <TextField
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        InputProps={{ style: { fontSize: "0.9rem" } }}
                      />
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        InputProps={{ style: { fontSize: "0.9rem" } }}
                      />
                    </>
                  )}
                  <TextField
                    required
                    fullWidth
                    id="login"
                    label="Username or Email"
                    name="login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{ style: { fontSize: "0.9rem" } }}
                  />
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{ style: { fontSize: "0.9rem" } }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      fontSize: "0.9rem",
                      py: 1.5,
                      mt: 2,
                      mb: 2,
                      backgroundColor: "#69FCD9",
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    {isRegister ? "Register" : "Sign In"}
                  </Button>
                  {message && (
                    <Typography
                      color="error"
                      align="center"
                      sx={{ mt: 1, mb: 1 }}
                    >
                      {message}
                    </Typography>
                  )}
                  <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    mt: 2,
  }}
>
  <Button
    variant="outlined"
    onClick={() => {
      setIsRegister(!isRegister);
      setMessage("");
    }}
    sx={{
      width: "100%", // Extend the button to full width
      fontSize: "0.9rem",
      textTransform: "none",
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: theme.palette.primary.dark,
      },
    }}
  >
    {isRegister ? "Login" : "Register"}
  </Button>
</Box>

                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
