import 'package:flutter/material.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override  
  State<Home> createState() => _HomePageState();
}

class _HomePageState extends State<Home> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Welcome!'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(onPressed: (){
              // Navigate back to the login/register screen
              Navigator.pushReplacementNamed(context, '/'); 
              },
          icon: const Icon(Icons.logout),
          tooltip: 'Logout',
          ) // IconButton
        ],
      ), // AppBar
    ); // Scaffold
  }
}