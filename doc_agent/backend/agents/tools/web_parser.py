import requests  # helps do I can send requests and get responses

# from bs4 import BeautifulSoup # helps so I can put the info together
# # from urllib.parse import urljoin, urlparse # helpful so I can parse sites
# import time # needed for delay
from langchain.tools import Tool

# NOTE: Made a parser to get all the information from webpages so I can give doc more information
# NOTE: This tool uses the webparser agent to get the information to format and orgaize the data from the web


# function for scraping the web
def web_scraper(url: str):
    headers = {"User-Agent": "Mozilla/5.0"}  # Uses firefox so that I can scrape sites
    response = requests.get(url, headers=headers, timeout=5)

    # send a request to get the data from the web
    # then use BeautifulSoup to parse the HTML
    # return all the text from the page
    pass


scraper_tool = Tool(
    name="Web Scraper",
    func=web_scraper,
    description="Scrapes the provided url and return cleaned up text",
)

# TODO: make a function to get the data from the web and return the data
