// import 'package:flutter/material.dart';
// import 'dart:convert';
// import 'package:http/http.dart' as http;

// class EditHabitScreen extends StatefulWidget {
//   final int userId;
//   final Map<String, dynamic> habit;

//   const EditHabitScreen({Key? key, required this.userId, required this.habit})
//       : super(key: key);

//   @override
//   State<EditHabitScreen> createState() => _EditHabitScreenState();
// }

// class _EditHabitScreenState extends State<EditHabitScreen> {
//   final _formKey = GlobalKey<FormState>();
//   final TextEditingController _nameController = TextEditingController();
//   final TextEditingController _amountController = TextEditingController();
//   final TextEditingController _frequencyController = TextEditingController();
//   final TextEditingController _frequencyPerController = TextEditingController();
//   final TextEditingController _goalController = TextEditingController();
//   final TextEditingController _measurementUnitController =
//       TextEditingController();
//   String? selectedMeasurementType;
//   List<String> availableMeasurementUnits = [];

//   final Map<String, List<String>> measurementOptions = {
//     'distance': ['Miles', 'Kilometers'],
//     'time': ['Seconds', 'Minutes', 'Hours'],
//     'weight': ['Pounds', 'Ounces', 'Grams'],
//     'amount': ['Fluid Ounces'],
//   };

//   @override
//   void initState() {
//     super.initState();

//     final habit = widget.habit;

// // Parse "amount unit" into separate variables
//     final amountParts = habit['amount']?.split(' ') ?? [];
//     final double? parsedAmount =
//         amountParts.isNotEmpty ? double.tryParse(amountParts[0]) : null;
//     final String parsedMeasurementUnit =
//         amountParts.length > 1 ? amountParts[1] : '';

// // Set amount and measurement unit values
//     _amountController.text = parsedAmount?.toString() ?? '';
//     _measurementUnitController.text = parsedMeasurementUnit;

// // Parse "frequency per time" into separate variables
//     final frequencyParts = habit['frequency']?.split(' ') ?? [];
//     final int? parsedFrequency =
//         frequencyParts.isNotEmpty ? int.tryParse(frequencyParts[0]) : null;
//     final String parsedFrequencyPer =
//         frequencyParts.length > 1 ? frequencyParts[1] : '';

// // Set frequency and frequencyPer values
//     _frequencyController.text = parsedFrequency?.toString() ?? '';
//     _frequencyPerController.text = parsedFrequencyPer;

// // Initialize other variables
//     _nameController.text = habit['name'] ?? '';
//     _goalController.text = habit['goal']?.toString() ?? '';
//     selectedMeasurementType = habit['measurementType'];
//     availableMeasurementUnits =
//         measurementOptions[selectedMeasurementType] ?? [];
//   }

//   // Future<void> _saveChanges() async {
//   //   if (_formKey.currentState!.validate()) {
//   //     final updates = {
//   //       'name': _nameController.text,
//   //       'amount': _amountController.text,
//   //       'frequency': _frequencyController.text,
//   //       'frequencyPer': _frequencyPerController.text,
//   //       'goal': int.tryParse(_goalController.text) ?? 0,
//   //       'measurementType': selectedMeasurementType,
//   //       'measurementUnit': _measurementUnitController.text,
//   //     };

//   //     final habitId = widget.habit['_id'];
//   //     final url = Uri.parse('https://habittracktion.xyz/api/habits/$habitId');

//   //     try {
//   //       final response = await http.put(
//   //         url,
//   //         headers: {'Content-Type': 'application/json'},
//   //         body: jsonEncode(updates),
//   //       );

//   //       if (response.statusCode == 200) {
//   //         ScaffoldMessenger.of(context).showSnackBar(
//   //           const SnackBar(content: Text('Habit updated successfully!')),
//   //         );
//   //         Navigator.pop(context, true);
//   //       } else {
//   //         ScaffoldMessenger.of(context).showSnackBar(
//   //           SnackBar(
//   //               content:
//   //                   Text('Failed to update habit: ${response.statusCode}')),
//   //         );
//   //       }
//   //     } catch (error) {
//   //       print('Error updating habit: $error');
//   //       ScaffoldMessenger.of(context).showSnackBar(
//   //         const SnackBar(
//   //             content: Text('An error occurred while updating the habit.')),
//   //       );
//   //     }
//   //   }
//   // }

