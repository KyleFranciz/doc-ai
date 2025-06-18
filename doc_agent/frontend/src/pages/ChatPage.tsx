import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChatBox from "../components/ChatBox";

import MessageRender from "../components/messageRender";
import { SyncLoader } from "react-spinners";
import { useRef, useState } from "react";
import { MessageToDoc } from "./Promptpage";
import axios from "axios";
import { fetchMessages } from "../api/ChatFetcher";
import { toast } from "sonner";

export default function ChatPage() {
  // requires a setMessage (set state), handleSubmit (function triggered on submit), loading(boolean to control loading state)
  // States to use in this component
  const { sessionId } = useParams<{ sessionId: string | undefined }>(); // get the session id from the url, make sure that all the messages are sent to the same session
  const [chatInput, setChatInput] = useState<string>("");

  // new states for streaming
  const [currentStreamingMessage, setCurrentStreamingMessage] =
    useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  //import base url from the .env file
  const BASE_API_URL = import.meta.env.VITE_DOC_BASE_API; // get the base api url from the .env file
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // bring in session managing hook

  // use queryClient to help invalidate queries when the data changes
  const queryClient = useQueryClient();

  // useQuery custom hook I made to help with fetching the messages from the backend
  const { data, isPending, error } = useQuery({
    queryFn: () => fetchMessages(sessionId),
    queryKey: ["sessionMessages", { sessionId }],
  });

  // Streaming function using Fetch
  // Improved Streaming function using Fetch
  const streamMessage = async (message: string) => {
    setIsStreaming(true);
    setCurrentStreamingMessage("");

    // make the auto scroll to the bottom of the page
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const questionToDoc: MessageToDoc = {
      question: message,
      session_id: sessionId,
      user_id: "user_tester",
      role: "human",
    };

    try {
      // use Fetch instead of axios
      const res = await fetch(`${BASE_API_URL}/api/prompt?stream=true`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionToDoc),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch the message: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to read the response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("Stream complete");
          break; // stop the stream
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process the SSE message - improved parsing
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim().startsWith("data:")) {
            try {
              const jsonStr = line.slice(5).trim(); // Remove "data:" and trim whitespace
              if (jsonStr) {
                // Only parse if there's actual content
                const data = JSON.parse(jsonStr);

                if (data.type === "token") {
                  setCurrentStreamingMessage((prev) => prev + data.token);

                  // Auto-scroll as each content is added
                  if (bottomRef.current) {
                    bottomRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                } else if (data.type === "complete") {
                  console.log("Response complete");
                  // reset states
                  setIsStreaming(false);
                  setCurrentStreamingMessage("");

                  // Invalidates queries when the data changes from the database
                  queryClient.invalidateQueries({
                    queryKey: ["sessionMessages"],
                  });
                } else if (data.type === "error") {
                  console.error("Streaming error:", data.message);
                  toast.error(`Streaming failed: ${data.message}`);
                  //reset states
                  setIsStreaming(false);
                  setCurrentStreamingMessage("");
                }
              }
            } catch (parseError) {
              console.error(
                "Error parsing SSE data:",
                parseError,
                "Line:",
                line
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming Error:", error);
      toast.error(
        `Streaming failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      // Reset states on error
      setIsStreaming(false);
      setCurrentStreamingMessage("");
    }
  };

  const sendDownMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      // allow the user to scroll to the bottom of the page
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }

      const questionToDoc: MessageToDoc = {
        question: message,
        session_id: sessionId, // change the type if the message doesn't send
        user_id: "user_tester",
        role: "human",
      };

      const res = await axios.post(`${BASE_API_URL}/api/prompt`, questionToDoc);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessionMessages"] });
      setChatInput(""); // clear the input after its done
    },
    onError: (error) => toast.error(`Failed to update the chat: ${error}`, {}),
  });

  // Streaming Mutation
  const streamMessageMutation = useMutation({
    mutationFn: streamMessage,
    onSuccess: () => {
      setChatInput("");
      console.log("Streaming started successfully");
    },
    onError: (error) => {
      console.error("Failed to start stream:", error);
      toast.error(
        `Streaming failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      // reset the states
      setIsStreaming(false);
      setCurrentStreamingMessage("");
    },
  });

  const handleSendMessage = (message: string) => {
    setChatInput(""); // clear the input after its done

    const useStreaming = true; // set to true to enable streaming

    if (useStreaming) {
      streamMessageMutation.mutate(message); // call the streaming mutation
    } else {
      sendDownMessageMutation.mutate(message);
    }
  };

  // account for chat if not loading
  if (!sessionId) {
    return (
      <div>
        <h2>Failed Chat Session</h2>
        <p>chat session failed to load properly</p>
      </div>
    );
  }

  // Hooks to use to store the messages

  // base render for when the page loads and everything is successful
  return (
    <div className="flex flex-col items-center bg-[#171717]">
      <div className="pt-[60px] flex-shrink-0 p-4 border-b border-[gray]">
        <h1 className="text-[1.3rem] font-semibold">Chat {sessionId}</h1>
      </div>

      {/* Display error messages */}
      <div>
        {error && (
          <div className="flex-shrink-0">
            <strong>ERROR:</strong>
            {error.message}
          </div>
        )}
      </div>

      {/*If the chat has no messages*/}

      {/*Container for the chat messages to be displayed here */}
      <div className="px-4">
        {isPending ? (
          <div className="flex justify-center items-center h-64">
            <SyncLoader speedMultiplier={0.5} color="white" />
          </div>
        ) : (
          // render the messages from the backend using the data from the useGetSessionMessages hook
          <div className="h-full">
            <div className="h-full mt-[20px]">
              <MessageRender chatInfo={data?.data.messages || []} />
              {/*Handles the streaming request to the backend and back to the frontend */}
              {isStreaming && currentStreamingMessage && (
                <div className="">
                  <div className="p-2 my-1 max-w-xl rounded-md bg-[#171717] text-white">
                    {currentStreamingMessage}
                    <span className="animate-pulse">|</span>
                  </div>
                </div>
              )}
              {sendDownMessageMutation.isPending && (
                <div className="flex justify-center items-center py-5">
                  <div className="flex items-center justify-center bg-[#252525] rounded-[70px] p-2 h-[70px] w-[70px]">
                    <SyncLoader speedMultiplier={0.5} color="white" size={8} />
                  </div>
                </div>
              )}
              {/* Show loading for streaming */}
              {isStreaming && !currentStreamingMessage && (
                <div className="flex justify-center items-center py-5">
                  <div className="flex items-center justify-center bg-[#252525] rounded-[70px] p-2 h-[70px] w-[70px]">
                    <SyncLoader speedMultiplier={0.5} color="white" size={8} />
                  </div>
                </div>
              )}
              {/* Show error for sending messages */}
              {sendDownMessageMutation.error && (
                <div className="flex-shrink-0">
                  <strong>Message failed to send to the server...</strong>
                  {sendDownMessageMutation.error.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat box for sending messages to the backend*/}
      <div ref={bottomRef} className="pb-2  sticky bottom-0 bg-[#171717]">
        <ChatBox
          onSendMessage={handleSendMessage}
          chatInput={chatInput}
          setChatInput={setChatInput}
          isLoading={sendDownMessageMutation.isPending || isStreaming}
        />
      </div>
    </div>
  );
}
