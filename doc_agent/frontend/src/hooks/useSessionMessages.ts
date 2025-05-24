import { useCallback, useRef, useState } from "react";
import {
  ChatMessage,
  GetMessagesResponse,
  UseSessionMessagesResponse,
  UseSessionOptions,
} from "../interfaces/chat-interfaces";
import axios, { AxiosError } from "axios";

// hook to grab the chat messages from the database
export const useSessionMessages = (
  options: UseSessionOptions
): UseSessionMessagesResponse => {
  const { sessionId, autoFetch = true, pollingInterval } = options;

  // state management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // for clean up
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef<boolean>(true);

  // handle api errors
  const handleApiErrors = useCallback((error: unknown): string => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return (
        axiosError.response?.data?.message ||
        axiosError.message ||
        "An error occurred"
      );
    }
    return error instanceof Error
      ? error.message
      : "An unknown error has occurred";
  }, []);

  // fetch messages from the database
  const fetchSessionMessages = useCallback(async (): Promise<void> => {
    // if there is no session id then return
    if (!sessionId) return;

    try {
      const BASE_API_URL: string | undefined = import.meta.env.VITE_DOC_BASE_API;
      setLoading(true);
      setError(null);

      const response = await axios.get<GetMessagesResponse>(
        `/${BASE_API_URL}/chat/${sessionId}`
      );

      // update the component is still mounted
      if (mountedRef.current) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = handleApiErrors(err);
        setError(errorMessage);
        console.error("Error Fetching data:", err);
      }
    } finally { 
        if (mountedRef.current) {
            setLoading(false)
        }
  }, [sessionId, handleApiErrors]);


};
