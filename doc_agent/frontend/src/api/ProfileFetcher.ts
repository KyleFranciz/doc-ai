import axios from "axios";
import { APIResponse, Profile } from "@/interfaces/user-interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/connections/supabaseClient";

const BASE_API_URL: string = import.meta.env.VITE_DOC_BASE_API;

const getOptionalAccessToken = async () => {
  const session = await supabase.auth.getSession();
  return session.data.session?.access_token ?? null;
};

const getAccessToken = async () => {
  const accessToken = await getOptionalAccessToken();
  if (!accessToken) {
    throw new Error("No access token found");
  }
  return accessToken;
};

// function to get the profile of the user from the database
export const fetchProfile = async (accessToken: string) => {
  // TODO: edit the type of the response to match the other route that I have for the profiles
  const response = await axios.get<Profile>(`${BASE_API_URL}/api/profiles`, {
    // headers for the request
    headers: { Authorization: `Bearer ${accessToken}` }, // header will send the access token to use in order to get the profile
  });

  return response?.data;
};

export const updateProfile = async (profile: Profile) => {
  const accessToken = await getAccessToken();

  return await axios.put<APIResponse<Profile>>(
    `${BASE_API_URL}/api/profiles`,
    // profile to update
    profile,
    // headers for the request
    {
      headers: {
        // access token to make the request to the backend for auth edit
        Authorization: `Bearer ${accessToken}`,
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

// WARN: LOOK BACK AT THIS FUNCTION TO SEE IF THE USER ID IS NEED
// hook to fetch the profile of the user
export const useProfile = (user_id: string | undefined) => {
  const sessionQuery = useQuery({
    queryKey: ["session-token"],
    queryFn: getOptionalAccessToken,
  });

  const accessToken = sessionQuery.data;

  // otherwise make the query to get the profile from the backend
  const ProfileQuery = useQuery({
    // refresh if the user changes
    queryKey: ["profile", user_id],
    queryFn: () => fetchProfile(accessToken as string),
    enabled: Boolean(user_id && accessToken), // only enabled when a user ID and token are present
  });

  // the invalidation of the query is handled by the useUpdateProfile hook

  return {
    ...ProfileQuery,
    isLoading: ProfileQuery.isLoading || sessionQuery.isLoading,
    error: ProfileQuery.error ?? sessionQuery.error,
  };
};
