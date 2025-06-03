import { useParams } from "react-router";

import { useQuery } from "@tanstack/react-query";

import ChatBox from "../components/ChatBox";
import { fetchMessages } from "../functions/fetchMessages";
import MessageRender from "../components/messageRender";

export default function ChatPage() {
  // requires a setMessage (set state), handleSubmit (function triggered on submit), loading(boolean to control loading state)
  // States to use in this component
  const { sessionId } = useParams<{ sessionId: string | undefined }>(); // get the session id from the url, make sure that all the messages are sent to the same session

  // useQuery custom hook I made to help with fetching the messages from the backend to display on the page
  const { data, isPending, error } = useQuery({
    queryFn: () => fetchMessages(sessionId),
    queryKey: ["sessionMessages", { sessionId }],
  });

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

          <MessageRender messages={data || []} />
        )}
      </div>
      {/* Chat box for sending messages to the backend*/}
      <ChatBox sessionId={sessionId} />
    </div>
  );
}
