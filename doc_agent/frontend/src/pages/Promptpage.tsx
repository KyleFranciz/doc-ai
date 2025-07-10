// use axios to help w fetching and posting data to my api route
//import axios from "axios";
import { useState } from "react";
import PromptBox from "../components/PromptBox";
import { useChatSession } from "../hooks/useChatSession";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

// interface for the message sent to the server
export interface MessageToDoc {
  question: string;
  session_id: string | undefined;
  user_id: string | null;
  role: "human" | "ai";
}

// interface for the user being brought into this page
interface PromptPageProps {
  user: User | null;
}
// TODO: make guest user to allow the user top have chats with doc

// PromptPage components
function PromptPage({ user }: PromptPageProps) {
  //useState to store the variables inside
  const [message2send, setMessage2Send] = useState<string>("");

  //set up loading to keep track for loading animation
  const [loading, setLoading] = useState<boolean>(false);

  // get the session ID from the chat session component
  const { resetChatId } = useChatSession(); // only use the sessionId variable to store the session

  // create navigation so i can use it to route to the chat page
  const navigate = useNavigate();
  // todo: decide if the message icon will route to a new chat

  // setup function to send the prompt to doc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message2send.trim()) {
      toast.error("Please enter a message in the prompt box to ask Doc");
      return; // stop the function from running
    }

    // set loading to true to show the loading animation
    setLoading(true);

    // create a new session id for the new chat
    const newSessionID = resetChatId();

    // route to the new session id that was generated
    navigate(`/chat/${newSessionID}`, {
      state: { initialQuestion: message2send },
    });
    // the component unmounts right after
  };

  // route to the next page when the initial prompt is queued
  // todo: incorporate the users name in the message once the prompt is sent
  return (
    <>
      <div className="flex justify-center items-center flex-col h-screen">
        {/*Greet the user*/}
        <div className=" justify-center items-center">
          <h1 className="heading text-[#ffffff] text-[3rem]">
            {/* TODO: remove the user email after the test is finished*/}
            {user
              ? `Welcome, ${user.email?.split("@")[0]}`
              : "You must be new here"}
          </h1>
          <h3 className="flex justify-center mt-[-13px] mb-3 text-xl text-[#b0b0b0]">
            What do you want to research today?
          </h3>
        </div>
        {/*This section is for the input section of the page*/}
        <PromptBox
          handleSubmit={handleSubmit}
          setMessage={setMessage2Send}
          loading={loading}
          value={message2send}
        />
      </div>
    </>
  );
}

export default PromptPage;
