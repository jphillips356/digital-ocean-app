import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
    final String baseUrl = 'http://10.0.2.2:5001/api'; 

  // Login function
  Future<bool> login(String login, String password) async {
    final url = Uri.parse('$baseUrl/login');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'login': login, 'password': password}),
    );

    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }

  // Register function
  Future<bool> register(String firstName, String lastName, String login, String password) async {
  final url = Uri.parse('$baseUrl/register');
  print('Attempting to register with:');
  print('URL: $url');
  print('Payload: ${jsonEncode({
    'firstName': firstName,
    'lastName': lastName,
    'login': login,
    'password': password,
  })}');

  try {
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        'login': login,
        'password': password,
      }),
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 201) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    print('Error during registration: $e');
    rethrow; // Optionally rethrow to handle further up the chain
  }
}

// Add habit function
Future<bool> addHabit(Map<String, dynamic> habit) async {
    final url = Uri.parse('$baseUrl/habits');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(habit),
    );

    return response.statusCode == 201; 
  }

  // Fetch habits function
  Future<List<Map<String, dynamic>>> fetchHabits(int userId) async {
    final url = Uri.parse('$baseUrl/habits?userId=$userId');
    final response = await http.get(
      url,
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final List habits = jsonDecode(response.body);
      return habits.cast<Map<String, dynamic>>();
    } else {
      throw Exception('Failed to fetch habits');
    }
  }

  // Update a habit function
  Future<bool> editHabit(String habitId, Map<String, dynamic> updates) async {
    final url = Uri.parse('$baseUrl/habits/$habitId');
    final response = await http.put(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(updates),
    );

    return response.statusCode == 200; 
  }

  // Delete a habit function
  Future<bool> deleteHabit(String habitId) async {
    final url = Uri.parse('$baseUrl/habits/$habitId');
    final response = await http.delete(
      url,
      headers: {'Content-Type': 'application/json'},
    );

    return response.statusCode == 200;
  }
  
  // Get user id function
  Future<int> getUserId() async {
  // Fetch user ID from local storage, or current user session
  return 1; // Just a placeholder, replace with real logic
}

}
