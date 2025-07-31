# This agent will handle parsing the data from the web
# TODO: Make sure that this agent has a schemma to organize the data from the web to pass on

# imports
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
    temperature=0.2,  # WARNING: Adjust to make summary more creative
    disable_streaming=True,  # not streaming
    tool=[web_scraper()],  # tool to search the web
)

# Prompt for the Summarizer to follow
SummarizerPrompt = ChatPromptTemplate.from_messages(
    # Summarizer's Purpose
    [
        SystemMessagePromptTemplate.from_messages(
            """
        You are summarizing agent, your purpose is to use the data that you get from parsing documments on the web
        help summaraize and organize information for another LLM to relay the information to a Human.
        """
        ),
        HumanMessagePromptTemplate.from_template(
            "Summarize the information on this site {web_content}"
        ),
    ]  # take in the input from the user
)


# Function to start the summarizing process
def setSummaryFromSummarizer():
    pass
