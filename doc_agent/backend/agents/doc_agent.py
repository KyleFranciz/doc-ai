# langchain ollama allows for using ollama models that run locally on my machine
import asyncio
from langchain_ollama import (
    ChatOllama,
)  # langchain allows prompts to be sent to localhost so user can interact
from langchain_core.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from services.fetching_functions import get_all_messages_4_doc
import traceback


# TODO: set up the single response LLM to be for specific uses
# TODO: Possibly make another agent for getting the information from the web and summarizing it for doc


# create the brain
DocBrain = ChatOllama(
    model="qwen2.5-coder:latest",  # model to use for Doc, this is the model that will be used to answer questions",
    temperature=0.5,
    disable_streaming=False,
    tool="chat",  # tool: allows Doc to be able to chat with the user and answer questions ( might change for other models later on if I want to use them for different purposes)
)
# model: choose the model that I want to use, choosing the models brain
# temp has to do with how accurate the response is from the AI, less imaginative
# num_predict makes controls the amount of words the LLM can output back to the user


DocsPrompt = ChatPromptTemplate.from_messages(
    [
        # Doc's Purpose
        SystemMessagePromptTemplate.from_template(
            """Your name is Doc, you are an AI agent created to help primarily with programming
    and helping others understanding coding concepts to the best of your ability, you are also made to help with understanding 
    documents and information on websites when the resources are presented. Introduce yourself once, after that have 
    a normal conversation as you assist the user with whatever questions they may have.
    """
        ),
        # placeholder will store and update the conversation between Doc and the User
        MessagesPlaceholder(variable_name="chat_history"),
        # information the user wants to know from Doc
        HumanMessagePromptTemplate.from_template("{user_input}"),
    ]
)

# Put all the pieces of the llm together


# function to get make for Docs processing process
def getKnowledgeFromDoc(
    user_input: str, session_id: str
):  # todo: Add UserId param later to use the userID when fetching the data
    # use the data fetching function I made to get the messages and sort them so that I can add them as chat history
    message_history = get_all_messages_4_doc(
        session_id=session_id
    )  # get the information if there is any in the DB

    # Use the prompt to input the necessary variable into the prompt to finally send to doc
    prompt = DocsPrompt.format(  # format the prompt for Doc to use
        user_input=user_input,
        # stores the information to the database once the session id is made
        chat_history=message_history,  # todo: update to new LangGraph memory method to be able to store memory for multiple different users
        # todo: update the memory and make it session based as well as get messages from the database
    )

    # Bring everything together and ask Doc the prompt
    answer = DocBrain.invoke(prompt)

    # store the response in the chat history
    return answer.content


# Streaming version of my function to be able to send the response in real time
async def getKnowledgeFromDocStreaming(
    user_input: str, session_id: str
):  # get input from the user that doc should look into
    """
    Streaming version of the regular get knowledge from doc function. This allows for the data from the backend to be sent to
    the front easily so that I can make the user see the response as it is generated.

    Args: user_input (str): The user's input to be processed by Doc.
          session_id (str): The session ID of the user's interaction with Doc.

    Yields: str: The response from Doc, sent in real time as it is generated.
    """
    try:
        print("Streaming response from Doc to the User")

        message_history = get_all_messages_4_doc(session_id=session_id)

        prompt = DocsPrompt.format(user_input=user_input, chat_history=message_history)

        print("Formatted the prompt, starting Doc's response Stream...")

        async for chunk in DocBrain.astream(prompt):
            if hasattr(chunk, "content") and chunk.content:
                print(f"Yielding chunk: {repr(chunk.content[:50])}")
                yield chunk.content

                # This portion is for controlling the speed of which the words
                # are being streamed to the frontend for the user to see
                await asyncio.sleep(0.001)

    except Exception as err:
        # handle the exception and print out the error message
        print(f"error in streaming function: {err}")

        complete_response = getKnowledgeFromDoc(user_input, session_id)

        words = complete_response.split()
        for word in words:
            yield word + " "
            await asyncio.sleep(0.05)

        # get the exact error message and print it out
        print(
            f"Error occurred in getKnowledgeFromDocStreaming: {traceback.format_exc()}"
        )

        # raise an HTTPException with the error message if a chunk doesn't load properly
        yield f"ran into an error while loading a chunk: {str(err)}"
