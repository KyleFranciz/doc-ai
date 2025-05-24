// use axios to help w fetching and posting data to my api route
//import axios from "axios";
import { useState } from "react";

import axios from "axios";
import PromptBox from "../components/PromptBox";
import { useChatSession } from "../hooks/useChatSession";
import { useNavigate } from "react-router";

// interface for the message got back from the server
interface MessageToDoc {
  question: string;
  session_id: string;
  user_id: string;
}

function PromptPage() {
  //useState to store the variables inside
  const [message2send, setMessage2Send] = useState<string>("");

  //set up loading to keep track for loading animation
  const [loading, setLoading] = useState<boolean>(false);

  // get the session ID from the chat session component
  const { sessionId } = useChatSession(); // only use the sessionId variable to store the session

  // create navigation so i can use it to route to the chat page
  const navigate = useNavigate();
  // todo: decide if the message icon will route to a new chat

  // setup function to send the prompt to doc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the url from the .env file
    try {
      //var from .env file to help with the routing to my api
      const BASE_API_URL: string | undefined = import.meta.env
        .VITE_DOC_BASE_API;
      if (!BASE_API_URL) {
        console.log("the .env variable failed to load");
      } else {
        console.log(BASE_API_URL);
      }

      // set loading to true so that the I can set the loading animations later
      setLoading(true);

      // format the data to send off
      const dataToSend: MessageToDoc = {
        question: message2send, // input from the user
        session_id: sessionId, // generate random session_id for the chat_id
        user_id: "user_tester", //get the userid from supabase when the auth is set up
      };

      // send the data formatted data to the api to doc
      //make a post request to the apps api prompt route
      await axios.post(`${BASE_API_URL}/api/prompt`, dataToSend, {
        headers: {
          // identify the header type
          "Content-Type": "application/json",
        },
      });

      // route the user to the new page and have the chat session load into the page
      navigate(`/chat/${sessionId}`);

      // set the response that I get back after each question
      //setResponse(
      //  `Response data has been retrieved ${JSON.stringify(res.data)}`
      //);
      //
      //console.log("fetching docs answer was successful", res.data);
      ////clear the message so that it can get other info again later

      // clear the input box
      setMessage2Send("");

      //todo: route the user to a page with the chat and the message
      // catch the error
    } catch (err) {
      console.log(err);
    } finally {
      // reset the loading state since the initial loading is done
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
        <PromptBox
          handleSubmit={handleSubmit}
          setMessage={setMessage2Send}
          loading={loading}
        />
      </div>
    </>
  );
}

export default PromptPage;
