import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { MoreVertical, PenLine, Search, X } from 'lucide-react'
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { fetchHabits, addHabit, editHabit, deleteHabit } from './api/habits'
import { Habit } from './types/habit'

export default function Component() {
  const [date, setDate] = useState<Date>(new Date())
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitName, setHabitName] = useState("")
  const [measurementType, setMeasurementType] = useState("")
  const [measurementUnit, setMeasurementUnit] = useState("")
  const [measurementAmount, setMeasurementAmount] = useState("")
  const [frequency, setFrequency] = useState("")
  const [frequencyType, setFrequencyType] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  useEffect(() => {
    fetchHabits().then(setHabits).catch(console.error)
  }, [])

  async function handleCreateHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const newHabit = {
      name: habitName,
      measurementType,
      measurementUnit: `${measurementAmount} ${measurementUnit}`,
      frequency: `${frequency} per ${frequencyType}`,
    }

    try {
      if (editingHabit) {
        const updatedHabit = await editHabit(editingHabit._id, newHabit)
        setHabits(prevHabits => prevHabits.map(habit => 
          habit._id === updatedHabit._id ? updatedHabit : habit
        ))
      } else {
        const createdHabit = await addHabit(newHabit)
        setHabits(prevHabits => [...prevHabits, createdHabit])
      }
      resetForm()
    } catch (error) {
      console.error("Error creating/editing habit:", error)
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
    }
  }

  async function handleDeleteHabit(id: string) {
    try {
      await deleteHabit(id)
      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== id))
    } catch (error) {
      console.error("Error deleting habit:", error)
    }
  }

  function handleEditHabit(habit: Habit) {
    setEditingHabit(habit)
    setHabitName(habit.name)
    setMeasurementType(habit.measurementType)
    const [amount, unit] = habit.measurementUnit.split(' ')
    setMeasurementAmount(amount)
    setMeasurementUnit(unit)
    const [freq, , type] = habit.frequency.split(' ')
    setFrequency(freq)
    setFrequencyType(type)
    setIsDialogOpen(true)
  }

  function resetForm() {
    setHabitName("")
    setMeasurementType("")
    setMeasurementUnit("")
    setMeasurementAmount("")
    setFrequency("")
    setFrequencyType("")
    setEditingHabit(null)
  }

  const measurementOptions: { [key: string]: string[] } = {
    distance: ["Miles", "Kilometers"],
    time: ["Seconds", "Minutes", "Hours"],
    weight: ["Pounds", "Ounces", "Grams"],
    amount: ["Fluid Ounces"],
  }

  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#64FCD9] text-black p-6 space-y-8">
        <img
          src='../tracktion.png'
          alt="Tracktion logo"
          width={300}
          height={40}
          className="mb-8"
        />
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">USERNAME</h2>
          <h2 className="text-xl font-semibold">GROUPS</h2>
        </div>
        <div className="absolute bottom-6 space-y-4">
          <button className="block text-black/80 hover:text-black">Settings</button>
          <button className="block text-black/80 hover:text-black">About</button>
          <button className="block text-black/80 hover:text-black">Contact</button>
          <button className="block text-black/80 hover:text-black">Log Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center gap-4 mb-8">
          <Input className="w-48 bg-gray-200" placeholder="GROUP NAME" />
          <Input className="w-48 bg-gray-200" placeholder="HABIT NAME" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input className="w-48 bg-gray-200 pl-10" placeholder="SEARCH" />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-400 hover:bg-teal-500">
                {editingHabit ? 'EDIT HABIT' : '+ ADD HABIT'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingHabit ? 'Edit Habit' : 'Create a New Habit'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <Label htmlFor="habitName">Habit Name</Label>
                  <Input
                    id="habitName"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="measurementType">Measurement Type</Label>
                  <Select value={measurementType} onValueChange={setMeasurementType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Measurement Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="time">Time</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {measurementType && (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="measurementAmount">Amount</Label>
                      <Input
                        id="measurementAmount"
                        type="number"
                        value={measurementAmount}
                        onChange={(e) => setMeasurementAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="measurementUnit">Unit</Label>
                      <Select value={measurementUnit} onValueChange={setMeasurementUnit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {measurementOptions[measurementType]?.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      id="frequency"
                      type="number"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="frequencyType">Per</Label>
                    <Select value={frequencyType} onValueChange={setFrequencyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : (editingHabit ? "Update Habit" : "Create Habit")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" size="icon">
              <PenLine className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {habits.map((habit) => (
            <div
              key={habit._id}
              className="p-4 rounded-lg flex items-center justify-between bg-white border"
            >
              <div>
                <h3 className="font-semibold">{habit.name}</h3>
                <p className="text-sm opacity-70">
                  {habit.measurementUnit}, {habit.frequency}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEditHabit(habit)}>
                  <PenLine className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteHabit(habit._id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-48 bg-gray-200 rounded-full mb-8">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm text-gray-600">
            possible
            <br />
            "race track" thing to show
            <br />
            goal progression
          </div>
        </div>

        <div className="flex justify-end gap-8">
          <div className="bg-gray-400 p-4 rounded-lg">
            <div className="font-bold">Streak</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👑</span>
              <span>0 Days</span>
            </div>
          </div>

          <Calendar
            mode="single"
            selected={date}
            //onSelect={setDate}
            className="rounded-lg border"
          />
        </div>
      </div>
    </div>
  )
}

