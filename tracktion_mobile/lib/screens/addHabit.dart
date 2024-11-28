import 'package:flutter/material.dart';
import '../authService.dart';

class AddHabitScreen extends StatefulWidget {
  const AddHabitScreen({super.key});

  @override
  State<AddHabitScreen> createState() => _AddHabitScreenState();
}

class _AddHabitScreenState extends State<AddHabitScreen> {
  final _authService = AuthService();
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _measurementOptionsController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _frequencyController = TextEditingController();
  final TextEditingController _frequencyPerController = TextEditingController();
  final TextEditingController _goalController = TextEditingController();

  // Available options for measurement and frequency
  final Map<String, List<String>> measurementOptions = {
    'distance': ['Miles', 'Kilometers'],
    'time': ['Seconds', 'Minutes', 'Hours'],
    'weight': ['Pounds', 'Ounces', 'Grams'],
    'amount': ['Fluid Ounces'],
  };

  final List<String> frequencyPerOptions = ['day', 'week'];

  String? selectedMeasurementType;
  List<String> availableOptions = [];

  // This function will update the available options based on the selected measurement type
  void _updateMeasurementOptions(String type) {
    setState(() {
      availableOptions = measurementOptions[type] ?? [];
    });
  }

  Future<void> _addHabit() async {
    if (_formKey.currentState!.validate()) {
      // Fetching the user ID dynamically from the auth service
      final userId = await _authService.getUserId(); // Assuming this function fetches the user ID
      
      final habit = {
      'name': _nameController.text,
      'measurementType': selectedMeasurementType,
      'measurementUnit': _measurementOptionsController.text,
      'amount': _amountController.text,
      'frequency': _frequencyController.text,
      'frequencyPer': _frequencyPerController.text,
      'goal': int.parse(_goalController.text),
      };

      final success = await _authService.addHabit(habit, userId); 
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Habit added successfully!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to add habit')),
        );
      }
    }
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
              DropdownButtonFormField<String>(
                value: selectedMeasurementType,
                onChanged: (value) {
                  setState(() {
                    selectedMeasurementType = value;
                    _updateMeasurementOptions(value!); // Update options when measurement type changes
                  });
                },
                items: ['distance', 'time', 'weight', 'amount']
                    .map((type) => DropdownMenuItem<String>(
                          value: type,
                          child: Text(type), // No need to capitalize
                        ))
                    .toList(),
                decoration: const InputDecoration(labelText: 'Measurement Type'),
                validator: (value) => value == null ? 'Select a Type' : null,
              ),
              DropdownButtonFormField<String>(
                value: _measurementOptionsController.text.isEmpty ? null : _measurementOptionsController.text,
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
                decoration: const InputDecoration(labelText: 'Measurement Unit'),
                validator: (value) => value == null || value.isEmpty ? 'Select Unit' : null,
              ),
              TextFormField(
                controller: _amountController,
                decoration: const InputDecoration(labelText: 'Amount'),
                validator: (value) => value!.isEmpty ? 'Enter Amount' : null,
              ),
              TextFormField(
                controller: _frequencyController,
                decoration: const InputDecoration(labelText: 'Frequency'),
                keyboardType: TextInputType.number, // Ensure that only numbers are input
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Enter Frequency';
                  }
                  // Optionally, you can validate if the value is a valid number
                  if (int.tryParse(value) == null) {
                    return 'Enter a valid number';
                  }
                  return null;
                },
              ),
              DropdownButtonFormField<String>(
                value: _frequencyPerController.text.isEmpty ? null : _frequencyPerController.text,
                onChanged: (value) {
                  setState(() {
                    _frequencyPerController.text = value!;
                  });
                },
                items: frequencyPerOptions
                    .map((value) => DropdownMenuItem<String>(
                          value: value,
                          child: Text(value),
                        ))
                    .toList(),
                decoration: const InputDecoration(labelText: 'Per'),
                validator: (value) => value == null || value.isEmpty ? 'Select Per' : null,
              ),
              TextFormField(
                controller: _goalController,
                decoration: const InputDecoration(labelText: 'Goal (days)'),
                keyboardType: TextInputType.number,
                validator: (value) => value!.isEmpty ? 'Enter Goal' : null,
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