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
        final measurementUnit = _measurementOptionsController.text;
        final amount = double.parse(_amountController.text);
        final frequency = int.parse(_frequencyController.text);
        final frequencyPer = _frequencyPerController.text;
        final goal = int.parse(_goalController.text);

        // Debugging: Print values and their data types
        print('name: $name, type: ${name.runtimeType}');
        print(
            'measurementType: $measurementType, type: ${measurementType.runtimeType}');
        print(
            'measurementUnit: $measurementUnit, type: ${measurementUnit.runtimeType}');
        print('amount: $amount, type: ${amount.runtimeType}');
        print('frequency: $frequency, type: ${frequency.runtimeType}');
        print('frequencyPer: $frequencyPer, type: ${frequencyPer.runtimeType}');
        print('goal: $goal, type: ${goal.runtimeType}');

        Map<String, dynamic> habit = {
          'name': name,
          'measurementType': measurementType,
          'measurementUnit': measurementUnit,
          'amount': amount,
          'frequency': frequency,
          'frequencyPer': frequencyPer,
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
      appBar: AppBar(title: const Text('Add Habit')),
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
              ElevatedButton(
                onPressed: _addHabit,
                child: const Text('Add Habit'),
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
