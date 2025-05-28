import { useCallback, useRef, useState, useEffect } from "react";
import {
  ChatMessage,
  GetMessagesResponse,
  UseSessionMessagesReturn,
  UseSessionOptions,
} from "../interfaces/chat-interfaces";
import axios, { AxiosError } from "axios";
import { MessageToDoc } from "../pages/Promptpage";
import { supabase } from "../connections/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";

// hook to grab the chat messages from the database
export const useSessionMessages = (
  options: UseSessionOptions
): UseSessionMessagesReturn => {
  const { sessionId, autoFetch = true } = options;

  // state management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // for clean up
  const mountedRef = useRef<boolean>(true);
  const subscriptionRef = useRef<RealtimeChannel | null>(null); //todo: change the type later if problem occurs

  // .env variable to bring in to use in calls
  const BASE_API_URL: string | undefined = import.meta.env.VITE_DOC_BASE_API;

  if (!BASE_API_URL) {
    console.log("Could not load frontend url from .env");
  }

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

  // function that handles fetching messages from the database
  const fetchMessages = useCallback(async (): Promise<void> => {
    // if there is no session id then return
    if (!sessionId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<GetMessagesResponse>(
        // might add back in base url if request not successful
        `${BASE_API_URL}/api/chat/${sessionId}`
      );

      // update the component is still mounted
      if (!mountedRef.current) {
        setMessages(response.data.messages);
        console.log(response.data.messages);
      }

      // catch the error
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = handleApiErrors(err);
        setError(errorMessage);
        console.error("Error Fetching data:", err);
      }
      // finish the loading
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [sessionId, handleApiErrors, BASE_API_URL]);

  // setup the realtime subscription
  useEffect(() => {
    // if there is no session id then return leave the function
    if (!sessionId || !autoFetch) return;

    // first fetch
    fetchMessages();

    // subscribe to the messages
    const subscription = supabase
      .channel(`messages-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // listen to all changes
          schema: "public",
          table: "messages", // pulls data from the data table
          filter: `session_id=eq.${sessionId}`, // only pulls messages from the specific session
        },
        (payload) => {
          // if the component is not mounted then return
          if (!mountedRef.current) return;

          // otherwise update
          console.log("Realtime update happened:", payload);

          switch (payload.eventType) {
            case "INSERT":
              setMessages((prev) => {
                //prevent duplicates from happening
                const exists = prev.some((msg) => msg.id === payload.new.id);
                if (exists) return prev;
                return [...prev, payload.new as ChatMessage];
              });
              break;
            case "UPDATE":
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === payload.new.id ? (payload.new as ChatMessage) : msg
                )
              );
              break;

            case "DELETE":
              setMessages((prev) =>
                prev.filter((msg) => msg.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    // store the subscription in the ref
    subscriptionRef.current = subscription;

    // function to clean up the function
    return () => {
      // if there is a value in the ref
      if (subscriptionRef.current) {
        // remove the channel from the subscription
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [sessionId, autoFetch, fetchMessages]);

  // clean up the unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      // check if there is still a value for the subscriptionRef
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  // function to send the message to the api
  const sendMessage = useCallback(
    async (content: string, role: "human" | "ai" = "human"): Promise<void> => {
      // check if there is a sessionId or content to send
      if (!sessionId || !content.trim()) {
        //set the error message
        setError(
          "Please make sure that the sessionId and content are entered properly"
        );
        return;
      }
      // try to send the message to the api
      try {
        // reset error message to null
        setError(null);

        // format the message that I'll send
        const questionToSend: MessageToDoc = {
          question: content,
          session_id: sessionId,
          user_id: "user_tester",
          role: role,
        };

        // send the message to my api
        const res = await axios.post(
          // base url might add back if request not successful
          `${BASE_API_URL}/api/prompt`,
          questionToSend, // question, sessionId and user info sent
          {
            // header to send
            headers: { "Content-Type": "application/json" },
          }
        );

        // check if the component is currently mounted
        if (mountedRef.current) {
          // add the message to the state
          setMessages((prev) => [...prev, res.data]); // add all the data to the state
        }
      } catch (err) {
        if (mountedRef.current) {
          const errorMessage = handleApiErrors(err);
          setError(errorMessage);
          console.log("There was an error sending a message to doc:", err);
        }
      }
    },
    [sessionId, handleApiErrors, BASE_API_URL]
  );

  // function to refresh the messages, for manual refetching the messages
  const refreshMessages = useCallback(async (): Promise<void> => {
    // refresh and update the messages from the api
    await fetchMessages();
  }, [fetchMessages]);

  // function to clear the error
  const clearError = useCallback(() => {
    // reset the error to defaults
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refreshMessages,
    clearError,
  };
  //
};
