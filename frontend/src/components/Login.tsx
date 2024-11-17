import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Button from '@mui/material/Button';

function Login() {
    const [login, setLogin] = useState(""); // Login (username) input
    const [password, setPassword] = useState(""); // Password input
    const [firstName, setFirstName] = useState(""); // First name for registration
    const [lastName, setLastName] = useState(""); // Last name for registration
    const [isRegister, setIsRegister] = useState(false); // Toggle between login and register forms
    const [message, setMessage] = useState(""); // Message to display feedback (success or error)

    const navigate = useNavigate(); // Initialize the useNavigate hook

    function buildPath(route: string): string {
        return process.env.NODE_ENV === "development"
            ? `http://localhost:5000${route}`
            : route;
    }

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const user = { login, password };
        try {
            const response = await fetch(buildPath("/api/login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            if (response.ok && !data.error) {
                setMessage("Login successful!");
                navigate("/home");
            } else {
                setMessage(data.error || "Invalid credentials");
            }
        } catch (error) {
            setMessage("Error logging in");
        }
    }

    async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newUser = { login, password, firstName, lastName };
        try {
            const response = await fetch(buildPath("/api/register"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setMessage("Registration successful! You can now log in.");
                setIsRegister(false);
            } else {
                setMessage(data.error || "Registration failed");
            }
        } catch (error) {
            setMessage("Error during registration");
        }
    }

    return (
        <div
            style={{
                background: "#64FCD9", // Subtle background color for the whole page
            }}
        >
            <div
                style={{
                    maxWidth: "400px",
                    margin: "auto",
                    padding: "2rem",
                    background: "#fff", // White background for the login box
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for separation
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <h2>{isRegister ? "Register" : "Login"}</h2>
                <form onSubmit={isRegister ? handleRegister : handleLogin}>
                    {isRegister && (
                        <>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        marginTop: "0.5rem",
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        marginTop: "0.5rem",
                                    }}
                                />
                            </div>
                        </>
                    )}
                    <div style={{ marginBottom: "1rem" }}>
                        <label>Login</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.5rem",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.5rem",
                            }}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: "#4CAF50", // Custom background color
                            color: "#fff", // Text color
                            "&:hover": {
                                backgroundColor: "#45a049", // Hover effect
                            },
                            width: "100%",
                            padding: "0.5rem",
                        }}
                    >
                        {isRegister ? "Register" : "Login"}
                    </Button>
                </form>
                <p style={{ marginTop: "1rem" }}>{message}</p>
                <Button
                    onClick={() => {
                        setIsRegister(!isRegister);
                        setMessage(""); // Clear message when switching forms
                    }}
                    variant="text"
                    color="primary"
                    style={{ marginTop: "1rem" }}
                >
                    {isRegister
                        ? "Already have an account? Login"
                        : "Don't have an account? Register"}
                </Button>
            </div>
        </div>
    );
}

export default Login;

