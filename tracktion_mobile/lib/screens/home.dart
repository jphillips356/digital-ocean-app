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
          IconButton(onPressed: (){},
          icon: const Icon(Icons.logout),
          ) // IconButton
        ],
      ), // AppBar
    ); // Scaffold
  }
}