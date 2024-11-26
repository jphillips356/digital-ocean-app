import 'package:flutter/material.dart';
import '../auth_service.dart';
import 'package:flutter_svg/flutter_svg.dart';

class Register extends StatefulWidget {
  const Register({super.key});

  @override
  State<Register> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<Register> {
  final AuthService _authService = AuthService();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  void _register() async {
    try {
      final result = await _authService.register(
        _firstNameController.text,
        _lastNameController.text,
        _usernameController.text,
        _passwordController.text,
      );
      // Handle success (e.g., navigate to login page or display success message)
      print("Registration successful: $result");
    } catch (e) {
      // Handle error
      print("Error: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: SvgPicture.asset('assets/images/Logo.svg', height: 40),
      ),
      body: Stack(
        children: [
          // Background image with specific position
          Positioned(
            top: 70, // Adjust the position as needed
            left: 0, // Adjust the position as needed
            right: 0,
            child: Container(
              width: 250, // Adjust width as needed
              height: 600, // Adjust height as needed
              child: Image.asset(
                'assets/images/edit.png',
                fit: BoxFit.cover,
              ),
            ),
          ),
          // Foreground content
          Padding(
            padding: const EdgeInsets.all(30.0), // Added padding around the entire body
            child: Column(
              children: [
                const SizedBox(height: 30.0), // Space above the Register text
                const Text(
                  'Register',
                  style: TextStyle(
                    fontSize: 38.0,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                    fontFamily: 'RubikMono'
                  ),
                ),
                Spacer(), // Add space to move content downward
                Padding(
                  padding: const EdgeInsets.only(bottom: 20.0), // Adjust the bottom padding
                  child: TextFormField(
                    controller: _firstNameController,
                    textAlign: TextAlign.center,
                    decoration: const InputDecoration(
                      hintText: 'Enter First Name',
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
                const SizedBox(height: 2.0),
                Padding(
                  padding: const EdgeInsets.only(bottom: 20.0), // Adjust the bottom padding
                  child: TextFormField(
                    controller: _lastNameController,
                    textAlign: TextAlign.center,
                    decoration: const InputDecoration(
                      hintText: 'Enter Last Name',
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
                const SizedBox(height: 2.0),
                Padding(
                  padding: const EdgeInsets.only(bottom: 20.0), // Adjust the bottom padding
                  child: TextFormField(
                    controller: _usernameController,
                    textAlign: TextAlign.center,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      hintText: 'Enter Username',
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
                const SizedBox(height: 2.0),
                Padding(
                  padding: const EdgeInsets.only(bottom: 20.0), // Adjust the bottom padding
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
                const SizedBox(height: 10.0),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 15.0),
                  child: Material(
                    elevation: 5.0,
                    color: const Color.fromARGB(255, 100, 252, 217),
                    borderRadius: BorderRadius.circular(30.0),
                    child: MaterialButton(
                      onPressed: _register, // Trigger the register function here
                      minWidth: 200.0,
                      height: 42.0,
                      child: const Text(
                        'Register',
                        style: TextStyle(
                          fontFamily: 'Roboto',
                          fontSize: 20,
                          color: Colors.white,
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
