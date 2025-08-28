// NOTE: THIS FILE WILL BE USED TO GET THE USERNAME FROM THE DATABASE TO BE USED IN DIFFERENT COMPONENTS
// TODO: FINISH THIS HOOK

import { fetchProfile } from "@/api/ProfileFetcher";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/connections/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

// hook to get the username from the database
export const useUsername = async () => {
  // query client
  const queryClient = useQueryClient();

  // state to hold the user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // make a function to get the user from the database, might make a hook and bring it in

  // useQuery to make the fetch from the backend
  const ProfileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
  });
};
