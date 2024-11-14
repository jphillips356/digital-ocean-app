import 'package:flutter/material.dart';
import '../auth_service.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginPageState();
}

class _LoginPageState extends State<Login> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final AuthService _authService = AuthService();

  Future<void> _handleLogin() async {
    final email = _emailController.text;
    final password = _passwordController.text;

    final success = await _authService.login(email, password);

    if (success) {
      // Navigate to the next screen if login is successful
      Navigator.pushNamed(context, 'home');
    } else {
      // Show an error message if login fails
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Login failed. Please check your credentials.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('TRACKTION Login'),),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          TextFormField(
            controller: _emailController,
            textAlign: TextAlign.center,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              hintText: 'Enter Username',
              contentPadding: 
              EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(32.0)),
              ),
            ),
          ),
          const SizedBox(
            height: 8.0,
          ),
          TextField(
            controller: _passwordController,
            textAlign: TextAlign.center,
            obscureText: true,
            decoration: const InputDecoration(
              hintText: 'Enter Password',
              contentPadding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(32.0))
              ),
            ),
          ),
          Padding(padding: const EdgeInsets.symmetric(vertical: 15.0),
          child: Material(
            elevation: 5.0,
            color: const Color.fromARGB(255, 182, 95, 240),
            borderRadius: BorderRadius.circular(30.0),
            child: MaterialButton(
              onPressed: _handleLogin,
              minWidth: 200.0,
              height: 42.0,
              child: const Text(
                'Sign In',
                style: TextStyle(
                  color: Colors.white
                  ),
                ),
              ),
            )
          ),
        const SizedBox(
          height: 8.0,
          ),
        InkWell(
          child: const Text(
            'Register',
            style: TextStyle(color: Color.fromARGB(255, 182, 95, 240)),
            ),
            onTap: (){
              Navigator.pushNamed(context, 'register');
            },
          ),
      ],
    ),
  );
  }
}