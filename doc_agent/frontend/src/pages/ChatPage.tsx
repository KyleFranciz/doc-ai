import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ChatBox from "../components/ChatBox";
import { fetchMessages } from "../functions/fetchMessages";
import MessageRender from "../components/MessageRender";
import { SyncLoader } from "react-spinners";

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
    <div className="flex flex-col items-center bg-[#303030]">
      <div className="pt-[60px] flex-shrink-0 p-4 border-b border-gray-600">
        <h1 className="text-[1.3rem] font-semibold">Chat {sessionId}</h1>
      </div>

      {/* Display error messages */}
      <div>
        {error && (
          <div className="flex-shrink-0">
            <strong>ERROR:</strong>
          </div>
        )}
      </div>

      {/*Container for the chat messages to be displayed here */}
      <div className="flex-1 min-h-0 p-4">
        {isPending ? (
          <div className="flex justify-center items-center h-64">
            <SyncLoader speedMultiplier={0} />
          </div>
        ) : (
          // render the messages from the backend using the data from the useGetSessionMessages hook
          <div className="h-full">
            <div className="h-full p-4 overflow-y-auto mt-[25px]">
              <MessageRender chatInfo={data?.data.messages || []} />
            </div>
          </div>
        )}
      </div>
      {/* Chat box for sending messages to the backend*/}
      <div className="pb-2  sticky bottom-0 bg-[#303030]">
        <ChatBox sessionId={sessionId} />
      </div>
    </div>
  );
}
