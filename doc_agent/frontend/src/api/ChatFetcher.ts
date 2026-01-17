import axios from "axios";
import { Chat, GetMessagesResponse } from "../interfaces/chat-interfaces";
import { supabase } from "../connections/supabaseClient";

const BASE_API_URL: string = import.meta.env.VITE_DOC_BASE_API;

const getAccessToken = async () => {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;
  if (!accessToken) {
    throw new Error("No access token found");
  }
  return accessToken;
};

// function to get the messages for what ever the current chat session is
export const fetchMessages = async (sessionId: string | undefined) => {
  const accessToken = await getAccessToken();

  // session_id from the param that Im using
  // handle returning the whole response, useQuery will handle the rest
  return await axios.get<GetMessagesResponse>(
    `${BASE_API_URL}/api/chat/${sessionId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
};

// This helps with geting the titles of the chats that the user has (get_all_chat_titles) in the DB
export const fetchChats = async () => {
  const accessToken = await getAccessToken();

  // otherwise get the chats fromm the database
  return await axios.get<Chat>(`${BASE_API_URL}/api/chats`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
