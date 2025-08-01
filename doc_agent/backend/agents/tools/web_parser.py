import requests  # helps do I can send requests and get responses

from bs4 import BeautifulSoup  # helps so I can put the info together

# from urllib.parse import urljoin, urlparse # helpful so I can parse sites
# from langchain.schema import Document
# import time  # needed for delay
# from langchain.tools import Tool  # for help w making the tool for the summarizing agent

# NOTE: Made a parser to get all the information from webpages so I can give doc more information
# NOTE: This tool uses the webparser agent to get the information to format and orgaize the data from the web


# function to help w scrapping the data from a webpage
def web_scraper(url: str):
    headers = {"User-Agent": "Mozilla/5.0"}  # Uses firefox so that I can scrape sites
    response = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(response.text, "html.parser")
    return soup.getText()


# # combine the web_scraper function with this function to build the agent to scrape, get and format the info
# def web_scraper_agent(url: str) -> Document:
#     # get the text from the page
#     page_text = web_scraper(url)  # pass in the url and have func fetch the info
#     return Document(
#         # return the page content and the source
#         page_content=page_text,
#         metadata={"source": url},
#     )
#

# tool that the summarizing agent will use to get the information from the web when called on
# scraper_tool = Tool(
#     name="Web Scraper",
#     func=web_scraper_agent,
#     description="Scrapes the provided url and return cleaned up text",
# )
