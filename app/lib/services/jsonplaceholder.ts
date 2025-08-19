export interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  website: string | null;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  } | null;
}

export async function fetchUsersFromJsonPlaceholder(): Promise<JsonPlaceholderUser[]> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users from JSONPlaceholder:', error);
    throw error;
  }
}


