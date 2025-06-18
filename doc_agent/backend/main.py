# TODO: Refactor the code for the server connection to make it more prod ready
from fastapi import FastAPI , HTTPException, Depends, Response # type: ignore # import the stuff for fastapi
from fastapi.middleware.cors import CORSMiddleware # import core package to help with making the API
from dotenv import load_dotenv # type: ignore # load_env  is important to loading the env variables from the file 
import os #os allows me to access the file and pull the variables that were pulled
from supabase import  create_client ,Client   # type: ignore #create client and handle the client once its made # import supabase so that I can access the database
import traceback # For checking the real errors that are not shown if the error is not shown 
from schemas.chat_schema import DocsResponse, MessageRequest, SessionRequest #import the models from the schemas so that I can use them to structure the responses or the expected result from the user
from agent.doc_agent import getKnowledgeFromDoc, getKnowledgeFromDocStreaming # function to ask Doc the question before returning the answer to the use # import the function from the doc agent to help with creating the response from the llm
from services.fetching_functions import getFirstMessage, getFirstChat # import function to get the first message from sessions in the database
import asyncio
import json
from typing import AsyncGenerator, Optional
from fastapi.responses import StreamingResponse # type: ignore # import the streaming response to help with streaming the response to the user


# TODO: use the server from fast api to help with setting up the api routes for contacting the llm
# todo: import the function from the agent Doc that I set up so that the function can help to structure the responses that I get back
# TODO: Figure out why is the llm saying its getting called twice when it answers

#Load all the variables from the .env file 
load_dotenv()

#^ import the supabase connection string
url : str = os.getenv("SUPABASE_URL") # Supabase url 
key : str = os.getenv("SUPABASE_KEY") # Supabase key
frontend_url : str = os.getenv("REACT_URL")
# doc_url : str = os.getenv("DOC_URL") # might use later


# Check if the variables were retrieved properly
if not url:
    raise ValueError("Supabase Url was not loaded properly")
if not key:
    raise ValueError("Supabase Key was not loaded properly")
if not frontend_url:
    raise ValueError("react front end url was not loaded properly")


try:
    #establish the connection to the supabase database:
    supabase : Client = create_client(url, key) # then make the connection to the DB
    print("variables were brought over correctly")
    print("Supabase connection was successful")
# todo: look making the else into a functioning elif        
except Exception as err:
    # if not: make sure the issue is known
    raise RuntimeError(f"Failed to initialize connection to supabase")

    
# Assign the app to a variable
app = FastAPI()

# Create cors to help with cross origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
    )

# Test route
@app.get("/")
def get_entry_root(): #general connection
    return {"message": "Hey there user"}


# TODO: I might ask for a session Id to keep track of the session and send the Id to the backend so I can retrieve the data later

# Adding data to the table
@app.post("/api/prompt", response_model=DocsResponse) #DocResponse is the response that I give back when the user makes a request"
# user_input is a a parameter that gets sent to the backend
async def askDoc(user_request : MessageRequest, stream: Optional[bool] = False): #? the params have message_to_doc, session_id, user_id and role
    #? supabase functions by default are synchronous
    """This is a route to prompt Doc with the question as well as return a response to the user as well"""
    try: # try to create a table in supabase
        #^ add users question to the DB
        print("adding User's input")
        UserQuestion = supabase.table("messages").insert({ # get back the state of the UserQuestion
            "session_id" : user_request.session_id, # information about the session id that the user is in with Doc 
            "role" : "human", # fill to automatically be human
            "content" : user_request.question, # question the user wanted to know the answer to
            "user_id" : user_request.user_id #! id of the user ( Replace once the auth flow is made )
        }).execute()
        print("successfully added")


        #^ check if the chat table to see if it already exists in the database
        checkChatDB = getFirstChat(user_request.session_id)
        
        # alert for debug
        #print(f"First chat from the database: {checkChatDB}") # show the first chat from the database
        

        # if it doesn't then create a new chat with the session info for the database
        if not checkChatDB:
            # get the first message from the messages table in the database
            FirstMessage = getFirstMessage(user_request.session_id)
            # alert for debug
            print(f"First message from the database: {FirstMessage}") # show the first message from the database

            # shorten the title of the First message
            short_title = FirstMessage[:20]

            # create a new chat with the session info for the database
            SentChatSession = supabase.table("chats").insert({
                "user_id" : user_request.user_id,
                "title" : short_title.title(), # shorten the title for the chat
                "session_id" : user_request.session_id, # add the session_id of the chat
            }).execute()
            #check if successful 
            #print(f"Successfully added Doc's and Users Chat to the Chat DB: {SentChatSession}")
        else:
            print("There is already a chat message inside the Chat Database")

        # check if there is a stream request from the frontend
        if stream:
            # return a stream response to the frontend
            return StreamingResponse(
                stream_doc_response(user_request), 
                media_type="text/plain", 
                headers={
                    "Cache-Control" : "no-cache",
                    "Connection" : "keep-alive",
                    "Access-Control-Allow-Origin" : "*"
                }
            )

        else:
        #^ ask doc the question from the user
            print("generating docs response")
            answer = getKnowledgeFromDoc(user_input=user_request.question, session_id=user_request.session_id) # give the question that the user had and also the session_id of the user
            print("response generated")

            #^ add Docs Response to the Messages Database
            print("adding Docs response")
            #store the response from Doc into the DB so i can check success
            DocsAnswer = supabase.table("messages").insert({
                "session_id" : user_request.session_id, 
                "role" : "ai", # adds ai role to the message being sent for doc
                "content" : answer,
                "user_id" : user_request.user_id
            }).execute()
            print("Doc's answer was successfully added to the database")



            #^ check if there is data added from the attempt is added to the DB
            if not UserQuestion.data:
                # raise an error to the user to let them know that there was an error adding the data to the DB
                raise HTTPException(status_code=500, detail="Failed to add the messages to the database")
            if not DocsAnswer.data:
                # raise an error to the user to let them know that there was an error adding the data to the DB
                raise HTTPException(status_code=500, detail="Failed to add the messages to the database")




            # show the data that was added if it was a success
            print(UserQuestion.data, DocsAnswer.data) # show the data that I added to triple check        # return the response model with the filled out info to the user
            return DocsResponse(
                # return this info to the user 
                status="success", # let the user know that it was a success
                user_question=user_request.question, # return the users question
                docs_response=answer #answer that doc gave back to the user
            )
    
    except Exception as error: # Log the errors if the arise and the try fails
        # if there is an error display the error to the user
        print(f"Traceback (finding the real error):", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"There has been an error: {str(error)}")
        
