// this is the file that I will use to handle the deleting of the chat session
import axios from "axios";
import { toast } from "sonner";

// bring in the .env variable to use
const BASE_API_URL = import.meta.env.VITE_DOC_BASE_API;

export const deleteChat = async (session_id: string | undefined) => {
  try {
    const deletedChat = await axios.delete(`${BASE_API_URL}/api/chat/${session_id}`);
    return deletedChat;
  } catch (error) {
    toast.error(`${error}`);
  }
}