//   Future<void> _saveChanges() async {
//   if (_formKey.currentState!.validate()) {
//     final updates = {
//       'name': _nameController.text,
//       'amount': _amountController.text,
//       'frequency': _frequencyController.text,
//       'frequencyPer': _frequencyPerController.text,
//       'goal': int.tryParse(_goalController.text) ?? 0,
//       'measurementType': selectedMeasurementType,
//       'measurementUnit': _measurementUnitController.text,
//       'streak': widget.habit['streak'] ?? 0, // Include the current streak
//     };

//     final habitId = widget.habit['_id'];
//     final url = Uri.parse('https://habittracktion.xyz/api/habits/$habitId');

//     try {
//       final response = await http.put(
//         url,
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode(updates),
//       );

//       if (response.statusCode == 200) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('Habit updated successfully!')),
//         );
//         Navigator.pop(context, true);
//       } else {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//               content: Text('Failed to update habit: ${response.statusCode}')),
//         );
//       }
//     } catch (error) {
//       print('Error updating habit: $error');
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(
//             content: Text('An error occurred while updating the habit.')),
//       );
//     }
//   }
// }


//   void _updateMeasurementOptions(String? type) {
//     setState(() {
//       selectedMeasurementType = type;
//       availableMeasurementUnits = measurementOptions[type] ?? [];
//       _measurementUnitController.clear();
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('Edit Habit')),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Form(
//           key: _formKey,
//           child: ListView(
//             children: [
//               TextFormField(
//                 controller: _nameController,
//                 decoration: const InputDecoration(labelText: 'Habit Name'),
//                 validator: (value) => value!.isEmpty ? 'Enter a Name' : null,
//               ),
//               const SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 value: measurementOptions.keys.contains(selectedMeasurementType)
//                     ? selectedMeasurementType
//                     : null,
//                 onChanged: _updateMeasurementOptions,
//                 items: measurementOptions.keys
//                     .map((type) => DropdownMenuItem(
//                           value: type,
//                           child:
//                               Text(type[0].toUpperCase() + type.substring(1)),
//                         ))
//                     .toList(),
//                 decoration:
//                     const InputDecoration(labelText: 'Measurement Type'),
//                 validator: (value) => value == null ? 'Select a Type' : null,
//               ),
//               const SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 value: availableMeasurementUnits
//                         .contains(_measurementUnitController.text)
//                     ? _measurementUnitController.text
//                     : null,
//                 onChanged: (value) {
//                   setState(() {
//                     _measurementUnitController.text = value!;
//                   });
//                 },
//                 items: availableMeasurementUnits
//                     .map((unit) => DropdownMenuItem(
//                           value: unit,
//                           child: Text(unit),
//                         ))
//                     .toList(),
//                 decoration:
//                     const InputDecoration(labelText: 'Measurement Unit'),
//                 validator: (value) => value == null ? 'Select Unit' : null,
//               ),
//               const SizedBox(height: 16),
//               TextFormField(
//                 controller: _amountController,
//                 decoration: const InputDecoration(labelText: 'Amount'),
//                 keyboardType: TextInputType.number,
//                 validator: (value) {
//                   if (value!.isEmpty) return 'Enter Amount';
//                   if (double.tryParse(value) == null)
//                     return 'Enter a valid number';
//                   return null;
//                 },
//               ),
//               const SizedBox(height: 16),
//               TextFormField(
//                 controller: _frequencyController,
//                 decoration: const InputDecoration(labelText: 'Frequency'),
//                 keyboardType: TextInputType.number,
//                 validator: (value) {
//                   if (value!.isEmpty) return 'Enter Frequency';
//                   if (int.tryParse(value) == null)
//                     return 'Enter a valid number';
//                   return null;
//                 },
//               ),
//               const SizedBox(height: 16),
//               TextFormField(
//                 controller: _frequencyPerController,
//                 decoration: const InputDecoration(labelText: 'Per'),
//                 validator: (value) => value!.isEmpty ? 'Enter Per' : null,
//               ),
//               const SizedBox(height: 16),
//               TextFormField(
//                 controller: _goalController,
//                 decoration: const InputDecoration(labelText: 'Goal (days)'),
//                 keyboardType: TextInputType.number,
//                 validator: (value) {
//                   if (value!.isEmpty) return 'Enter Goal';
//                   if (int.tryParse(value) == null)
//                     return 'Enter a valid number';
//                   return null;
//                 },
//               ),
//               const SizedBox(height: 20),
//               ElevatedButton(
//                 onPressed: _saveChanges,
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: const Color(0xFFFFE6E6),
//                   padding: const EdgeInsets.symmetric(vertical: 16),
//                   shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(24.0),
//                   ),
//                 ),
//                 child: const Text(
//                   'Save Changes',
//                   style: TextStyle(
//                     color: Colors.red,
//                     fontWeight: FontWeight.bold,
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// import 'package:flutter/material.dart';
// import 'dart:convert';
// import 'package:http/http.dart' as http;

// class EditHabitScreen extends StatefulWidget {
//   final int userId;
//   final Map<String, dynamic> habit;

//   const EditHabitScreen({Key? key, required this.userId, required this.habit})
//       : super(key: key);

//   @override
//   State<EditHabitScreen> createState() => _EditHabitScreenState();
// }

// class _EditHabitScreenState extends State<EditHabitScreen> {
//   final _formKey = GlobalKey<FormState>();
//   final TextEditingController _nameController = TextEditingController();
//   final TextEditingController _amountController = TextEditingController();
//   final TextEditingController _frequencyController = TextEditingController();
//   final TextEditingController _frequencyPerController = TextEditingController();
//   final TextEditingController _goalController = TextEditingController();
//   final TextEditingController _measurementUnitController =
//       TextEditingController();
//   String? selectedMeasurementType;
//   List<String> availableMeasurementUnits = [];

//   final Map<String, List<String>> measurementOptions = {
//     'distance': ['Miles', 'Kilometers'],
//     'time': ['Seconds', 'Minutes', 'Hours'],
//     'weight': ['Pounds', 'Ounces', 'Grams'],
//     'amount': ['Fluid Ounces'],
//   };

//   @override
//   void initState() {
//     super.initState();

//     final habit = widget.habit;

// // Parse "amount unit" into separate variables
//     final amountParts = habit['measurementUnit']?.split(' ') ?? [];
//     final double? parsedAmount =
//         amountParts.isNotEmpty ? double.tryParse(amountParts[0]) : null;
//     final String parsedMeasurementUnit =
//         amountParts.length > 1 ? amountParts[1] : '';

// // Set amount and measurement unit values
//     _amountController.text = parsedAmount?.toString() ?? '';
//     _measurementUnitController.text = parsedMeasurementUnit;

// // Parse "frequency per time" into separate variables
//     final frequencyParts = habit['frequency']?.split(' ') ?? [];
//     final int? parsedFrequency =
//         frequencyParts.isNotEmpty ? int.tryParse(frequencyParts[0]) : null;
//     final String parsedFrequencyPer =
//         frequencyParts.length > 1 ? frequencyParts[2] : '';

// // Set frequency and frequencyPer values
//     _frequencyController.text = parsedFrequency?.toString() ?? '';
//     _frequencyPerController.text = parsedFrequencyPer;

// // Initialize other variables
//     _nameController.text = habit['name'] ?? '';
//     _goalController.text = habit['goal']?.toString() ?? '';
//     selectedMeasurementType = habit['measurementType'];
//     availableMeasurementUnits =
//         measurementOptions[selectedMeasurementType] ?? [];
//   }

//   // Future<void> _saveChanges() async {
//   //   if (_formKey.currentState!.validate()) {
//   //     final updates = {
//   //       'name': _nameController.text,
//   //       'amount': _amountController.text,
//   //       'frequency': _frequencyController.text,
//   //       'frequencyPer': _frequencyPerController.text,
//   //       'goal': int.tryParse(_goalController.text) ?? 0,
//   //       'measurementType': selectedMeasurementType,
//   //       'measurementUnit': _measurementUnitController.text,
//   //     };

//   //     final habitId = widget.habit['_id'];
//   //     final url = Uri.parse('https://habittracktion.xyz/api/habits/$habitId');

//   //     try {
//   //       final response = await http.put(
//   //         url,
//   //         headers: {'Content-Type': 'application/json'},
//   //         body: jsonEncode(updates),
//   //       );

//   //       if (response.statusCode == 200) {
//   //         ScaffoldMessenger.of(context).showSnackBar(
//   //           const SnackBar(content: Text('Habit updated successfully!')),
//   //         );
//   //         Navigator.pop(context, true);
//   //       } else {
//   //         ScaffoldMessenger.of(context).showSnackBar(
//   //           SnackBar(
//   //               content:
//   //                   Text('Failed to update habit: ${response.statusCode}')),
//   //         );
//   //       }
//   //     } catch (error) {
//   //       print('Error updating habit: $error');
//   //       ScaffoldMessenger.of(context).showSnackBar(
//   //         const SnackBar(
//   //             content: Text('An error occurred while updating the habit.')),
//   //       );
//   //     }
//   //   }
//   // }

//   Future<void> _saveChanges() async {
//   if (_formKey.currentState!.validate()) {
//     final updates = {
//       'name': _nameController.text,
//       'frequency': "${_frequencyController.text} per ${_frequencyPerController.text}",
//       'goal': int.tryParse(_goalController.text) ?? 0,
//       'measurementType': selectedMeasurementType,
//       'measurementUnit': "${_amountController.text} ${_measurementUnitController.text}",
//       'streak': widget.habit['streak'] ?? 0,
//     };

//     final habitId = widget.habit['_id'];
//     final url = Uri.parse('https://habittracktion.xyz/api/habits/$habitId');

//     try {
//       final response = await http.put(
//         url,
//         headers: {'Content-Type': 'application/json'},
//         body: jsonEncode(updates),
//       );

//       if (response.statusCode == 200) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('Habit updated successfully!')),
//         );
//         Navigator.pop(context, true);
//       } else {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//               content: Text('Failed to update habit: ${response.statusCode}')),
//         );
//       }
//     } catch (error) {
//       print('Error updating habit: $error');
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(
//             content: Text('An error occurred while updating the habit.')),
//       );
//     }
//   }
// }


//   void _updateMeasurementOptions(String? type) {
//     setState(() {
//       selectedMeasurementType = type;
//       availableMeasurementUnits = measurementOptions[type] ?? [];
//       _measurementUnitController.clear();
//     });
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('Edit Habit')),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: Form(
//           key: _formKey,
//           child: ListView(
//             children: [
//               TextFormField(
//                 controller: _nameController,
//                 decoration: const InputDecoration(labelText: 'Habit Name'),
//                 validator: (value) => value!.isEmpty ? 'Enter a Name' : null,
//               ),
//               const SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 value: measurementOptions.keys.contains(selectedMeasurementType)
//                     ? selectedMeasurementType
//                     : null,
//                 onChanged: _updateMeasurementOptions,
//                 items: measurementOptions.keys
//                     .map((type) => DropdownMenuItem(
//                           value: type,
//                           child:
//                               Text(type[0].toUpperCase() + type.substring(1)),
//                         ))
//                     .toList(),
//                 decoration:
//                     const InputDecoration(labelText: 'Measurement Type'),
//                 validator: (value) => value == null ? 'Select a Type' : null,
//               ),
//               const SizedBox(height: 16),
//               DropdownButtonFormField<String>(
//                 value: availableMeasurementUnits
//                         .contains(_measurementUnitController.text)
//                     ? _measurementUnitController.text
//                     : null,
//                 onChanged: (value) {
//                   setState(() {
//                     _measurementUnitController.text = value!;
//                   });
//                 },
//                 items: availableMeasurementUnits
//                     .map((unit) => DropdownMenuItem(
//                           value: unit,
//                           child: Text(unit),
//                         ))
//                     .toList(),
//                 decoration:
//                     const InputDecoration(labelText: 'Measurement Unit'),
//                 validator: (value) => value == null ? 'Select Unit' : null,
//               ),
//               const SizedBox(height: 16),
//               TextFormField(
//                 controller: _amountController,
//                 decoration: const InputDecoration(labelText: 'Amount'),
//                 keyboardType: TextInputType.number,
//                 validator: (value) {
//                   if (value!.isEmpty) return 'Enter Amount';
//                   if (double.tryParse(value) == null)
//                     return 'Enter a valid number';
//                   return null;
//                 },
//               ),
//               const SizedBox(height: 16),
//               TextFormField(
//                 controller: _frequencyController,
//                 decoration: const InputDecoration(labelText: 'Frequency'),
//                 keyboardType: TextInputType.number,
//                 validator: (value) {
//                   if (value!.isEmpty) return 'Enter Frequency';
//                   if (int.tryParse(value) == null)
//                     return 'Enter a valid number';
//                   return null;
//                 },
//               ),
//               const SizedBox(height: 16),
//               TextFormField(
//                 controller: _frequencyPerController,
//                 decoration: const InputDecoration(labelText: 'Per'),
//                 validator: (value) => value!.isEmpty ? 'Enter Per' : null,
//               ),
//               const SizedBox(height: 16),
//               TextFormField(
//                 controller: _goalController,
//                 decoration: const InputDecoration(labelText: 'Goal (days)'),
//                 keyboardType: TextInputType.number,
//                 validator: (value) {
//                   if (value!.isEmpty) return 'Enter Goal';
//                   if (int.tryParse(value) == null)
//                     return 'Enter a valid number';
//                   return null;
//                 },
//               ),
//               const SizedBox(height: 20),
//               ElevatedButton(
//                 onPressed: _saveChanges,
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: const Color(0xFFFFE6E6),
//                   padding: const EdgeInsets.symmetric(vertical: 16),
//                   shape: RoundedRectangleBorder(
//                     borderRadius: BorderRadius.circular(24.0),
//                   ),
//                 ),
//                 child: const Text(
//                   'Save Changes',
//                   style: TextStyle(
//                     color: Colors.red,
//                     fontWeight: FontWeight.bold,
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import '../authService.dart';

class AddHabitScreen extends StatefulWidget {
  final int userId;

  const AddHabitScreen({Key? key, required this.userId}) : super(key: key);

  @override
  State<AddHabitScreen> createState() => _AddHabitScreenState();
}

class _AddHabitScreenState extends State<AddHabitScreen> {
  final _authService = AuthService();
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _measurementOptionsController =
      TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _frequencyController = TextEditingController();
  final TextEditingController _frequencyPerController = TextEditingController();
  final TextEditingController _goalController = TextEditingController();

  final Map<String, List<String>> measurementOptions = {
    'distance': ['Miles', 'Kilometers'],
    'time': ['Seconds', 'Minutes', 'Hours'],
    'weight': ['Pounds', 'Ounces', 'Grams'],
    'amount': ['Fluid Ounces'],
  };

  final List<String> frequencyPerOptions = ['day', 'week'];

  String? selectedMeasurementType;
  List<String> availableOptions = [];

  void _updateMeasurementOptions(String type) {
    setState(() {
      selectedMeasurementType = type;
      availableOptions = measurementOptions[type] ?? [];
      _measurementOptionsController.clear();
    });
  }

  Future<void> _addHabit() async {
    if (_formKey.currentState!.validate()) {
      try {
        final name = _nameController.text;
        final measurementType = selectedMeasurementType;
        final measurementUnit =
            _amountController.text + ' ' + _measurementOptionsController.text;
        final frequency = (_frequencyController.text +
            ' per ' +
            _frequencyPerController.text);
        final goal = int.parse(_goalController.text);

        // Debugging: Print values and their data types

        Map<String, dynamic> habit = {
          'name': name,
          'measurementType': measurementType,
          'measurementUnit': measurementUnit,
          'frequency': frequency,
          'goal': goal,
          'UserID': widget.userId,
        };

        print('Sending habit data to API: $habit');
        final success = await _authService.addHabit(habit);
        print('API call success: $success');
        print(widget.userId);
        print(habit);

        if (success) {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Habit added successfully!')),
          );
        } else {
          _showErrorDialog('Failed to add habit');
        }
      } catch (e) {
        _showErrorDialog('An error occurred: ${e.toString()}');
      }
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Error'),
          content: Text(message),
          actions: <Widget>[
            TextButton(
              child: const Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text(
          'Add Habit',
          style: TextStyle(
            fontSize: 28, // Adjust the font size
            fontWeight: FontWeight.bold, // Optional: Adjust the weight
            fontFamily: 'RubikMono', // Specify the font family
            color: Colors.black, // Adjust the text color
          ),
        ),
        backgroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Habit Name'),
                validator: (value) => value!.isEmpty ? 'Enter a Name' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: selectedMeasurementType,
                onChanged: (value) => _updateMeasurementOptions(value!),
                items: measurementOptions.keys
                    .map((type) => DropdownMenuItem<String>(
                          value: type,
                          child: Text(type.capitalize()),
                        ))
                    .toList(),
                decoration:
                    const InputDecoration(labelText: 'Measurement Type'),
                validator: (value) => value == null ? 'Select a Type' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _measurementOptionsController.text.isEmpty
                    ? null
                    : _measurementOptionsController.text,
                onChanged: (value) {
                  setState(() {
                    _measurementOptionsController.text = value!;
                  });
                },
                items: availableOptions
                    .map((option) => DropdownMenuItem<String>(
                          value: option,
                          child: Text(option),
                        ))
                    .toList(),
                decoration:
                    const InputDecoration(labelText: 'Measurement Unit'),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Select Unit' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _amountController,
                decoration: const InputDecoration(labelText: 'Amount'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value!.isEmpty) return 'Enter Amount';
                  if (double.tryParse(value) == null) {
                    return 'Enter a valid number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _frequencyController,
                decoration: const InputDecoration(labelText: 'Frequency'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value!.isEmpty) return 'Enter Frequency';
                  if (int.tryParse(value) == null) {
                    return 'Enter a valid number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _frequencyPerController.text.isEmpty
                    ? null
                    : _frequencyPerController.text,
                onChanged: (value) {
                  setState(() {
                    _frequencyPerController.text = value!;
                  });
                },
                items: frequencyPerOptions
                    .map((value) => DropdownMenuItem<String>(
                          value: value,
                          child: Text(value.capitalize()),
                        ))
                    .toList(),
                decoration: const InputDecoration(labelText: 'Per'),
                validator: (value) =>
                    value == null || value.isEmpty ? 'Select Per' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _goalController,
                decoration: const InputDecoration(labelText: 'Goal (days)'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value!.isEmpty) return 'Enter Goal';
                  if (int.tryParse(value) == null) {
                    return 'Enter a valid number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              const SizedBox(height: 20),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  side: const BorderSide(
                      color: Colors.black,
                      width: 2.0), // Consistent black outline
                  backgroundColor:
                      const Color(0xFF64FCD9), // Button background color
                ),
                onPressed: _addHabit,
                child: const Text(
                  'Add Habit',
                  style: TextStyle(
                    fontSize: 18, // Adjust font size
                    fontWeight: FontWeight.bold, // Adjust font weight
                    fontFamily: 'Roboto', // Optional: Specify custom font
                    color: Colors.black, // Adjust font color
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${this.substring(1)}";
  }
}