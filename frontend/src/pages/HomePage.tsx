// homepage.tsx
import React from "react";
import Home from "../components/Home";

const Homepage: React.FC = () => {
    return (
        <div style={{ padding: "1rem" }}>
            <h1>Welcome to the Habit Tracker</h1>
            <Home />
        </div>
    );
};

export default Homepage;
