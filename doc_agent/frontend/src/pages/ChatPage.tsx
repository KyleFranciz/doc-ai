import PromptBox from "../components/PromptBox";

export default function ChatPage() {
  // requires a setMessage (set state), handleSubmit (function triggered on submit), loading(boolean to control loading state)
  // TODO: Set up chat_id w/ useParams. Set up the chat id to be custom and load chat from the prompt page
  return (
    <div>
      <p>this is sample text for the chat page</p>
      <PromptBox />
    </div>
  );
}
