
// import React, { useState, useEffect } from "react";

// function Home() {
//     const [habits, setHabits] = useState([]);
//     const [habitName, setHabitName] = useState("");
//     const [measurementType, setMeasurementType] = useState("");
//     const [measurementUnit, setMeasurementUnit] = useState("");
//     const [frequency, setFrequency] = useState(""); // New state for frequency
//     const [targetCount, setTargetCount] = useState(""); // New state for target count

//     useEffect(() => {
//         fetchHabits();
//     }, []);

//     async function fetchHabits() {
//         try {
//             const response = await fetch("/api/habits");
//             const data = await response.json();
//             setHabits(data);
//         } catch (error) {
//             console.error("Failed to fetch habits:", error);
//         }
//     }

//     function buildPath(route: string): string {
//         return process.env.NODE_ENV === "development"
//             ? `http://localhost:5000${route}`
//             : route;
//     }

//     async function handleCreateHabit(event: React.FormEvent<HTMLFormElement>) {
//         event.preventDefault();

//         const newHabit = {
//             name: habitName,
//             measurementType: `${measurementType} - ${measurementUnit}`,
//             frequency,
//             targetCount: parseInt(targetCount, 10),
//         };

//         try {
//             const response = await fetch(buildPath("/api/habits"), {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(newHabit),
//             });
//             if (response.ok) {
//                 fetchHabits();
//                 setHabitName("");
//                 setMeasurementType("");
//                 setMeasurementUnit("");
//                 setFrequency("");
//                 setTargetCount("");
//             } else {
//                 console.error("Failed to create habit");
//             }
//         } catch (error) {
//             console.error("Error creating habit:", error);
//         }
//     }

//         // Handle habit deletion
//     async function handleDeleteHabit(id: string) {
//         try {
//             const response = await fetch(buildPath(`/api/habits/${id}`), {
//                 method: "DELETE",
//             });
//             if (response.ok) {
//                 fetchHabits();
//             } else {
//                 console.error("Failed to delete habit");
//             }
//         } catch (error) {
//             console.error("Error deleting habit:", error);
//         }
//     }

//     const measurementOptions: { [key: string]: string[] } = {
//         distance: ["Miles", "Kilometers"],
//         time: ["Seconds", "Minutes", "Hours"],
//         weight: ["Pounds", "Ounces", "Grams"],
//         amount: ["Fluid Ounces"],
//     };

