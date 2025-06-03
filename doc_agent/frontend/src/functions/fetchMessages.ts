import axios from "axios";

export const fetchMessages = async (
  sessionId: string | undefined
): Promise<void> => {
  const BASE_API_URL: string = import.meta.env.VITE_DOC_BASE_API; // get the base api url from the .env file
  if (!BASE_API_URL) {
    console.log("fetch url didn't load");
  }

  const res = await axios.get(`${BASE_API_URL}/api/chat/${sessionId}`);
  return res.data;
};
