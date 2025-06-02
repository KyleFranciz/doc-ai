import { useParams } from "react-router";
import PromptBox from "../components/PromptBox";

import { FormEvent, useState } from "react";
import MessageRender from "../components/messageRender";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchMessages } from "../api/ChatFetcher";
import { sendChatMessage } from "../api/ChatSenders";

export default function ChatPage() {
  // requires a setMessage (set state), handleSubmit (function triggered on submit), loading(boolean to control loading state)
  // TODO: Set up chat_id w/ useParams. Set up the chat id to be custom and load chat from the prompt page
  // States to use in this component
  const { sessionId } = useParams<{ sessionId: string | undefined }>(); // get the session id from the url, make sure that all the messages are sent to the same session

  // local states for the messages
  const [messageInput, setMessageInput] = useState<string>(""); // keep track of messages
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // bring in session managing hook

  // use queryClient to help invalidate queries when the data changes
  const queryClient = useQueryClient();

  // useQuery custom hook I made to help with fetching the messages from the backend
  const { data, isPending, error } = useQuery({
    queryFn: () => fetchMessages(sessionId),
    queryKey: ["sessionMessages", { sessionId }],
  });

  //useMutate custom hook that I made with posting and updating the data once the content is posted to the backend
  const { mutateAsync } = useMutation({
    mutationFn: () => sendChatMessage(messageInput, "human", sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessionMessages"] });
    },
  });

  // function to handle the submission to the form to pass into the prompt component
  const handleSubmit = async (e: FormEvent<Element>) => {
    e.preventDefault();
    //check if there is an input to send
    if (!messageInput || isSubmitting) return; // if no input or not submitting leave the function

    // set is submitting so that i can implement loading animations
    setIsSubmitting(true);

    // continue if checks okay
    try {
      // sendMessage function called from hook to send the data to the backend
      await mutateAsync(); // send message to the backend
      // catch error if any
    } catch (err) {
      console.log("Failed to send message to backend", err);
      // finally set submitting to false once the message is loaded
    } finally {
      setIsSubmitting(false);
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
    <div className="pt-[60px] flex flex-col items-center">
      <div className="absolute top-15 flex justify-center items-center w-full">
        <h1 className="text-[1.3rem] font-semibold">Chat {sessionId}</h1>
      </div>

      {/* Display error messages */}
      <div>
        {error && (
          <div>
            <strong>ERROR:</strong>
          </div>
        )}
      </div>

      {/*Container for the chat messages to be displayed here */}
      <div className="">
        {isPending ? (
          <div>Loading...</div>
        ) : (
          // render the messages from the backend using the data from the useGetSessionMessages hook
          <MessageRender chatInfo={data?.data.messages || []} />
        )}
      </div>

      <PromptBox
        // handle submit
        handleSubmit={handleSubmit}
        // set message
        setMessage={setMessageInput}
        // loading state
        loading={isSubmitting}
      />
    </div>
  );
}
