// import 'package:flutter/material.dart';
// import 'dart:convert';
// import 'package:http/http.dart' as http;
// import 'package:tracktion_mobile/screens/addHabit.dart';
// import 'package:tracktion_mobile/screens/editHabit.dart';

// class Home extends StatefulWidget {
//   final int userId;
//   const Home({super.key, required this.userId});

//   @override
//   State<Home> createState() => _HomePageState();
// }

// class _HomePageState extends State<Home> {
//   List<dynamic> _habitList = [];
//   bool _isLoading = true;
//   String _username = '';
//   int _selectedHabitIndex = -1;

//   @override
//   void initState() {
//     super.initState();
//     _fetchUsername();
//     _fetchHabits();
//   }

//   Future<void> _fetchUsername() async {
//     try {
//       final response = await http.get(
//         Uri.parse(
//             'https://habittracktion.xyz/api/user-details?UserID=${widget.userId}'),
//       );

//       if (response.statusCode == 200) {
//         final Map<String, dynamic> userDetails = json.decode(response.body);
//         setState(() {
//           _username = userDetails['data']['firstName'];
//         });
//       } else {
//         print('Failed to load user details: ${response.statusCode}');
//       }
//     } catch (error) {
//       print('Error fetching user details: $error');
//     }
//   }

//   Future<void> _fetchHabits() async {
//     try {
//       final response = await http.get(
//         Uri.parse(
//             'https://habittracktion.xyz/api/habits?UserID=${widget.userId}'),
//       );

//       if (response.statusCode == 200) {
//         final List<dynamic> habits = json.decode(response.body);
//         setState(() {
//           _habitList = habits;
//           print('_habitList contents: $_habitList'); // Debug print
//           _isLoading = false;
//         });
//       } else {
//         print('Failed to load habits: ${response.statusCode}');
//         setState(() {
//           _isLoading = false;
//         });
//       }
//     } catch (error) {
//       print('Error fetching habits: $error');
//       setState(() {
//         _isLoading = false;
//       });
//     }
//   }

//   Future<void> _completeHabit(String habitId) async {
//     try {
//       final response = await http.put(
//         Uri.parse('https://habittracktion.xyz/api/habits/$habitId/complete'),
//         headers: {'Content-Type': 'application/json'},
//       );
//       print('hello');
//       if (response.statusCode == 200) {
//         print('hello2');
//         // Update the local habit list to reflect the completed habit
//         final updatedHabit = json.decode(response.body);
//         setState(() {
//           final index =
//               _habitList.indexWhere((habit) => habit['_id'] == habitId);
//           if (index != -1) {
//             _habitList[index] = updatedHabit;
//           }
//         });
//       } else {
//         print('Failed to complete habit: ${response.statusCode}');
//       }
//     } catch (error) {
//       print('Error completing habit: $error');
//     }
//   }

//   Future<void> _deleteHabit(String habitId) async {
//     final url = Uri.parse('https://habittracktion.xyz/api/habits/$habitId');

//     try {
//       final response = await http.delete(
//         url,
//         headers: {'Content-Type': 'application/json'},
//       );

