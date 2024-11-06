// import React, { useState } from 'react';

// function Login() {
//   const [login, setLogin] = useState(''); // Login (username) input
//   const [password, setPassword] = useState(''); // Password input
//   const [firstName, setFirstName] = useState(''); // First name for registration
//   const [lastName, setLastName] = useState(''); // Last name for registration
//   const [isRegister, setIsRegister] = useState(false); // Toggle between login and register forms
//   const [message, setMessage] = useState(''); // Message to display feedback (success or error)

//   // Handle form submission for login
//   async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const user = { login, password }; // Construct the user object for login

//     try {
//       const response = await fetch('/api/login', { // Make a request to login API
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(user),
//       });

//       const data = await response.json();
//       if (response.ok && !data.error) {
//         setMessage('Login successful!');
//         // Optional: handle successful login (e.g., save token, redirect)
//       } else {
//         setMessage(data.error || 'Invalid credentials');
//       }
//     } catch (error) {
//       setMessage('Error logging in');
//     }
//   }

//   // Handle form submission for registration
//   async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const newUser = { login, password, firstName, lastName }; // Construct the user object for registration

//     try {
//       const response = await fetch('/api/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newUser),
//       });

//       const data = await response.json();
//       if (response.ok && data.success) {
//         setMessage('Registration successful! You can now log in.');
//         setIsRegister(false); // Switch back to login form
//       } else {
//         setMessage(data.error || 'Registration failed');
//       }
//     } catch (error) {
//       setMessage('Error during registration');
//     }
//   }

//   return (
//     <div style={{ maxWidth: '400px', margin: 'auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
//       <h2>{isRegister ? 'Register' : 'Login'}</h2>
//       <form onSubmit={isRegister ? handleRegister : handleLogin}>
//         {isRegister && (
//           <>
//             <div style={{ marginBottom: '1rem' }}>
//               <label>First Name</label>
//               <input 
//                 type="text" 
//                 value={firstName} 
//                 onChange={(e) => setFirstName(e.target.value)} 
//                 required 
//                 style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
//               />
//             </div>
//             <div style={{ marginBottom: '1rem' }}>
//               <label>Last Name</label>
//               <input 
//                 type="text" 
//                 value={lastName} 
//                 onChange={(e) => setLastName(e.target.value)} 
//                 required 
//                 style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
//               />
//             </div>
//           </>
//         )}
//         <div style={{ marginBottom: '1rem' }}>
//           <label>Login</label>
//           <input 
//             type="text" 
//             value={login} 
//             onChange={(e) => setLogin(e.target.value)} 
//             required 
//             style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
//           />
//         </div>
//         <div style={{ marginBottom: '1rem' }}>
//           <label>Password</label>
//           <input 
//             type="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             required 
//             style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
//           />
//         </div>
//         <button type="submit" style={{ width: '100%', padding: '0.5rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
//           {isRegister ? 'Register' : 'Login'}
//         </button>
//       </form>
//       <p style={{ marginTop: '1rem' }}>{message}</p>
//       <button 
//         onClick={() => {
//           setIsRegister(!isRegister);
//           setMessage(''); // Clear message when switching forms
//         }} 
//         style={{ marginTop: '1rem', background: 'none', color: '#007bff', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
//       >
//         {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
//       </button>
//     </div>
//   );
// }

// export default Login;

// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user = { login, password };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage('Login successful!');
          navigate('/home'); // Redirect to the home page
        }
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      setMessage('Error logging in');
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
};

export default Login;