//     return (
//         <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
//             <h2>Create a Habit</h2>
//             <form onSubmit={handleCreateHabit} style={{ marginBottom: "1rem" }}>
//                 <div style={{ marginBottom: "1rem" }}>
//                     <label>Habit Name</label>
//                     <input
//                         type="text"
//                         value={habitName}
//                         onChange={(e) => setHabitName(e.target.value)}
//                         required
//                         style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: "1rem" }}>
//                     <label>Measurement Type</label>
//                     <select
//                         value={measurementType}
//                         onChange={(e) => {
//                             setMeasurementType(e.target.value);
//                             setMeasurementUnit("");
//                         }}
//                         required
//                         style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
//                     >
//                         <option value="">Select Measurement Type</option>
//                         <option value="distance">Distance</option>
//                         <option value="time">Time</option>
//                         <option value="weight">Weight</option>
//                         <option value="amount">Amount</option>
//                     </select>
//                 </div>
//                 {measurementType && (
//                     <div style={{ marginBottom: "1rem" }}>
//                         <label>Measurement Unit</label>
//                         <select
//                             value={measurementUnit}
//                             onChange={(e) => setMeasurementUnit(e.target.value)}
//                             required
//                             style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
//                         >
//                             <option value="">Select Unit</option>
//                             {measurementOptions[measurementType].map((unit) => (
//                                 <option key={unit} value={unit}>
//                                     {unit}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 )}
//                 <div style={{ marginBottom: "1rem" }}>
//                     <label>Frequency</label>
//                     <select
//                         value={frequency}
//                         onChange={(e) => setFrequency(e.target.value)}
//                         required
//                         style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
//                     >
//                         <option value="">Select Frequency</option>
//                         <option value="day">Day</option>
//                         <option value="week">Week</option>
//                     </select>
//                 </div>
//                 <div style={{ marginBottom: "1rem" }}>
//                     <label>Target Count</label>
//                     <input
//                         type="number"
//                         value={targetCount}
//                         onChange={(e) => setTargetCount(e.target.value)}
//                         required
//                         style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
//                         min="1"
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     style={{
//                         width: "100%",
//                         padding: "0.5rem",
//                         background: "#007bff",
//                         color: "#fff",
//                         border: "none",
//                         borderRadius: "4px",
//                     }}
//                 >
//                     Create Habit
//                 </button>
//             </form>

//             <h2>Your Habits</h2>
//             <ul style={{ listStyle: "none", padding: 0 }}>
//                 {habits.map((habit: any) => (
//                     <li
//                         key={habit._id}
//                         style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             padding: "0.5rem",
//                             border: "1px solid #ccc",
//                             borderRadius: "4px",
//                             marginBottom: "0.5rem",
//                         }}
//                     >
//                         <span>
//                             {habit.name} ({habit.measurementType}, {habit.frequency} - {habit.targetCount} times)
//                         </span>
//                         <button
//                             onClick={() => handleDeleteHabit(habit._id)}
//                             style={{
//                                 padding: "0.3rem 0.5rem",
//                                 background: "red",
//                                 color: "#fff",
//                                 border: "none",
//                                 borderRadius: "4px",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             Delete
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default Home;


import React, { useState, useEffect } from "react";

function Home() {
    const [habits, setHabits] = useState([]);
    const [habitName, setHabitName] = useState("");
    const [measurementType, setMeasurementType] = useState("");
    const [measurementUnit, setMeasurementUnit] = useState("");
    const [measurementAmount, setMeasurementAmount] = useState("");
    const [frequency, setFrequency] = useState("");
    const [frequencyType, setFrequencyType] = useState("");

    // Fetch habits on component mount
    useEffect(() => {
        fetchHabits();
    }, []);

    // Fetch all habits
    async function fetchHabits() {
        try {
            const response = await fetch("/api/habits");
            const data = await response.json();
            setHabits(data);
        } catch (error) {
            console.error("Failed to fetch habits:", error);
        }
    }

    function buildPath(route: string): string {
        return process.env.NODE_ENV === "development"
            ? `http://localhost:5000${route}`
            : route;
    }

    // Handle habit creation
    async function handleCreateHabit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const newHabit = {
            name: habitName,
            measurementType,
            measurementUnit: `${measurementAmount} ${measurementUnit}`,
            frequency: `${frequency} per ${frequencyType}`,
        };

        try {
            const response = await fetch(buildPath("/api/habits"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newHabit),
            });
            if (response.ok) {
                fetchHabits();
                setHabitName("");
                setMeasurementType("");
                setMeasurementUnit("");
                setMeasurementAmount("");
                setFrequency("");
                setFrequencyType("");
            } else {
                console.error("Failed to create habit");
            }
        } catch (error) {
            console.error("Error creating habit:", error);
        }
    }

    // Handle habit deletion
    async function handleDeleteHabit(id: string) {
        try {
            const response = await fetch(buildPath(`/api/habits/${id}`), {
                method: "DELETE",
            });
            if (response.ok) {
                fetchHabits();
            } else {
                console.error("Failed to delete habit");
            }
        } catch (error) {
            console.error("Error deleting habit:", error);
        }
    }

    // Measurement options based on selected type
    const measurementOptions: { [key: string]: string[] } = {
        distance: ["Miles", "Kilometers"],
        time: ["Seconds", "Minutes", "Hours"],
        weight: ["Pounds", "Ounces", "Grams"],
        amount: ["Fluid Ounces"],
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
            <h2>Create a Habit</h2>
            <form onSubmit={handleCreateHabit} style={{ marginBottom: "1rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Habit Name</label>
                    <input
                        type="text"
                        value={habitName}
                        onChange={(e) => setHabitName(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Measurement Type</label>
                    <select
                        value={measurementType}
                        onChange={(e) => {
                            setMeasurementType(e.target.value);
                            setMeasurementUnit("");
                            setMeasurementAmount("");
                        }}
                        required
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                    >
                        <option value="">Select Measurement Type</option>
                        <option value="distance">Distance</option>
                        <option value="time">Time</option>
                        <option value="weight">Weight</option>
                        <option value="amount">Amount</option>
                    </select>
                </div>
                {measurementType && (
                    <div style={{ marginBottom: "1rem" }}>
                        <label>Measurement Unit and Amount</label>
                        <input
                            type="number"
                            value={measurementAmount}
                            onChange={(e) => setMeasurementAmount(e.target.value)}
                            placeholder="Amount"
                            required
                            style={{
                                width: "48%",
                                padding: "0.5rem",
                                marginTop: "0.5rem",
                                marginRight: "2%",
                            }}
                        />
                        <select
                            value={measurementUnit}
                            onChange={(e) => setMeasurementUnit(e.target.value)}
                            required
                            style={{ width: "48%", padding: "0.5rem", marginTop: "0.5rem" }}
                        >
                            <option value="">Select Unit</option>
                            {measurementOptions[measurementType].map((unit) => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div style={{ marginBottom: "1rem" }}>
                    <label>Frequency</label>
                    <input
                        type="number"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        placeholder="Times"
                        required
                        style={{
                            width: "48%",
                            padding: "0.5rem",
                            marginTop: "0.5rem",
                            marginRight: "2%",
                        }}
                    />
                    <select
                        value={frequencyType}
                        onChange={(e) => setFrequencyType(e.target.value)}
                        required
                        style={{ width: "48%", padding: "0.5rem", marginTop: "0.5rem" }}
                    >
                        <option value="">Per Day or Week</option>
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                    </select>
                </div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                    }}
                >
                    Create Habit
                </button>
            </form>

            <h2>Your Habits</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {habits.map((habit: any) => (
                    <li
                        key={habit._id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.5rem",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            marginBottom: "0.5rem",
                        }}
                    >
                        <span>
                            {habit.name} ({habit.measurementUnit}, {habit.frequency})
                        </span>
                        <button
                            onClick={() => handleDeleteHabit(habit._id)}
                            style={{
                                padding: "0.3rem 0.5rem",
                                background: "red",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
