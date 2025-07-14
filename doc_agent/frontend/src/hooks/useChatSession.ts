// this file will create a hook the will create a chat session

// TODO: make sure that the sessionID does not get created as undefinded,

// import the uuid to be able to help with making unique sessionId's
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// declare session that I'll use to update the state of the locally stored sessionId
const SESSION_ID: string = "chat-session-id";

// function will return the session and something to reset the sessionId
export const useChatSession = () => {
  // manage the sessionId state from the chat session 
  const [sessionId, setSessionId] = useState<string>("");

  // when the function is called when the component mounts
  useEffect(() => {
    // checks the sessionId from local storage if it exists already
    let alreadyStoredId: string | null = localStorage.getItem(SESSION_ID); //use "let" since i'll update the storedId later

    // check if alreadyStoredId is null then 
    if (!alreadyStoredId) {
      // if not generate new sessionId to be used 
      alreadyStoredId = uuidv4();

      // store the newly generated id in the local storage, if it does not exist
      localStorage.setItem(SESSION_ID, alreadyStoredId);
    }

    // if there is a locally stored id, save it in the state to be sent out to the user
    setSessionId(alreadyStoredId ?? uuidv4()); // set the alreadyStoredId if it exists
    // otherwise make a new one for the user to navigate to


    return () => {
      // unmount the sessionId on the onmount of the component if the user goes to another page
      if (sessionId) {
        localStorage.removeItem(SESSION_ID) //remove the sessionID from the local storage
      }
    }
  }, []);

  // function to reset the sessionId once the user wants to create a new chat
  const resetChatId = () => {
    // generate new sessionId
    const newSessionId: string = uuidv4();
    // check the set it to the local state
    localStorage.setItem(SESSION_ID, newSessionId);
    // update the state to the new session id
    setSessionId(newSessionId);
    return newSessionId // return immediatly for the routing
  };
  //return the reset function to be used outside when making a new chat, and sending the session id handled from the hook
  return { sessionId, resetChatId };
};
