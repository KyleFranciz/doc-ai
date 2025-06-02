import axios from "axios";
import { MessageToDoc } from "../pages/Promptpage";

// bring in the .env variable to use
const BASE_API_URL = import.meta.env.VITE_DOC_BASE_API;

// function to send post requests to the backend to post to current chat session
export const sendChatMessage = async (
  content: string,
  role: "human" | "ai" = "human",
  sessionId: string | undefined
): Promise<void> => {
  //format the question to send to Doc
  const questionToSend: MessageToDoc = {
    question: content,
    session_id: sessionId,
    user_id: "user_tester",
    role: role, // human
  };

  // send a post request to the backend to post to the current chat session
  return await axios.post(`${BASE_API_URL}/api/prompt`, {
    questionToSend,
  });
};
