// use axios to help w fetching and posting data to my api route (might not use axios)
//import axios from "axios";
import { useState } from "react";
import PromptBox from "../components/PromptBox";
import { useChatSession } from "../hooks/useChatSession";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import logo from "../assets/logos/Doc-Logo.png";

// interface for the message sent to the server
export interface MessageToDoc {
  question: string;
  session_id: string | undefined;
  user_id: string | undefined;
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

  // Get the session from the local storage, the resetChatId() stores it after it creates a new one
  // The sessionId then access it once its stored
  const { resetChatId } = useChatSession(); // only use the sessionId variable to store the session

  // create navigation so i can use it to route to the chat page
  const navigate = useNavigate();
  // todo: decide if the message icon will route to a new chat

  // Function to send the prompt to doc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // check if there is a message to from the input box
    if (!message2send.trim()) {
      toast.error("Please enter a message in the prompt box to ask Doc");
      return; // stop the function from continuing
    }

    // set loading to true to show the loading animation
    setLoading(true);

    // create a new session id for the new chat
    const newSession = resetChatId(); // resets and makes an new chat
    // newSession is a new chatId that I can pass into the params for the chat page

    // route to the new session id that was generated
    // uses the local sessionId to route to the new page
    navigate(`/chat/${newSession}`, {
      state: { initialQuestion: message2send },
    });
    // the component unmounts right after
  };

  // route to the next page when the initial prompt is queued
  // TODO: incorporate the users name in the message once the prompt is sent
  return (
    <>
      <div className="flex justify-center items-center flex-col h-screen">
        {/*Greet the user*/}
        <div className=" justify-center flex-col flex w-full items-center ">
          <h1 className="font-[instumentSerif] tracking-tight text-[#ffff] text-[6rem]">
            {/*TODO: Change to be able to display the users name*/}
            {user ? `Welcome User` : "Welcome back,"}
          </h1>
          <div className="flex justify-center itmes-center">
            <h3 className="flex justify-center font-[instrumentSerif] mt-[-40px] mb-3 text-[1.5rem] text-[#b0b0b0]">
              What do you want to research today?
              <img className="w-[38px] h-[38px]" src={logo} />
            </h3>
          </div>
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
