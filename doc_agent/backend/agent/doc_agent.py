# langchain ollama allows for using ollama models that run locally on my machine
from langchain_ollama import ChatOllama # langchain allows prompts to be sent to localhost so user can interact
from langchain_ollama.llms import OllamaLLM # useful for one time questions 
from langchain_core.prompts import ChatPromptTemplate , MessagesPlaceholder, HumanMessagePromptTemplate, SystemMessagePromptTemplate
from langchain.memory import ConversationBufferMemory
from services.fetching_functions import get_all_messages_4_doc


#TODO: set up the single response LLM to be for specific uses
#TODO: Possibly make another agent for getting the information from the web and summarizing it for doc 


#create the brain
DocBrain = ChatOllama(model="deepseek-coder:6.7b", temperature=0.5, disable_streaming=False,)
#model: choose the model that I want to use, choosing the models brain 
#temp has to do with how accurate the response is from the AI, less imaginative
#num_predict makes controls the amount of words the LLM can output back to the user


DocsPrompt = ChatPromptTemplate.from_messages([
    # Doc's Purpose
    SystemMessagePromptTemplate.from_template("""You are not an Ai Model From DeepSeek instead your name is Doc, you are an AI agent created by Kyle that helps primarily with programming
    and helping others understanding coding concepts to the best of your ability, you are also made to help with understanding 
    documents and information on websites when the resources are presented. Introduce yourself once, after that have 
    a normal conversation as you assist the user with whatever questions they may have.
    """), 
    # placeholder will store and update the conversation between Doc and the User
    MessagesPlaceholder(variable_name="chat_history"),
    # information the user wants to know from Doc
    HumanMessagePromptTemplate.from_template("{user_input}")
    ])

# Put all the pieces of the llm together

#function to get make for Docs processing process
def getKnowledgeFromDoc(user_input : str, session_id: str): # get input from the user that doc should look into
    # use the data fetching function I made to get the messages and sort them so that I can add them as chat history
    message_history = get_all_messages_4_doc(session_id=session_id) # get the information if there is any in the DB

    # Use the prompt to input the necessary variable into the prompt to finally send to doc
    prompt = DocsPrompt.format( # format the prompt for Doc to use
        user_input=user_input,
        # stores the information to the database once the session id is made
        chat_history=message_history # todo: update to new LangGraph memory method to be able to store memory for multiple different users
                                    # todo: update the memory and make it session based as well as get messages from the database
        )
    
    # Bring everything together and ask Doc the prompt
    answer = DocBrain.invoke(prompt)

    # store the response in the chat history
    return answer.content

# function to get the messages from the database


#function to get the chat_session from the database





