import axios from "axios";
import { GetMessagesResponse } from "../interfaces/chat-interfaces";

const BASE_API_URL: string | undefined = import.meta.env.VITE_DOC_BASE_API;

export const fetchMessages = async (sessionId: string | undefined) => {
  if (!BASE_API_URL) {
    throw new Error("Base Url is Missing");
  }

  if (!sessionId) {
    throw new Error("SessionId is Required");
  }
  return await axios.get<GetMessagesResponse>(
    `${BASE_API_URL}/api/chat/${sessionId}`
  ); // replace with the correct url
};