# Async Function to stream the response from Doc
async def stream_doc_response(user_request: MessageRequest):
    """
    This is a function that generates the response from Doc 
    and streams it to the frontend as the responses are being generated
    """

    # variable to store the entire response once its done to send to the backend
    full_response = ""

    try:
        # get the messages for Doc from the database
        async for token in getKnowledgeFromDocStreaming(user_request.question, user_request.session_id):
            full_response += token # add words to the full response

            yield f"data: {json.dumps({'token': token, 'type': "token"})}\n\n"

        # send completion signal after the response is done 
        yield f"data: {json.dumps({'type': "complete"})}\n\n"

        # save the full response to the database for the reference for the next
        # line in the conversation
        DocsAnswer = supabase.table("messages").insert({
            "session_id" : user_request.session_id,
            "role" : "ai", 
            "content" : full_response,
            "user_id" :  user_request.user_id
        }).execute()

        print("Doc's complete response was successfully added to the database")
    except Exception as error:
        error_message = f"data: {json.dumps({'type': 'error', 'message': str(error)})}\n\n"
        yield error_message
        print(f"Streaming error: {error}")

# route to get the chat room information for the current user
# route is async to help with waiting and making sure the flow is good
@app.get("/api/chat/{session_id}")
async def get_user_chat(session_id : str): # session id will be sent in to be searched in database, user will be added later on 
    """
    This is a function to get info from the chat session and load it in

    session_id: the session id of the user that wants to see the chat room information
    user_id: the id of the user that has the chat with the specific chat room
    """
    # try to get the data:
    try:
        # use the session_id from the request to wait to get the messages from the database
        response = supabase.table("messages").select("*").eq("session_id",session_id).order("created_at", desc=False).execute()

        #see the data from the database if its there
        print(f"Database response:", response)

        # check if there is actually data that was received
        if response.data:
            # Return the data to the user
            return {
                "session_id" : session_id,
                "messages": response.data,
                "amount_of_messages" : len(response.data)
                }
            # return the messages that were received from the database
        elif response.data == 0:
            return {
                "session_id" : session_id,
                "messages": [],
                "amount_of_messages" : 0
            }
        else:
            raise HTTPException(status_code=404, detail=f"unfortunately there were no messages that matched the session id you gave: {session_id}")

            
        
    except Exception as err:
        # log the error
        raise HTTPException(status_code=404, detail=f"failed to fetch the message: {err}")



# todo: different route to get all the different chat titles from the database
@app.get("/api/chats/{user_id}")
async def get_all_chat_titles(user_id : str): # user_id will be sent in to be searched in database, user will be added later on
    # max out the amount of chats that the user can get
    MAX_CHATS = 20
    
    # Try to get the chats from the backend
    try:
        # fetch the data from the backend
        all_chats = supabase.table("chats").select("*").eq("user_id", user_id).execute()

        #check if I get the data back
        if all_chats.data:
            # return 20 chats from the database
            return {
             "chat" : all_chats.data[:MAX_CHATS], 
             "amount_of_chats" : len(all_chats.data) 
            }
        
        elif all_chats.data == 0:
            return {
                "chat" : [],
                "amount_of_chats" : 0  
            }
        

    except Exception as err:
        raise HTTPException(status_code=404, detail=f"failed to fetch the chats: {err}")
    # get all the data of the chat info




    


