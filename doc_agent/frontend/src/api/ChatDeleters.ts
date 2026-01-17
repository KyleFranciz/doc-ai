// this is the file that I will use to handle the deleting of the chat session
import axios from "axios";
import { toast } from "sonner";
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

export const deleteChat = async (session_id: string | undefined) => {
  if (!session_id) {
    toast.error("No session id found");
    return;
  }

  // try to delete the data from the database
  try {
    const accessToken = await getAccessToken();

    // deletes the chat from the list of chats in the database
    const deletedChat = await axios.delete(
      `${BASE_API_URL}/api/chat/${session_id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    // return the deleted chat data
    return deletedChat;
    //error handling
  } catch (error) {
    // notify that the message was not deleted
    toast.error(`${error}`);
  }
};