//       if (response.statusCode == 200) {
//         setState(() {
//           // Remove the habit locally after a successful deletion
//           _habitList.removeWhere((habit) => habit['_id'] == habitId);
//         });
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('Habit deleted successfully.')),
//         );
//       } else {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//               content: Text('Failed to delete habit: ${response.statusCode}')),
//         );
//       }
//     } catch (error) {
//       print('Error deleting habit: $error');
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(
//             content: Text('An error occurred while deleting the habit.')),
//       );
//     }
//   }

//   Future<void> _editHabit(String habitId, Map<String, dynamic> updates) async {
//     final url = Uri.parse('https://habittracktion.xyz/api/habits/$habitId');

//     try {
//       final response = await http.put(
//         url,
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode(updates),
//       );

//       if (response.statusCode == 200) {
//         // Update the habit in the local list
//         setState(() {
//           final index =
//               _habitList.indexWhere((habit) => habit['_id'] == habitId);
//           if (index != -1) {
//             _habitList[index] = json.decode(response.body);
//           }
//         });
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('Habit edited successfully.')),
//         );
//       } else {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//             content: Text('Failed to edit habit: ${response.statusCode}'),
//           ),
//         );
//       }
//     } catch (error) {
//       print('Error editing habit: $error');
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(
//           content: Text('An error occurred while editing the habit.'),
//         ),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Welcome, $_username!'),
//         automaticallyImplyLeading: false,
//         actions: [
//           IconButton(
//             onPressed: () {
//               Navigator.pushReplacementNamed(context, '/');
//             },
//             icon: const Icon(Icons.logout),
//             tooltip: 'Logout',
//           ),
//         ],
//       ),
//       body: _isLoading
//           ? const Center(
//               child: CircularProgressIndicator(),
//             )
//           : _habitList.isEmpty
//               ? const Center(
//                   child: Text(
//                     "Your Habits Will Appear Here!",
//                     style: TextStyle(fontSize: 18, color: Colors.grey),
//                   ),
//                 )
//               : ListView.builder(
//                   itemCount: _habitList.length,
//                   itemBuilder: (context, index) {
//                     final habit = _habitList[index];
//                     // Debugging: Print the habit data

//                     // Extract and validate habit details
//                     final id =
//                         habit['_id']; // Ensure 'id' is properly populated
//                     final streak = habit['streak'] ?? 0;
//                     final goal = habit['goal'] ??
//                         1; // Default goal to prevent division by zero
//                     final amount = habit['amount'] ?? '';
//                     final measurementUnit = habit['measurementUnit'] ?? '';
//                     final frequency = habit['frequency'] ?? '';
//                     final frequencyPer = habit['frequencyPer'] ?? '';

//                     // Format the subtitle
//                     final subtitle =
//                         '$measurementUnit, $frequencyPer $frequency';

//                     // Check for missing or null ID
//                     if (id == null) {
//                       print('Error: Missing habit ID for habit: $habit');
//                     }

//                     return GestureDetector(
//                       onTap: () {
//                         setState(() {
//                           _selectedHabitIndex =
//                               _selectedHabitIndex == index ? -1 : index;
//                         });
//                       },
//                       child: Column(
//                         children: [
//                           Card(
//                             margin: const EdgeInsets.symmetric(
//                                 vertical: 8, horizontal: 16),
//                             child: ListTile(
//                               title: Text(
//                                 habit['name'] ?? 'Unnamed Habit',
//                                 style: const TextStyle(
//                                     fontWeight: FontWeight.bold),
//                               ),
//                               subtitle: Text(subtitle),
//                               trailing: ElevatedButton(
//                                 onPressed: () {
//                                   if (id != null) {
//                                     print(
//                                         'Completing habit with ID: $id'); // Debug print
//                                     _completeHabit(id);
//                                   } else {
//                                     print(
//                                         'Error: Habit ID is null for habit: $habit');
//                                   }
//                                 },
//                                 child: const Text('Complete'),
//                               ),
//                             ),
//                           ),
//                           if (_selectedHabitIndex == index)
//                             Column(
//                               children: [
//                                 RaceTrack(streak: streak, goal: goal),
//                                 const SizedBox(
//                                     height:
//                                         8), // Spacing between RaceTrack and Buttons
//                                 Row(
//                                   mainAxisAlignment: MainAxisAlignment.center,
//                                   children: [
//                                     ElevatedButton(
//                                       style: ElevatedButton.styleFrom(
//                                         backgroundColor: const Color(
//                                             0xFF64FCD9), // Background color for Delete button
//                                         padding: const EdgeInsets.symmetric(
//                                             horizontal: 24, vertical: 12),
//                                       ),
//                                       onPressed: () {
//                                         if (id != null) {
//                                           _deleteHabit(
//                                               id); // Call the delete function
//                                         } else {
//                                           print('Error: Habit ID is null');
//                                         }
//                                       },
//                                       child: const Text(
//                                         'Delete',
//                                         style: TextStyle(
//                                           color: Colors.black,
//                                           fontSize: 16,
//                                           fontWeight: FontWeight.bold,
//                                           fontFamily: 'Roboto',
//                                         ),
//                                       ),
//                                     ),
//                                     const SizedBox(
//                                         width:
//                                             16), // Spacing between Delete and Edit buttons
//                                     ElevatedButton(
//                                       style: ElevatedButton.styleFrom(
//                                         backgroundColor: Colors.blue,
//                                         padding: const EdgeInsets.symmetric(
//                                             horizontal: 24, vertical: 12),
//                                       ),
//                                       onPressed: () {
//                                         if (id != null) {
//                                           Navigator.push(
//                                             context,
//                                             MaterialPageRoute(
//                                               builder: (context) =>
//                                                   EditHabitScreen(
//                                                 userId: widget.userId,
//                                                 habit:
//                                                     habit, // Pass the selected habit to the edit screen
//                                               ),
//                                             ),
//                                           ).then((result) {
//                                             if (result == true) {
//                                               _fetchHabits(); // Refresh habits if changes were saved
//                                             }
//                                           });
//                                         }
//                                       },
//                                       child: const Text(
//                                         'Edit',
//                                         style: TextStyle(
//                                           color: Colors.white,
//                                           fontSize: 16,
//                                           fontWeight: FontWeight.bold,
//                                           fontFamily: 'Roboto',
//                                         ),
//                                       ),
//                                     ),
//                                   ],
//                                 ),
//                               ],
//                             ),
//                         ],
//                       ),
//                     );
//                   },
//                 ),
//       floatingActionButton: FloatingActionButton(
//         onPressed: () {
//           Navigator.push(
//             context,
//             MaterialPageRoute(
//               builder: (context) =>
//                   AddHabitScreen(userId: widget.userId), // Pass userId here
//             ),
//           ).then((_) {
//             _fetchHabits();
//           });
//         },
//         child: const Icon(Icons.add),
//         tooltip: 'Add Habit',
//       ),
//     );
//   }
// }

// class RaceTrack extends StatelessWidget {
//   final int streak;
//   final int goal;

//   const RaceTrack({super.key, required this.streak, required this.goal});

//   @override
//   Widget build(BuildContext context) {
//     final double progress = (streak / goal).clamp(0.0, 1.0) * 100;

//     return Container(
//       margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
//       height: 50,
//       decoration: BoxDecoration(
//         color: Colors.grey[200],
//         borderRadius: BorderRadius.circular(25),
//       ),
//       child: Stack(
//         children: [
//           // Progress Bar
//           Positioned.fill(
//             child: FractionallySizedBox(
//               widthFactor: (streak / goal).clamp(0.0, 1.0),
//               alignment: Alignment.centerLeft,
//               child: Container(
//                 decoration: BoxDecoration(
//                   color: const Color(0xFF64FCD9),
//                   borderRadius: BorderRadius.circular(25),
//                 ),
//               ),
//             ),
//           ),
//           // Car Icon
//           Positioned(
//             left: progress,
//             top: 0,
//             child: Transform.translate(
//               offset: const Offset(-8, 6),
//               child: const Icon(
//                 Icons.directions_car,
//                 size: 25,
//                 color: Colors.black,
//               ),
//             ),
//           ),
//           // Text Labels
//           Positioned.fill(
//             child: Row(
//               mainAxisAlignment: MainAxisAlignment.spaceBetween,
//               children: [
//                 const SizedBox(width: 8),
//                 Text(
//                   'Goal: $goal days',
//                   style: const TextStyle(
//                       fontSize: 12, fontWeight: FontWeight.bold),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:tracktion_mobile/screens/addHabit.dart';
import 'package:tracktion_mobile/screens/editHabit.dart';

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
            'https://habittracktion.xyz/api/user-details?UserID=${widget.userId}'),
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
            'https://habittracktion.xyz/api/habits?UserID=${widget.userId}'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> habits = json.decode(response.body);
        setState(() {
          _habitList = habits;
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
        Uri.parse('https://habittracktion.xyz/api/habits/$habitId/complete'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
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

  Future<void> _deleteHabit(String habitId) async {
    final url = Uri.parse('https://habittracktion.xyz/api/habits/$habitId');

    try {
      final response = await http.delete(
        url,
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        setState(() {
          _habitList.removeWhere((habit) => habit['_id'] == habitId);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Habit deleted successfully.')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Failed to delete habit: ${response.statusCode}')),
        );
      }
    } catch (error) {
      print('Error deleting habit: $error');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('An error occurred while deleting the habit.')),
      );
    }
  }

  Future<void> _editHabit(String habitId, Map<String, dynamic> updates) async {
    final url = Uri.parse('https://habittracktion.xyz/api/habits/$habitId');

    try {
      final response = await http.put(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(updates),
      );

      if (response.statusCode == 200) {
        setState(() {
          final index =
              _habitList.indexWhere((habit) => habit['_id'] == habitId);
          if (index != -1) {
            _habitList[index] = json.decode(response.body);
          }
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Habit edited successfully.')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to edit habit: ${response.statusCode}'),
          ),
        );
      }
    } catch (error) {
      print('Error editing habit: $error');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('An error occurred while editing the habit.'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Habit List',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            fontFamily: 'RubikMono',
            color: Colors.black,
          ),
        ),
        backgroundColor: Colors.white,
        automaticallyImplyLeading: false,
        actions: [
          TextButton.icon(
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/');
            },
            icon: const Icon(Icons.logout, color: Colors.black),
            label: const Text(
              'Logout',
              style: TextStyle(
                color: Colors.black, // Adjust text color
                fontSize: 16, // Adjust font size
                fontWeight: FontWeight.bold, // Optional: Adjust weight
                fontFamily: 'Roboto', // Specify custom font
              ),
            ),
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 16),
            ),
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
                    final id = habit['_id'];
                    final streak = habit['streak'] ?? 0;
                    final goal = habit['goal'] ?? 1;
                    final measurementUnit = habit['measurementUnit'] ?? '';
                    final frequency = habit['frequency'] ?? '';
                    final frequencyPer = habit['frequencyPer'] ?? '';
                    final subtitle =
                        '$measurementUnit, $frequencyPer $frequency';

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
                            color: _selectedHabitIndex == index
                                ? const Color(0xFF64FCD9)
                                : Colors.white,
                            elevation: 2.0,
                            child: ListTile(
                              title: Text(
                                habit['name'] ?? 'Unnamed Habit',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                              subtitle: Text(subtitle),
                              trailing: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: _selectedHabitIndex == index
                                      ? const Color(0xFF9E9E9E)
                                      : const Color(0xFF9E9E9E),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 20, vertical: 10),
                                ),
                                onPressed: () {
                                  if (id != null) {
                                    _completeHabit(id);
                                  }
                                },
                                child: const Text(
                                  'Complete',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          if (_selectedHabitIndex == index)
                            Column(
                              children: [
                                RaceTrack(streak: streak, goal: goal),
                                const SizedBox(height: 8),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    OutlinedButton(
                                      style: OutlinedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 24, vertical: 12),
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(30),
                                        ),
                                        side: const BorderSide(
                                            color: Colors.black,
                                            width: 2.0), // Black border
                                        backgroundColor: const Color(
                                            0xFF64FCD9), // Button background color
                                      ),
                                      onPressed: () {
                                        if (id != null) {
                                          showDialog(
                                            context: context,
                                            builder: (BuildContext context) {
                                              return AlertDialog(
                                                title: const Text(
                                                  'Confirm Delete',
                                                  style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold),
                                                ),
                                                content: const Text(
                                                    'Are you sure you want to delete this habit?'),
                                                actions: <Widget>[
                                                  OutlinedButton(
                                                    style: OutlinedButton
                                                        .styleFrom(
                                                      padding: const EdgeInsets
                                                          .symmetric(
                                                          horizontal: 16,
                                                          vertical: 8),
                                                      shape:
                                                          RoundedRectangleBorder(
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(30),
                                                      ),
                                                      side: const BorderSide(
                                                          color: Colors.black,
                                                          width: 2.0),
                                                      backgroundColor:
                                                          const Color(
                                                              0xFF64FCD9),
                                                    ),
                                                    onPressed: () {
                                                      Navigator.of(context)
                                                          .pop(); // Close the dialog
                                                    },
                                                    child: const Text(
                                                      'No',
                                                      style: TextStyle(
                                                        color: Colors.black,
                                                        fontSize: 16,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                    ),
                                                  ),
                                                  OutlinedButton(
                                                    style: OutlinedButton
                                                        .styleFrom(
                                                      padding: const EdgeInsets
                                                          .symmetric(
                                                          horizontal: 16,
                                                          vertical: 8),
                                                      shape:
                                                          RoundedRectangleBorder(
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(30),
                                                      ),
                                                      side: const BorderSide(
                                                          color: Colors.black,
                                                          width: 2.0),
                                                      backgroundColor:
                                                          const Color.fromARGB(
                                                              255, 236, 0, 0),
                                                    ),
                                                    onPressed: () {
                                                      Navigator.of(context)
                                                          .pop(); // Close the dialog
                                                      _deleteHabit(
                                                          id); // Proceed with deletion
                                                    },
                                                    child: const Text(
                                                      'Yes',
                                                      style: TextStyle(
                                                        color: Color.fromARGB(
                                                            255, 255, 255, 255),
                                                        fontSize: 16,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              );
                                            },
                                          );
                                        }
                                      },
                                      child: const Text(
                                        'Delete',
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    OutlinedButton(
                                      style: OutlinedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 24, vertical: 12),
                                        shape: RoundedRectangleBorder(
                                          borderRadius:
                                              BorderRadius.circular(30),
                                        ),
                                        side: const BorderSide(
                                            color: Colors.black,
                                            width: 2.0), // Black border
                                        backgroundColor: const Color(
                                            0xFF64FCD9), // Button background color
                                      ),
                                      onPressed: () {
                                        if (id != null) {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) =>
                                                  EditHabitScreen(
                                                userId: widget.userId,
                                                habit: habit,
                                              ),
                                            ),
                                          ).then((result) {
                                            if (result == true) {
                                              _fetchHabits();
                                            }
                                          });
                                        }
                                      },
                                      child: const Text(
                                        'Edit',
                                        style: TextStyle(
                                          color: Colors.black,
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                        ],
                      ),
                    );
                  },
                ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16.0),
        child: OutlinedButton(
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(30),
            ),
            side: const BorderSide(
                color: Colors.black, width: 2.0), // Black border
            backgroundColor: const Color(0xFF64FCD9), // Button background color
          ),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => AddHabitScreen(userId: widget.userId),
              ),
            ).then((_) => _fetchHabits());
          },
          child: const Text(
            'Add Habit',
            style: TextStyle(
              color: Colors.black,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
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
    final double progress = (streak / goal).clamp(0.0, 1.0);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      height: 50,
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(25),
      ),
      child: Stack(
        children: [
          Positioned.fill(
            child: FractionallySizedBox(
              widthFactor: progress,
              alignment: Alignment.centerLeft,
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF64FCD9),
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
            ),
          ),
          Positioned(
            left: progress * 100,
            top: 0,
            child: Transform.translate(
              offset: const Offset(-8, 6),
              child: const Icon(
                Icons.directions_car,
                size: 25,
                color: Colors.black,
              ),
            ),
          ),
        ],
      ),
    );
  }
}