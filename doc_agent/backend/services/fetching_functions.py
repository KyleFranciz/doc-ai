#imported functions that I will use

from dotenv import load_dotenv
import os

#Supabase connection so that I can use it to access connections to the tables in the DB 
from supabase import Client, create_client

from langchain.schema import HumanMessage, AIMessage


load_dotenv()

url = os.getenv("SUPABASE_URL") #url to use for making a connection to the DB
key = os.getenv("SUPABASE_KEY") #key to use for making a connection to the DB

#check if the variables were retrieved properly
if isinstance(url, str) and isinstance(key, str): # if the url and key are correctly brought in as strings 
    #establish the connection to the supabase database:
    supabase : Client = create_client(url, key) # then make the connection to the DB
    if supabase is not None: 
        # if everything goes correctly then print the success 
        print("variables were brought over correctly to the function")
        print("Supabase connection was successful to the function")
else:
    # if not: make sure the issue is known
    print("Variables were not brought over properly to the function")


# Function to get all the messages from a current session into to Doc
def get_all_messages_4_doc(session_id: str): # pass in the session ID from the request to place into the function
    # get the information from the Supabase 
    response = supabase.table("messages").select("*").eq("session_id",session_id).order("created_at", desc=False).execute()
    # have the info from "messages", select all the info get the information that matches the session_id and sort the date in ascending order ^
    
    data = response.data or [] # checks if I get back data, if I dont then make data an empty list

    # create an empty list to store the messages
    messages = []

    # use for loop to sort though the data that I get back from the DB
    for categories in data:
        role = categories["role"] # get all the roles and store it on the roles var
        content = categories["content"] # get all the content and store it in the content var
        
        # use if statements to sort through and check the roles of human or ai
        if role == "human":
            # append the content to the human message schema to be added to the list to make the categorizing easier
            messages.append(HumanMessage(content=content))
        elif role == "ai":
            messages.append(AIMessage(content=content))

    #exit the loop
    return messages # return the messages so that doc can use the chat history