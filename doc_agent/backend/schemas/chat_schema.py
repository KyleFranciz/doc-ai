#Import the base model from pydantic so that I can create a model for these chat pieces
from pydantic import BaseModel # create default model for the responses from the api

# import langchain Ai message that the Agent gives back as a default response in this format
from langchain_core.messages import AIMessage

#typing model will help me when developing an making connections with older versions of python
from typing import List # allows me to type the parameters for the objects I make 

class MessageRequest(BaseModel): # use base model to define the schema for this chat request
    """Message request from the user with the custom session and the users ID"""
    question : str 
    session_id : str #string to that the session can be saved in the database
    user_id : str # id of the user that sends the request
    role: str # role will be filled automatically

#returned to in json format to the user
class DocsResponse(BaseModel): # structure docs response
    """Doc's Response to the user, giving the status of success, the user question and the answer to it"""
    status : str # status if the message was successful or not
    user_question : str # the users message
    docs_response : str # Doc's response

# might not be needed
class SessionRequest(BaseModel):
    """Request format to get the information about messages that match the session id"""
    session_id : str
    # might add the user id for validation soon

# format for the message that I get back from the database
class SessionMessage(BaseModel):
    """Message format that I get back from the database"""
    session_id : str
    role : str
    content : str
    user_id : str
    pass

# might not be needed
class SessionMessages(BaseModel):
    """Response format to return the messages and the information for the messages that match session_id"""
    session_id : str
    messages : str
    user_id : str
    pass

