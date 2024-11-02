// // src/components/Login.tsx
// import React, { useState } from 'react';

// function Login() {
//   const [login, setLogin] = useState(''); // Change username to login
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   async function handleLogin(event: React.FormEvent) {
//     event.preventDefault();
//     const user = { login, password }; // Use login instead of username

//     try {
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(user),
//       });
//       if (response.ok) {
//         const data = await response.json(); // Get the response data
//         if (data.error) {
//           setMessage(data.error); // Set error message if present
//         } else {
//           setMessage('Login successful!');
//           // Handle redirect or save token here, e.g., redirect to a dashboard
//         }
//       } else {
//         setMessage('Invalid credentials');
//       }
//     } catch (error) {
//       setMessage('Error logging in');
//     }
//   }

//   return (
//     <form onSubmit={handleLogin}>
//       <h2>Login</h2>
//       <div>
//         <label>Login</label> {/* Update label from Username to Login */}
//         <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
//       </div>
//       <div>
//         <label>Password</label>
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       </div>
//       <button type="submit">Login</button>
//       <p>{message}</p>
//     </form>
//   );
// }

// export default Login;

import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    const user = { login: username, password }; // Note: changed to match server expectations

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        setMessage('Login successful!');
        // Handle redirect or save token
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      setMessage('Error logging in');
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
      <p>{message}</p>
      {/* Debugging Information */}
      <p>Username: {username}</p>
      <p>Password: {password}</p>
    </form>
  );
}

export default Login;

