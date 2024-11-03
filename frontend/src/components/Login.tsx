import React, { useState } from 'react';

function Login() {
  const [login, setLogin] = useState(''); // Changed from username to login
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = { login, password }; // Construct the user object

    try {
      const response = await fetch('/api/login', { // Ensure the endpoint is correct
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          setMessage(data.error); // Set error message if present
        } else {
          setMessage('Login successful!');
          // Handle redirect or save token here
        }
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
        <label>Login</label>
        <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
}

export default Login;
