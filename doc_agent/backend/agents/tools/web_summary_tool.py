from langchain.tools import Tool

from backend.agents.summarizer_agent import fetch_and_summarize

web_summary_tool = Tool(
    name="Web Summarizer",
    func=fetch_and_summarize,
    description="Fetch and summarize content from any url",
)
