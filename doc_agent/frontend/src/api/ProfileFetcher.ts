import axios from "axios";
import { Profile } from "@/interfaces/user-interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const BASE_API_URL: string = import.meta.env.VITE_DOC_BASE_API;

// function to get the profile of the user from the database
export const fetchProfile = async (user_id: string | undefined) => {
  // pass the user id in the url to make a request to get the profile from backend
  return await axios.get<Profile>(`${BASE_API_URL}/api/profile/${user_id}`);
};

export const updateProfile = async (
  user_id: string | undefined,
  profile: Profile,
) => {
  // handle if the user id is undefined
  if (!user_id) {
    throw new Error("User id is undefined");
  }

  return await axios.put<Profile>(
    `${BASE_API_URL}/api/profile/${user_id}`,
    profile,
  );
};

export const useUpdateProfile = (user_id: string | undefined) => {
  // query client to invalidate the query
  const queryClient = useQueryClient();

  // mutate to update the profile
  return useMutation({
    mutationFn: (changedName: string) => {
      // TODO: add in the avatar_url as a param later on
      // create profile object to store the new name to pass to the backend
      const profile: Profile = {
        username: changedName,
        avatar_url: "blank", // TODO: add in actual avatar_url later on
        user_id: user_id, // NOTE: may be undefined because the user may not be logged in
      };

      // make the put request to update the profile get back the response from the backend
      return updateProfile(user_id, profile);
    },
    onSuccess: () => {
      // invalidate the query to profile use the user id as a query key
      queryClient.invalidateQueries({ queryKey: ["profile", user_id] });
    },
  });
};

// hook to fetch the profile of the user
export const useProfile = (user_id: string | undefined) => {
  // query to get the profile from the backend
  const ProfileQuery = useQuery({
    // refresh if the user changes
    queryKey: ["profile", user_id],
    queryFn: () => fetchProfile(user_id),
    enabled: !!user_id,
  });

  // the invalidation of the query is handled by the useUpdateProfile hook

  // return the query
  return ProfileQuery;
};
