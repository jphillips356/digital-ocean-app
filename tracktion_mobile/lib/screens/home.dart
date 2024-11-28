import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class Home extends StatefulWidget {
  const Home({super.key});

  @override  
  State<Home> createState() => _HomePageState();
}

class _HomePageState extends State<Home> {
  List<dynamic> _habitList = [];  // List to hold habits from backend
  bool _isLoading = true;  // Track loading state

  @override
  void initState() {
    super.initState();
    _fetchHabits();  // Fetch the habits when the screen is initialized
  }

  // Function to fetch habits from backend
  Future<void> _fetchHabits() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:5001/api/habits'));

      if (response.statusCode == 200) {
        // If server returns 200 OK, parse the habits
        final List<dynamic> habits = json.decode(response.body);
        setState(() {
          _habitList = habits;
          _isLoading = false;
        });
      } else {
        // Handle errors appropriately
        print('Failed to load habits: ${response.statusCode}');
        setState(() {
          _isLoading = false;
        });
      }
    } catch (error) {
      print('Error fetching habits: $error');
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Welcome!'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            onPressed: () {
              // Navigate back to the login/register screen
              Navigator.pushReplacementNamed(context, '/'); 
            },
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator()) // Show a loading spinner while fetching
          : _habitList.isEmpty
              ? const Center(
                  child: Text(
                    "Your Habits Will Appear Here!",
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                )
              : ListView.builder(
                  itemCount: _habitList.length,
                  itemBuilder: (context, index) {
                    final habit = _habitList[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                      child: ListTile(
                        title: Text(
                          habit['name'],
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          '${habit['amount']} ${habit['measurementUnit']} per ${habit['frequencyPer']}',
                        ),
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, 'addHabit').then((_) {
            _fetchHabits(); // Refresh the list when returning from the Add Habit screen
          });
        },
        child: const Icon(Icons.add),
        tooltip: 'Add Habit',
      ),
    );
  }
}