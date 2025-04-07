import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchUserById = async (userId: string) => {
  const token = localStorage.getItem("jwtToken");

  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get(
      `http://44.216.113.234:8080/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      }
    );
    console.log("Fetched User Data:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error; 
  }
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId, 
  });
};
