import axios from "axios";
import { APIResponse, Profile } from "@/interfaces/user-interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/connections/supabaseClient";

const BASE_API_URL: string = import.meta.env.VITE_DOC_BASE_API;

// function to get the profile of the user from the database
export const fetchProfile = async (user_id: string | undefined) => {
  // pass the user id in the url to make a request to get the profile from backend
  // TODO: edit the type of the response to match the other route that I have for the profiles
  return await axios.get<Profile>(`${BASE_API_URL}/api/profiles/${user_id}`);
};

export const updateProfile = async (profile: Profile) => {
  // get the users current session info
  const session = await supabase.auth.getSession();
  const access_token = session.data.session?.access_token;

  // account for if the user isnt logged in or and attacker
  if (!access_token) {
    throw new Error("No access token found");
  }

  return await axios.put<APIResponse<Profile>>(
    `${BASE_API_URL}/api/profiles`,
    // profile to update
    profile,
    // headers for the request
    {
      headers: {
        // access token to make the request to the backend for auth edit
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
};

// hook to update the profile
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
      return updateProfile(profile);
    },
    onSuccess: () => {
      // invalidate the query to profile use the user id as a query key
      queryClient.invalidateQueries({ queryKey: ["profile", user_id] });
    },
  });
};

// hook to fetch the profile of the user
export const useProfile = (user_id: string | undefined) => {
  // check if the user_id is defined
  if (!user_id) {
    throw new Error("User id is undefined");
  }

  // otherwise make the query to get the profile from the backend
  const ProfileQuery = useQuery({
    // refresh if the user changes
    queryKey: ["profile", user_id],
    queryFn: () => fetchProfile(user_id),
    enabled: user_id !== undefined, // only enabled if the user is logged in, made the syntax clearer
  });

  // the invalidation of the query is handled by the useUpdateProfile hook

  // return the query
  return ProfileQuery;
};
