#import the app router to use to create dynamic routing
from fastapi import APIRouter
# import the schemas from the chat module I made to help to structure the info that I get back
from doc_agent.backend.schemas.chat_schema import ChatRequest, ChatResponse
# add the ai service after Im done creating it in the service folder

#Create the router to route the chat endpoint 
chat_router = APIRouter()

# post request to create a new chat with Doc
@chat_router.post("/chat", response_model=ChatResponse)
def create_chat_request(request : ChatRequest):
    return {"message" : "Hey it's Doc its nice to meet you"}