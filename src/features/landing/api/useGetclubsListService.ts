const BASE_URL = "http://44.216.113.234:8080";

export const fetchClubs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/clubs`);
    if (!response.ok) {
      throw new Error("Failed to fetch club details");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

