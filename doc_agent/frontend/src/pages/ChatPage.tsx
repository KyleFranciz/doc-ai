import { useParams } from "react-router";
import PromptBox from "../components/PromptBox";

export default function ChatPage() {
  // requires a setMessage (set state), handleSubmit (function triggered on submit), loading(boolean to control loading state)
  // TODO: Set up chat_id w/ useParams. Set up the chat id to be custom and load chat from the prompt page
  // States to use in this component
  const { sessionId } = useParams<{ sessionId: string }>(); // get the session id from the url, make sure that all the messages are sent to the same session

  // Hooks to use to store the messages

  // make a function to handle the submit to the backend
  return (
    <div>
      <h1>Chat {sessionId}</h1>
      <p>this is sample text for the chat page</p>
      <PromptBox />
    </div>
  );
}
