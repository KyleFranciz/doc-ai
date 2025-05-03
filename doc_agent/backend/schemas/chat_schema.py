#Import the base model from pydantic so that I can create a model for these chat pieces
from pydantic import BaseModel # create default model

# import langchain Ai message that the Agent gives back as a default response in this format
from langchain_core.messages import AIMessage

#typing model will help me when developing an making connections with older versions of python
from typing import List # allows me to type the parameters for the objects I make 

class MessageRequest(BaseModel): # use base model to define the schema for this chat request
    question : str 
    session_id : str #string to that the sesion can be saved in the database
    user_id : str # id of the user that sends the request
    # role will be filled automatically
    
    
    

#returned to in json format to the user
class DocsResponse(BaseModel): # structure docs response
    status : str
    user_question : str
    docs_response : str
