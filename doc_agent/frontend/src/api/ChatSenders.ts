import axios from "axios";
import { MessageToDoc } from "@/interfaces/chat-interfaces";
import { supabase } from "../connections/supabaseClient";

// bring in the .env variable to use
const BASE_API_URL = import.meta.env.VITE_DOC_BASE_API;

const getAccessToken = async () => {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;
  if (!accessToken) {
    throw new Error("No access token found");
  }
  return accessToken;
};

// function to send post requests to the backend to post to current chat session
export const sendChatMessage = async (
  content: string,
  role: "human" | "ai" = "human",
  sessionId: string | undefined,
  // add in bearer token to help make chat more secure
): Promise<void> => {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user?.id;
  const accessToken = await getAccessToken();

  //format the question to send to Doc
  const questionToSend: MessageToDoc = {
    question: content,
    session_id: sessionId,
    user_id: userId,
    role: role, // human
    // send the bearer token to the backend to verify correct user
  };

  // send a post request to the backend to post to the current chat session
  return await axios.post(`${BASE_API_URL}/api/prompt`, questionToSend, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
