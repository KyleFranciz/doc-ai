# TODO: Refactor the code for the server connection to make it more prod ready
# import the stuff for fastapi
from fastapi import FastAPI , HTTPException, Depends, Response # type: ignore
# import core package to help with making the API
from fastapi.middleware.cors import CORSMiddleware

# load_env  is important to loading the env variables from the file 
from dotenv import load_dotenv # type: ignore

#os allows me to access the file and pull the variables that were pulled
import os

# import supabase so that I can access the database
from supabase import  create_client ,Client   # type: ignore #create client and handle the client once its made

# For checking the real errors that are not shown if the error is not shown 
import traceback

#import the models from the schemas so that I can use them to structure the responses or the expected result from the user
from schemas.chat_schema import DocsResponse, MessageRequest, SessionRequest
# import the function from the doc agent to help with creating the response from the llm
from agent.doc_agent import getKnowledgeFromDoc # function to ask Doc the question before returning the answer to the use



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
async def askDoc(user_request : MessageRequest): #? the params have message_to_doc, session_id, user_id and role
    #? supabase functions by default are synchronous
    """This is a route to prompt Doc with the question as well as return a response to the user as well"""
    try: # try to create a table in supabase
        # add users question to the DB
        print("adding User's input")
        UserQuestion = supabase.table("messages").insert({ # get back the state of the UserQuestion
            "session_id" : user_request.session_id, # information about the session id that the user is in with Doc 
            "role" : "human", # fill to automatically be human
            "content" : user_request.question, # question the user wanted to know the answer to
            "user_id" : user_request.user_id #! id of the user ( Replace once the auth flow is made )
        }).execute()
        print("successfully added")

        # ask doc the question from the user
        print("generating docs response")
        answer = getKnowledgeFromDoc(user_input=user_request.question, session_id=user_request.session_id) # give the question that the user had and also the session_id of the user
        print("response generated")

        print("adding Docs response")
        #store the response from Doc into the DB so i can check success
        DocsAnswer = supabase.table("messages").insert({
            "session_id" : user_request.session_id, 
            "role" : user_request.role, 
            "content" : answer,
            "user_id" : user_request.user_id
        }).execute()
        print("Doc's answer was successfully added to the database")

        # check if there is data added from the attempt is added to the DB
        if not UserQuestion.data or not DocsAnswer.data:
            # raise an error to the user to let them know that there was an error adding the data to the DB
            raise HTTPException(status_code=500, detail="Failed to add the messages to the database")
        
        else:
            # show the data that was added if it was a success
            print(UserQuestion.data, DocsAnswer.data) # show the data that I added to triple check

            # return the response model with the filled out info to the user
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
        


# route to get the chat room information for the current user
# route is async to help with waiting and making sure the flow is good
@app.get("/api/chat/:chat_id")
async def get_user_chat(session : SessionRequest): # session id will be sent in to be searched in database
    """This is a function to get info from the chat session and load it in """
    # try to get the data:
    try:
        # use the session_id from the request to wait to get the messages from the database
        response = await supabase.table("messages").select("*").eq("session_id",session.session_id).order("created_at", desc=False).execute()

        # check if there is actually data that was received
        if response.data:
            # Return the data to the user
            return {
                "session_id" :session.session_id,
                "messages": response.data,
                "amount_of_messages" : len(response.data)
                }
            # return the messages that were received from the database
        else:
            raise HTTPException(status_code=404, detail=f"unfortunately there were no messages that matched the session id you gave: {session.session_id}")

            
        
    except Exception as err:
        # log the error
        raise HTTPException(status_code=404, detail=f"failed to fetch the message: {err}")



# route to get the env variables from the frontend (might not use)
#@app.get("/api/config")
#def send_env():
#    return {
#        # send docs url to the frontend
#        "DocsUrl" : doc_url
#        # any other config from the backend
#    }
#    



    


