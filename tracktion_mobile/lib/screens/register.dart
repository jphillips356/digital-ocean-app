import 'package:flutter/material.dart';
import '../auth_service.dart';

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
        title: const Text('Register'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          TextFormField(
            controller: _firstNameController,
            textAlign: TextAlign.center,
            decoration: const InputDecoration(
              hintText: 'Enter First Name',
              contentPadding: 
              EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(32.0)),
              ),
            ), //InputDecoration
          ), //TextFormField
          TextFormField(
            controller: _lastNameController,
            textAlign: TextAlign.center,
            decoration: const InputDecoration(
              hintText: 'Enter Last Name',
              contentPadding: 
              EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(32.0)),
              ),
            ), // InputDecoration
          ), // TextFormField
          const SizedBox(
            height: 8.0,
          ),
          TextFormField(
            controller: _usernameController,
            textAlign: TextAlign.center,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              hintText: 'Enter Username',
              contentPadding: 
              EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.all(Radius.circular(32.0)),
              ),
            ), // InputDecoration
          ), // TextFormField
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
              onPressed: (){},
              minWidth: 200.0,
              height: 42.0,
              child: const Text(
                'Register',
                style: TextStyle(
                  color: Colors.white
                  ),
                ),
              ),
            )
          ),
      ],
    ),
    );
  }
}