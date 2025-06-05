import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChatBox from "../components/ChatBox";

import MessageRender from "../components/messageRender";
import { SyncLoader } from "react-spinners";
import { useState } from "react";
import { MessageToDoc } from "./Promptpage";
import axios from "axios";
import { fetchMessages } from "../api/ChatFetcher";

export default function ChatPage() {
  // requires a setMessage (set state), handleSubmit (function triggered on submit), loading(boolean to control loading state)
  // TODO: Set up chat_id w/ useParams. Set up the chat id to be custom and load chat from the prompt page
  // States to use in this component
  const { sessionId } = useParams<{ sessionId: string | undefined }>(); // get the session id from the url, make sure that all the messages are sent to the same session
  const [chatInput, setChatInput] = useState<string>("");

  //import base url from the .env file
  const BASE_API_URL = import.meta.env.VITE_DOC_BASE_API; // get the base api url from the .env file

  // local states for the messages
  //const [messageInput, setMessageInput] = useState<string>(""); // keep track of messages
  //const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // bring in session managing hook

  // use queryClient to help invalidate queries when the data changes
  const queryClient = useQueryClient();

  // useQuery custom hook I made to help with fetching the messages from the backend
  const { data, isPending, error } = useQuery({
    queryFn: () => fetchMessages(sessionId),
    queryKey: ["sessionMessages", { sessionId }],
  });

  const sendDownMessageMutation = useMutation({
    mutationFn: async (message: string) => {
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
    onError: (error) => console.log("Failed to send properly", error),
  });

  const handleSendMessage = (message: string) => {
    setChatInput(""); // clear the input after its done
    sendDownMessageMutation.mutate(message);
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
    <div className="flex flex-col items-center bg-[#303030]">
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

      {/*Container for the chat messages to be displayed here */}
      <div className="px-4">
        {isPending ? (
          <div className="flex justify-center items-center h-64">
            <SyncLoader speedMultiplier={0} color="white" />
          </div>
        ) : (
          // render the messages from the backend using the data from the useGetSessionMessages hook
          <div className="h-full">
            <div className="h-full mt-[25px]">
              <MessageRender chatInfo={data?.data.messages || []} />
              {sendDownMessageMutation.isPending && (
                <div className="flex justify-center items-center py-5">
                  <SyncLoader speedMultiplier={0.5} color="white" size={10} />
                </div>
              )}
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
      <div className="pb-2  sticky bottom-0 bg-[#303030]">
        <ChatBox
          onSendMessage={handleSendMessage}
          chatInput={chatInput}
          setChatInput={setChatInput}
          isLoading={sendDownMessageMutation.isPending}
        />
      </div>
    </div>
  );
}
