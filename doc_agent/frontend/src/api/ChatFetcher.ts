import axios from "axios";
import { GetMessagesResponse } from "../interfaces/chat-interfaces";

const BASE_API_URL: string = import.meta.env.VITE_DOC_BASE_API;

// function to fetch the messages from the chat database
export const fetchMessages = async (sessionId: string | undefined) => {
  // session_id from the param that Im using
  // handle returning the whole response, useQuery will handle the rest
  return await axios.get<GetMessagesResponse>(
    `${BASE_API_URL}/api/chat/${sessionId}`
  );
};
