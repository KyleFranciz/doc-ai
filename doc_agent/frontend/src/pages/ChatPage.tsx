import { useLocation, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChatBox from "../components/ChatBox";
import MessageRender from "../components/messageRender";
import { SyncLoader } from "react-spinners";
import { useEffect, useRef, useState } from "react";
import { MessageToDoc } from "./Promptpage";
//import axios from "axios";
import { fetchMessages } from "../api/ChatFetcher";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

//TODO: Make the markdown out put from the use display properly on the frontend

//interface for the the user for the chat page
interface ChatPageUserI {
  user: User | null;
}

// TODO: Update the sidebar with the title whenever the user makes a new chat with Doc

export default function ChatPage({ user }: ChatPageUserI) {
  // requires a setMessage (set state), handleSubmit (function triggered on submit), loading(boolean to control loading state)
  // States to use in this component
  const { sessionId } = useParams<{ sessionId: string | undefined }>(); // get the session id from the url, make sure that all the messages are sent to the same session
  const location = useLocation();

  // use queryClient to help invalidate queries when the data changes
  const queryClient = useQueryClient();

  const [chatInput, setChatInput] = useState<string>("");
  // new states for streaming
  const [currentStreamingMessage, setCurrentStreamingMessage] =
    useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  // handle the user question to be displayed while the message is being streamed
  const [userQuestion, setUserQuestion] = useState<string>("");

  //import base url from the .env file
  const BASE_API_URL = import.meta.env.VITE_DOC_BASE_API; // get the base api url from the .env file
  const bottomRef = useRef<HTMLDivElement | null>(null);
  //const initialPromptHandled = useRef(false); // ref to prevent the initial prompt from re-running over and over
  // bring in session managing hook

  // useQuery function to get all the messages for the current session
  const { data, isPending, error } = useQuery({
    queryFn: () => fetchMessages(sessionId),
    queryKey: ["sessionMessages", sessionId],
  });

  // Streaming function using Fetch
  // Improved Streaming function using Fetch
  const streamMessage = async (message: string) => {
    setIsStreaming(true);
    setCurrentStreamingMessage("");
    setUserQuestion(message); // set the user question to be displayed while streaming, make my UI look cleaner

    // make the auto scroll to the bottom of the page
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }

    // Question that is sent to doc
    const questionToDoc: MessageToDoc = {
      question: message, // question to Doc
      session_id: sessionId, // current session
      user_id: user?.id, // the id of the current user
      role: "human", // human sending the message
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

      if (!res.ok || !res.body) {
        throw new Error(`Failed to fetch the message: ${res.status}`);
      }
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
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
                  setIsStreaming(false);
                  setCurrentStreamingMessage("");
                  // Invalidates queries when the data changes from the database
                  queryClient.invalidateQueries({
                    queryKey: ["sessionMessages"],
                  });
                } else if (data.type === "error") {
                  toast.error(`Streaming failed: ${data.message}`);
                  //reset states
                  setIsStreaming(false);
                  //setCurrentStreamingMessage("");
                }
              }
            } catch (parseError) {
              console.error(
                "Error parsing SSE data:",
                parseError,
                "Line:",
                line,
              );
            }
          }
        }
      }
    } catch (error) {
      toast.error(
        `Streaming failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
      // Reset states on error
      setIsStreaming(false);
      setCurrentStreamingMessage("");
    }
  };

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
        }`,
      );
      // reset the states
      setIsStreaming(false);
      setCurrentStreamingMessage("");
    },
  });

  // This useEffect hook runs when the page loads to handle the initial prompt (This line affected the question being sent twice)
  useEffect(() => {
    const initialQuestion = location.state?.initialQuestion; // the users initial question from the location state
    const sessionPromptKey = `prompted-${sessionId}`; // store the session key in a variable to help w/ not sending the same question twice
    if (initialQuestion && !sessionStorage.getItem(sessionPromptKey)) {
      // checks if there is an initial question from the state and a session key in the session storage
      sessionStorage.setItem(sessionPromptKey, "true"); // checks the session item using the session key and sets the value to true to make sure that the messages arent sent twice
      // this function is only sent once load, and because the sessionStorage the message doesnt send again even if the page is reloaded
      streamMessageMutation.mutate(initialQuestion);
    }
  }, [location.state, streamMessageMutation, sessionId]); // this only changes if its sent again from the prompt page

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    // otherwise
    setChatInput("");
    streamMessageMutation.mutate(message);
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
              {/*Show the message that is streaming to the user and the current question that the user wants to know*/}
              {isStreaming && currentStreamingMessage && (
                <div className="">
                  <div className="">
                    <div className="p-2 max-w-xl my-2 rounded-md bg-[#282828] font-medium text-[#ffffff]">
                      {/*Initial question from the user while the message is rendering to the frontend*/}
                      {userQuestion}
                    </div>
                    <div className="p-2 my-1 max-w-xl h-full rounded-md bg-[#171717] text-[#ffffff]">
                      {currentStreamingMessage}
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                </div>
              )}
              {isPending && (
                <div className="flex justify-center items-center py-5">
                  <div className="flex items-center px-2 justify-center bg-[#252525] rounded-[5px] p-2 h-[70px] w-[400px]">
                    <SyncLoader speedMultiplier={0.5} color="white" size={8} />
                  </div>
                </div>
              )}

              {/* Show loading for streaming */}
              {isStreaming && !currentStreamingMessage && (
                <>
                  <div className="p-2 max-w-xl my-2 rounded-md bg-[#282828] font-medium text-[#ffffff]">
                    {userQuestion}
                  </div>
                  {/*NOTE: UI thinking message for when streaming response is loading*/}
                  <div className="flex flex-col justify-center items-center py-5">
                    <div className="flex items-center justify-center bg-[#252525] rounded-[10px] p-2 h-[50px] w-[200px]">
                      <p className="mr-1">Thinking</p>
                      <SyncLoader
                        speedMultiplier={0.5}
                        color="white"
                        size={8}
                      />
                    </div>
                  </div>
                </>
              )}
              {/* Show error for sending messages */}
              {error && (
                <div className="flex-shrink-0">
                  <strong>Message failed to send to the server...</strong>
                  {error.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/*ChatBox component for inputing questions from the user*/}
      {/* TODO: animate the box to go down from the middle of the page */}
      <div ref={bottomRef} className="pb-4 z-1 absolute bg-[#171717] bottom-0">
        <ChatBox
          onSendMessage={handleSendMessage}
          chatInput={chatInput}
          setChatInput={setChatInput}
          isLoading={isStreaming}
        />
      </div>
    </div>
  );
}
