import { useParams } from "react-router";
import PromptBox from "../components/PromptBox";
import { useSessionMessages } from "../hooks/useSessionMessages";
import { FormEvent, useState } from "react";
import MessageRender from "../components/messageRender";

export default function ChatPage() {
  // requires a setMessage (set state), handleSubmit (function triggered on submit), loading(boolean to control loading state)
  // TODO: Set up chat_id w/ useParams. Set up the chat id to be custom and load chat from the prompt page
  // States to use in this component
  const { sessionId } = useParams<{ sessionId: string }>(); // get the session id from the url, make sure that all the messages are sent to the same session

  // local states for the messages
  const [messageInput, setMessageInput] = useState<string>(""); // keep track of messages
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // bring in session managing hook
  const { messages, loading, error, sendMessage, refreshMessages, clearError } =
    useSessionMessages({ sessionId: sessionId || "", autoFetch: true });

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
      await sendMessage(messageInput); // send message to the backend
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

  // make a function to handle the submit to the backend
  return (
    <div>
      <h1>Chat {sessionId}</h1>

      {/* Display error messages */}
      <div>
        {error && (
          <div>
            <strong>ERROR:</strong> {error}
          </div>
        )}
      </div>

      {/*Container for the chat messages to be displayed here */}
      <div>
        {/*if message loading and the length is 0 */}
        {loading && messages.length === 0 ? (
          <div>loading chat messages...</div>
        ) : // if leaded and message length is 0
        messages.length === 0 ? (
          <div>There are no messages. Start a convo with Doc</div>
        ) : (
          <div>{messages.map(MessageRender)}</div>
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
