// this is the file that I will use to handle the deleting of the chat session
import axios from "axios";
import { toast } from "sonner";

// bring in the .env variable to use
const BASE_API_URL = import.meta.env.VITE_DOC_BASE_API;

export const deleteChat = async (session_id: string | undefined) => {
  // try to delete the data from the database
  try {
    // deletes the chat from the list of chats in the database
    const deletedChat = await axios.delete(
      `${BASE_API_URL}/api/chat/${session_id}`,
    );

    // return the deleted chat data
    return deletedChat;
    //error handling
  } catch (error) {
    // notify that the message was not deleted
    toast.error(`${error}`);
  }
};
