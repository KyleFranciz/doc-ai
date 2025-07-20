import axios from "axios";
import { Chat, GetMessagesResponse } from "../interfaces/chat-interfaces";

const BASE_API_URL: string = import.meta.env.VITE_DOC_BASE_API;

// function to get the messages for what ever the current chat session is
export const fetchMessages = async (sessionId: string | undefined) => {
  // session_id from the param that Im using
  // handle returning the whole response, useQuery will handle the rest
  return await axios.get<GetMessagesResponse>(
    `${BASE_API_URL}/api/chat/${sessionId}`
  );
};

// This helps with geting the titles of the chats that the user has (get_all_chat_titles) in the DB  
export const fetchChats = async (user_id: string | undefined) => {
  return await axios.get<Chat>(`${BASE_API_URL}/api/chats/${user_id}`);
};
