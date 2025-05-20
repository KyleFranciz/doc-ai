// this file will create a hook the will create a chat session

// import the uuid to be able to help with making unique sessionId's
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// declare session that I'll use to update the state of the locally stored sessionId
const SESSION_ID: string = "this-is-session-id";

// function will return the session and something to reset the sessionId
export const useChatSession = () => {
  // use state to store and manage the session from local storage
  const [sessionId, setSessionId] = useState<string>("");

  // function to get the sessionID from the local storage if it exists, useEffect for rerenders
  useEffect(() => {
    // get the sessionId from local storage if it exists already
    let alreadyStoredId: string | null = localStorage.getItem(SESSION_ID); //use "let" since i'll update the storedId later

    // check if the SESSION_ID is returned back as null
    if (!alreadyStoredId) {
      // generate new sessionId
      alreadyStoredId = uuidv4();

      // store the newly generated id in the local storage
      localStorage.setItem(SESSION_ID, alreadyStoredId);

      // set the state for the newly generated id
      setSessionId(alreadyStoredId);
    }
  }, []);

  // function to reset the sessionId once the user wants to create a new chat
  const resetChatId = () => {
    // generate new session if
    const newSessionId: string = uuidv4();
    // check the set it to the local state
    localStorage.setItem(SESSION_ID, newSessionId);
    // update the state to the new session id
    setSessionId(newSessionId);
  };
  //return the reset function to be used outside when making a new chat, and sending the session id handled from the hook
  return { sessionId, resetChatId };
};
