# This agent will handle parsing the data from the web
# TODO: Make sure that this agent has a schemma to organize the data from the web to pass on

# imports
# from langchain.schema import Document
from langchain.tools import Tool
from langchain_ollama import ChatOllama  # helps use local model
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from backend.agents.tools.web_parser import web_scraper

# Brain of the Summarizer
SummarizerBrain = ChatOllama(
    model="llama3.2:latest",  # decided to use Meta's LLM
    temperature=0.2,  # NOTE: Adjust to make summary more creative
    disable_streaming=True,  # not streaming
    tool=[web_scraper],  # tool to search the web
)

# Prompt for the Summarizer to follow
SummarizerPrompt = ChatPromptTemplate.from_messages(
    # Summarizer's Purpose
    [
        # TODO: decided on the system prompt later on if need be
        SystemMessagePromptTemplate.from_messages(
            """
        You are summarizing agent, your purpose is to use the data that you get from parsing documments 
        on the web and helping to summaraize and organize information for a user .

        organize the information do that string that has a section that with a summary 
        of the relevant information that the user may want to know, even more if the information has to do with coding Documentation and the other section ras the relevant
        information from the page or document that the other LLM should know that will help to answer 
        other possible information pertaining to the question.
        """
        ),
        # TODO: might adjust later if needed
        HumanMessagePromptTemplate.from_template("{web_content}"),
    ]  # take in the input from the user
)

summarizer_chain = (
    SummarizerPrompt | SummarizerBrain
)  # NOTE: new way to chain LLM together based on the Documentation


# function for Doc to use to use the Summarizer Agent
def fetch_and_summarize(url: str) -> str:
    """
    This gets the information from the web and passes it to a Summarizer LLM

    url : might be either a str or a List of strings
    """
    # use url to have the scrapper get the info from the page
    content = web_scraper(url)

    # call the agent to summarize the content from the web
    summary = summarizer_chain.astream({"web_content": content})

    return summary.content  # response from the summarizer agent


# Tool: for the Doc to use
get_url_summary = Tool(
    name="Get Url Summary",
    func=fetch_and_summarize,
    description="gets the summary of any webpage and gives a summary of the page to any LLM",
)
