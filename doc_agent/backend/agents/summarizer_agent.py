# This agent will handle parsing the data from the web
# TODO: Might make agent stream the response back to the user so that they can see the stream on the frontend


# imports
# from langchain.schema import Document
from langchain.tools import Tool
from langchain_ollama import ChatOllama  # helps use local model
from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)
from agents.tools.web_parser import web_scraper

# Brain of the Summarizer
SummarizerBrain = ChatOllama(
    model="qwen3:8b",  # changed LLM to Qwen3 to help with a better response from the llm
    temperature=0.5,  # NOTE: Adjust to make summary more creative
    disable_streaming=True,  # not streaming
    tool=[web_scraper],  # tool to search the web
)

# Prompt for the Summarizer to follow
SummarizerPrompt = ChatPromptTemplate.from_messages(
    # Summarizer's Purpose
    [
        # TODO: decided on the system prompt later on if need be
        SystemMessagePromptTemplate.from_template(
            """
        You are summarizing agent, your purpose is to use the data that you get from parsing documents 
        on the web and helping to summarize and organize information in valid Markdown. If you have single words in formated in
        code add the description about the word as a comment in the same code block for the user to see. Use fenced code blocks only for multi-line code.
         Do not wrap regular words in backticks. Avoid starting a code fence unless you will close it, and word the information
        in a simple to understand way so that the user reading is able to process and properly understand the summary.

        organize the information in a detailed summary of the relevant information that the user may want
        to know breaking down the important parts and concepts, even more if the information has to do with
        coding Documentation and the other section has the relevant information from the page or document 
        that the other LLM should know that will help to answer other possible information pertaining to the 
        question.
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
    summary = summarizer_chain.invoke({"web_content": content})

    return summary.content  # response from the summarizer agent


# streaming variation of the fetch_and_summarize function
async def fetch_and_summarize_stream(url: str):
    """
    This function streams the output from the summarizer agent piece by piece

    url: str should read the url link that is passed and fetch relevant data from the web
    """
    content = web_scraper(url)  # scrape the url for the info that is needed
    async for chunk in summarizer_chain.astream(
        {"web_content": content}
    ):  # loop to get all the chunks from the summarizer agent
        if getattr(
            chunk, "content", None
        ):  # check if the chunk has is called content as a key
            yield chunk.content  # if so return chunk.content bit by bit


# Tool: for Doc to use
get_url_summary = Tool(
    name="Get Url Summary",
    func=fetch_and_summarize,
    description="gets the summary of any webpage and gives a summary of the page to any LLM",
)
