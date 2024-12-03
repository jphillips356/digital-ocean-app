import 'package:flutter/material.dart';
import '../authService.dart';
import 'habits.dart';
import 'package:tracktion_mobile/screens/home.dart';
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

  Future<Map<String, dynamic>?> getUserDetails(
      {String? email, String? username}) async {
    if (email == null && username == null) {
      return null; // Or return an appropriate error map
    }

    Map<String, dynamic>? user =
        await _authService.fetchUserDetails(email: email, username: username);

    if (user != null && !user.containsKey('error')) {
      // Extract user properties (optional step to simplify output if needed)
      final String firstName = user['firstName'];
      final String lastName = user['lastName'];
      final int userID = user['userID'];

      return {
        'firstName': firstName,
        'lastName': lastName,
        'userID': userID,
      };
    } else {
      // Return null for failure or an appropriate error map
      return null;
    }
  }

  Future<void> _handleLogin() async {
    final emailOrUsername = _emailController.text.trim();
    final password = _passwordController.text.trim();

    // Call the login API
    final result = await _authService.login(emailOrUsername, password);

    // Handle different result cases based on the response
    print('Login API result: $result'); //NEW
    if (result.containsKey('error') && result['error'].isNotEmpty) {
      String errorMessage = result['error'];

      if (errorMessage == 'Incorrect password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (errorMessage == 'User not found') {
        errorMessage = 'No account found with this username/email.';
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(errorMessage)),
      );
      print('User info fetched successfully:');
      return; // Stop further processing if there's an error
    }

    // Fetch user details (attempt with email or username)
    Map<String, dynamic>? userInfo = await getUserDetails(
      email: emailOrUsername.contains('@') ? emailOrUsername : null,
      username: !emailOrUsername.contains('@') ? emailOrUsername : null,
    );

    print('username: ${result['email']}');
    print('email: ${result['username']}');

    if (userInfo == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to fetch user details.')),
      );
      return;
    }

    // Proceed to the home screen with user information
    _navigateToHome(userInfo);
  }

  void _navigateToHome(Map<String, dynamic> user) {
    print('Sign In button pressed');
    final userId = user['userID'];
    final firstName = user['firstName'];
    final lastName = user['lastName'];

    // Store user data or use it as needed
    print('User ID: $userId, Name: $firstName $lastName');

    // Navigate to the home screen
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) =>
            Home(userId: userId), // Update Home to accept arguments if needed
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: true,
      appBar: AppBar(
        backgroundColor: Colors.white,
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
            padding: const EdgeInsets.all(
                30.0), // Added padding around the entire body
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 20.0), // Space above the Welcome text

                const Align(
                  child: Text(
                    'Welcome!',
                    style: TextStyle(
                      fontSize: 42.0,
                      fontFamily: 'RubikMono',
                      fontWeight: FontWeight.w400,
                      color: Colors.black,
                    ),
                  ),
                ),

                const Spacer(), // Add space to move content downward
                const Align(
                  child: Text(
                    'Are you ready to',
                    style: TextStyle(
                      fontSize: 40.0,
                      fontFamily: 'Roboto',
                      fontWeight: FontWeight.w400,
                      color: Colors.black,
                    ),
                  ),
                ),

                const Align(
                  child: Text(
                    'build some habits!',
                    style: TextStyle(
                      fontSize: 40.0,
                      fontFamily: 'Roboto',
                      fontWeight: FontWeight.w600,
                      color: Colors.black,
                    ),
                  ),
                ),
                const SizedBox(
                    height: 20.0), // Space between the text and username field
                Padding(
                  padding: const EdgeInsets.only(
                      bottom: 20.0), // Adjust the bottom padding
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
                      contentPadding: EdgeInsets.symmetric(
                          vertical: 10.0, horizontal: 20.0),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(32.0)),
                      ),
                      fillColor: Colors.white,
                      filled: true,
                    ),
                  ),
                ),
                const SizedBox(height: 5.0),
                Padding(
                  padding: const EdgeInsets.only(
                      bottom: 10.0), // Adjust the bottom padding
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
                      contentPadding: EdgeInsets.symmetric(
                          vertical: 10.0, horizontal: 20.0),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(32.0)),
                      ),
                      fillColor: Colors.white,
                      filled: true,
                    ),
                  ),
                ),
                const SizedBox(
                    height:
                        30.0), // Reduced space between text fields and buttons
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
                          color: Color.fromARGB(255, 0, 0, 0),
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
                          color: Color.fromARGB(255, 0, 0, 0),
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
