import 'package:flutter/material.dart';
import '../authService.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginPageState();
}

class _LoginPageState extends State<Login> {
  final AuthService _authService = AuthService();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  
  Future<void> _handleLogin() async {
    final email = _emailController.text;
    final password = _passwordController.text;

    // Call the login API
    final result = await _authService.login(email, password);

    // Handle different result cases based on the response
    if (result.containsKey('error')) {
      // If the response contains an error, show the error message
      String errorMessage = result['error'];
      
      if (errorMessage == 'Incorrect password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (errorMessage == 'User not found') {
        errorMessage = 'No account found with this username/email.';
      } else if (errorMessage == 'Email not verified') {
        errorMessage = 'Your email is not verified. Please check your inbox.';
      }
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(errorMessage)),
      );
    } else {
      // If login is successful, navigate to the home screen with user data
      final userId = result['id'];
      final firstName = result['firstName'];
      final lastName = result['lastName'];

      // You can store this user data in your app's state or shared preferences for later use

      // Navigate to the home screen
      Navigator.pushNamed(context, 'home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: SvgPicture.asset('assets/images/Logo.svg', height: 40),
        automaticallyImplyLeading: false,
      ),
      body: Stack(
        children: [
          // Background image with specific position
          Positioned(
            top: 70, // Adjust the position as needed
            left: 0, // Adjust the position as needed
            right: 10,
            child: Container(
              width: 250, // Adjust width as needed
              height: 600, // Adjust height as needed
              child: Image.asset(
                'assets/images/home-screen.png',
                fit: BoxFit.cover,
              ),
            ),
          ),
          // Foreground content
          Padding(
            padding: const EdgeInsets.all(30.0), // Added padding around the entire body
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 20.0), // Space above the Welcome text
                const Text(
                  'Welcome, User',
                  style: TextStyle(
                    fontSize: 38.0,
                    fontFamily: 'RubikMono',
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                const Spacer(), // Add space to move content downward
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Are you ready to build',
                    style: TextStyle(
                      fontSize: 32.0,
                      fontFamily: 'Roboto',
                      fontWeight: FontWeight.w400,
                      color: Colors.black,
                    ),
                  ),
                ),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'some habits!',
                    style: TextStyle(
                      fontSize: 24.0,
                      fontFamily: 'RubikMono',
                      fontWeight: FontWeight.w600,
                      color: Colors.black,
                    ),
                  ),
                ),
                const SizedBox(height: 20.0), // Space between the text and username field
                Padding(
                  padding: const EdgeInsets.only(bottom: 20.0), // Adjust the bottom padding
                  child: TextFormField(
                    controller: _emailController,
                    textAlign: TextAlign.center,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      hintText: 'Enter Username or Email',
                      hintStyle: TextStyle(
                        fontFamily: 'Roboto',
                        fontSize: 16.0,
                        fontWeight: FontWeight.w700,
                        color: Colors.black,
                      ),
                      contentPadding:
                      EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(32.0)),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 5.0),
                Padding(
                  padding: const EdgeInsets.only(bottom: 10.0), // Adjust the bottom padding
                  child: TextField(
                    controller: _passwordController,
                    textAlign: TextAlign.center,
                    obscureText: true,
                    decoration: const InputDecoration(
                      hintText: 'Enter Password',
                      hintStyle: TextStyle(
                        fontFamily: 'Roboto',
                        fontSize: 16.0,
                        fontWeight: FontWeight.w700,
                        color: Colors.black,
                      ),
                      contentPadding:
                      EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(32.0)),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 30.0), // Reduced space between text fields and buttons
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Material(
                    elevation: 5.0,
                    color: const Color.fromARGB(255, 100, 252, 217),
                    borderRadius: BorderRadius.circular(30.0),
                    child: MaterialButton(
                      onPressed: _handleLogin,
                      minWidth: 200.0,
                      height: 42.0,
                      child: const Text(
                        'Sign In',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'Roboto',
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 8.0),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 3.0),
                  child: Material(
                    elevation: 5.0,
                    color: const Color.fromARGB(255, 100, 252, 217),
                    borderRadius: BorderRadius.circular(30.0),
                    child: MaterialButton(
                      onPressed: () {
                        Navigator.pushNamed(context, 'register');
                      },
                      minWidth: 200.0,
                      height: 42.0,
                      child: const Text(
                        'Register',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'Roboto',
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}