// component for the chat page that handles sending the messages to the server
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FormEvent, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { GoPaperclip } from "react-icons/go";
import { PiMicrophoneFill } from "react-icons/pi";
import { MessageToDoc } from "../pages/Promptpage";
import { FaRegPauseCircle } from "react-icons/fa";

// interface for this Chat Component
interface ChatboxI {
  sessionId: string;
}

export default function ChatBox(prop: ChatboxI) {
  // react state for the chat input
  const [chatInput, setChatInput] = useState<string>(""); // for input message
  const [loading, setLoading] = useState<boolean>(false);

  // query client to help w mutation
  const queryClient = useQueryClient(); // can bring in and us in any function

  // base api url
  const BASE_API_URL = import.meta.env.VITE_DOC_BASE_API; // get the base api url from the .env file
  if (!BASE_API_URL) {
    console.log("The .env variable failed to load");
  }

  // function to send the data to the database
  const send2Chat = async (sessionId: string) => {
    setLoading(true); // start the loading animation when sending

    // package the data to send off
    const questionToDoc: MessageToDoc = {
      question: chatInput,
      session_id: sessionId,
      user_id: "user_id",
      role: "human",
    };

    // send the data to the prompt server
    const res = await axios.post(`${BASE_API_URL}/api/prompt`, questionToDoc);

    setLoading(false); // finish loading

    setChatInput(""); // clear the chat box

    return res.data;
  };

  // set up use mutate to send the data to the backend
  const { mutate } = useMutation({
    mutationFn: send2Chat,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sessionMessages"] }),
  });

  //function to handle posting the data to the database
  const handleSending = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // send the data to the database
      mutate(prop.sessionId);

      console.log("doc got the question");
    } catch (err) {
      console.log(err);
    }

    //try sending the data
  };

  return (
    <div className="">
      <form onSubmit={handleSending}>
        <div className="w-[650px] h-[110px] bg-[#303030]  outline-[#6D6D6D] outline-solid outline-[0.7px] rounded-xl relative">
          <input
            type="text"
            placeholder="Let me know what you want to look into"
            className="w-full mt-4.5 ml-4 h-auto outline-none text-[#ffffffe4]"
            onChange={(e) => {
              // catch the input changes and store in state
              setChatInput(e.target.value);
            }}
            value={chatInput}
            // make it required to send the data
            required
          />
          {/*bottom button for the input bar */}
          <div className="flex justify-center items-center">
            <button
              className="bg-[#95AA75] p-1.5 rounded-4xl outline-solid outline-[0.5px] outline-[#6D6D6D] text-[#303030] absolute right-3 bottom-3 hover: cursor-pointer"
              type="submit"
            >
              {/*Replace the logo for the UP with an arrow*/}
              {loading ? (
                <FaRegPauseCircle size={20} />
              ) : (
                <FaArrowUp size={17} />
              )}
            </button>
            {/*styling for the bottom buttons */}
            <div className="flex w-15 scale-110 absolute bottom-3 left-3">
              <button
                className="p-[3px] ml-1 rounded-[3px] outline-solid outline-[0.5px] bg-[#303030] outline-[#6D6D6D] hover:bg-[#2a2a2a] cursor-pointer"
                type="button"
              >
                <GoPaperclip />
              </button>
              <button
                className="p-[3px] ml-2 rounded-[3px] outline-solid bg-[#303030] outline-[0.5px] outline-[#6D6D6D] hover:bg-[#2a2a2a] cursor-pointer "
                type="button"
              >
                <PiMicrophoneFill />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
