// import React, { useState } from 'react';

// function Login() {
//   const [login, setLogin] = useState(''); // Changed from username to login
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const user = { login, password }; // Construct the user object

//     try {
//       const response = await fetch('/api/login', { // Ensure the endpoint is correct
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(user),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.error) {
//           setMessage(data.error); // Set error message if present
//         } else {
//           setMessage('Login successful!');
//           // Handle redirect or save token here
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
//         <label>Login</label>
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
  const [login, setLogin] = useState(''); // Login (username) input
  const [password, setPassword] = useState(''); // Password input
  const [message, setMessage] = useState(''); // Message to display feedback (success or error)

  // Handle form submission
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = { login, password }; // Construct the user object

    try {
      const response = await fetch('/api/login', { // Make a request to login API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          setMessage(data.error); // Show error message if login failed
        } else {
          setMessage('Login successful!');
          // Optional: handle successful login (e.g., save token, redirect)
        }
      } else {
        setMessage('Invalid credentials'); // Show invalid credentials message
      }
    } catch (error) {
      setMessage('Error logging in'); // Show error message if fetch fails
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Login</label>
          <input 
            type="text" 
            value={login} 
            onChange={(e) => setLogin(e.target.value)} 
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.5rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Login
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem', color: message === 'Login successful!' ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default Login;
