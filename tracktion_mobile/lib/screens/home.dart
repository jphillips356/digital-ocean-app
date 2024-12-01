import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class Home extends StatefulWidget {
  final int userId;
  const Home({super.key, required this.userId});

  @override
  State<Home> createState() => _HomePageState();
}

class _HomePageState extends State<Home> {
  List<dynamic> _habitList = [];
  bool _isLoading = true;
  String _username = '';
  int _selectedHabitIndex = -1;

  @override
  void initState() {
    super.initState();
    _fetchUsername();
    _fetchHabits();
  }

  Future<void> _fetchUsername() async {
    try {
      final response = await http.get(
        Uri.parse(
            'http://192.168.1.135:5001/api/user-details?UserID=${widget.userId}'),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> userDetails = json.decode(response.body);
        setState(() {
          _username = userDetails['data']['firstName'];
        });
      } else {
        print('Failed to load user details: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching user details: $error');
    }
  }

  Future<void> _fetchHabits() async {
    try {
      final response = await http.get(
        Uri.parse(
            'http://192.168.1.135:5001/api/habits?UserID=${widget.userId}'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> habits = json.decode(response.body);
        setState(() {
          _habitList = habits;
          print('_habitList contents: $_habitList'); // Debug print
          _isLoading = false;
        });
      } else {
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

  Future<void> _completeHabit(String habitId) async {
    try {
      final response = await http.put(
        Uri.parse('http://192.168.1.135:5001/api/habits/$habitId/complete'),
        headers: {'Content-Type': 'application/json'},
      );
      print('hello');
      if (response.statusCode == 200) {
        print('hello2');
        // Update the local habit list to reflect the completed habit
        final updatedHabit = json.decode(response.body);
        setState(() {
          final index =
              _habitList.indexWhere((habit) => habit['_id'] == habitId);
          if (index != -1) {
            _habitList[index] = updatedHabit;
          }
        });
      } else {
        print('Failed to complete habit: ${response.statusCode}');
      }
    } catch (error) {
      print('Error completing habit: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, $_username!'),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/');
            },
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
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
                    // Debugging: Print the habit data

                    // Extract and validate habit details
                    final id =
                        habit['_id']; // Ensure 'id' is properly populated
                    final streak = habit['streak'] ?? 0;
                    final goal = habit['goal'] ??
                        1; // Default goal to prevent division by zero
                    final amount = habit['amount'] ?? '';
                    final measurementUnit = habit['measurementUnit'] ?? '';
                    final frequency = habit['frequency'] ?? '';
                    final frequencyPer = habit['frequencyPer'] ?? '';

                    // Format the subtitle
                    final subtitle =
                        '$amount $measurementUnit, $frequency per $frequencyPer';

                    // Check for missing or null ID
                    if (id == null) {
                      print('Error: Missing habit ID for habit: $habit');
                    }

                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedHabitIndex =
                              _selectedHabitIndex == index ? -1 : index;
                        });
                      },
                      child: Column(
                        children: [
                          Card(
                            margin: const EdgeInsets.symmetric(
                                vertical: 8, horizontal: 16),
                            child: ListTile(
                              title: Text(
                                habit['name'] ?? 'Unnamed Habit',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold),
                              ),
                              subtitle: Text(subtitle),
                              trailing: ElevatedButton(
                                onPressed: () {
                                  if (id != null) {
                                    print(
                                        'Completing habit with ID: $id'); // Debug print
                                    _completeHabit(id);
                                  } else {
                                    print(
                                        'Error: Habit ID is null for habit: $habit');
                                  }
                                },
                                child: const Text('Complete'),
                              ),
                            ),
                          ),
                          if (_selectedHabitIndex == index)
                            RaceTrack(streak: streak, goal: goal),
                        ],
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, 'addHabit').then((_) {
            _fetchHabits();
          });
        },
        child: const Icon(Icons.add),
        tooltip: 'Add Habit',
      ),
    );
  }
}

class RaceTrack extends StatelessWidget {
  final int streak;
  final int goal;

  const RaceTrack({super.key, required this.streak, required this.goal});

  @override
  Widget build(BuildContext context) {
    final double progress = (streak / goal).clamp(0.0, 1.0) * 100;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      height: 50,
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(25),
      ),
      child: Stack(
        children: [
          // Progress Bar
          Positioned.fill(
            child: FractionallySizedBox(
              widthFactor: (streak / goal).clamp(0.0, 1.0),
              alignment: Alignment.centerLeft,
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF64FCD9),
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
            ),
          ),
          // Car Icon
          Positioned(
            left: progress,
            top: 0,
            child: Transform.translate(
              offset: const Offset(-12, 6),
              child: const Icon(
                Icons.directions_car,
                size: 30,
                color: Colors.black,
              ),
            ),
          ),
          // Text Labels
          Positioned.fill(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const SizedBox(width: 8),
                Text(
                  'Goal: $goal days',
                  style: const TextStyle(
                      fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
