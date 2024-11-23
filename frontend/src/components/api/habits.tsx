import { Habit } from '../types/habit'

const API_URL = 'http://localhost:5000/api/habits'

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    // If the response is not JSON, read it as text and throw an error
    const text = await response.text();
    throw new Error(`Received non-JSON response: ${text}`);
  }
}

export async function fetchHabits(UserID: string): Promise<Habit[]> {
  try {
    const response = await fetch(`${API_URL}?UserID=${UserID}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
}

export async function addHabit(habit: Omit<Habit, '_id' | 'streak' | 'goal'>): Promise<Habit> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habit),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return handleResponse(response);
  } catch (error) {
    console.error('Error adding habit:', error);
    throw error;
  }
}

export async function editHabit(id: string, habit: Partial<Habit>): Promise<Habit> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habit),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return handleResponse(response);
  } catch (error) {
    console.error('Error editing habit:', error);
    throw error;
  }
}

export async function deleteHabit(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await handleResponse(response);
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
}

