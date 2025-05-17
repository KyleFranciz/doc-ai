import { FaArrowUp } from "react-icons/fa";
import { GoPaperclip } from "react-icons/go";
import { PiMicrophoneFill } from "react-icons/pi";
// use axios to help w fetching and posting data to my api route
//import axios from "axios";
import { useEffect, useState } from "react";

//import the backend connection var from api file

import axios from "axios";

// interface for the message got back from the server
interface MessageToDoc {
  message: string;
}

function PromptPage() {
  //useState to store the variables inside
  const [message2send, setMessage2Send] = useState<string>("");
  //set up loading to keep track for loading animation
  const [loading, setLoading] = useState<boolean>(false);
  //set up state for the response
  const [response, setResponse] = useState<string | null>("");

  // setup function to send the prompt to doc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // format the data to send off
      const dataToSend: MessageToDoc = {
        message: message2send,
      };

      //make a post request to the prompt route
      const res = await axios.post("/api/prompt", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponse(
        `Response data has been retrieved ${JSON.stringify(res.data)}`
      );
      //clear the message so that it can get other info again later
      setMessage2Send("");
      //todo: route the user to a page with the chat and the message
      //todo: or remove the title and have the prompt load on the same page
    } catch (err) {
      console.log(err);
    } finally {
      // reset the loading state
      setLoading(false);
    }
  };

  // route to the next page when the initial prompt is queued
  // todo: incorporate the users name in the message once the prompt is sent
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        {/*Greet the user*/}
        <div className=" justify-center items-center">
          <h1 className="heading">Welcome User</h1>
          <h3 className="flex justify-center mt-[-15px] mb-6 text-xl">
            What do you want to research today?
          </h3>
        </div>
        {/*This section is for the input section of the page*/}
        <form onSubmit={handleSubmit}>
          <div className="w-[650px] h-[110px] bg-[#303030]  outline-[#6D6D6D] outline-solid outline-[0.7px] mt-4 rounded-xl relative">
            <input
              type="text"
              placeholder="Let me know what you want to look into"
              className="w-full mt-4.5 ml-4 h-auto outline-none text-[#ffffffe4]"
              onChange={(e) => {
                setMessage2Send(e.target.value);
              }}
              required
            />
            {/*bottom button for the input bar */}
            <div className="flex justify-center items-center">
              <button className="bg-[#95AA75] p-1.5 rounded-4xl outline-solid outline-[0.5px] outline-[#6D6D6D] text-[#303030] absolute right-3 bottom-3 hover: cursor-pointer">
                {/*Replace the logo for the UP with an arrow*/}
                <FaArrowUp size={17} />
              </button>
              {/*styling for the bottom buttons */}
              <div className="flex w-15 scale-110 absolute bottom-3 left-3">
                <button
                  className="p-[3px] ml-1 rounded-[3px] outline-solid outline-[0.5px] outline-[#6D6D6D]"
                  type="submit"
                >
                  {loading ? <div>O</div> : <GoPaperclip />}
                </button>
                <button className="p-[3px] ml-2 rounded-[3px] outline-solid outline-[0.5px] outline-[#6D6D6D]">
                  <PiMicrophoneFill />
                </button>
              </div>
            </div>
          </div>
        </form>
        {/*If there is a response then test and show the response */}
        {response && <div>{response}</div>}
      </div>
    </>
  );
}

export default PromptPage;
