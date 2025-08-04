import requests  # helps do I can send requests and get responses

from bs4 import BeautifulSoup  # helps so I can put the info together
import re

# from langchain.tools import Tool

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


# set up url pattern to be able to check for urls
url_pattern = re.compile(
    r"https?://[^\s]+"
)  # checks for https:// and any other whitespace or symbols right after


# function to check for all the links in the users input check if multiple layouts are given
def check_all_urls(user_input: str):
    # check if there are urls and then save the urls in an array
    all_urls = re.findall(url_pattern, user_input)
    # return all the urls in the user_input in order
    return all_urls  # will use to loop through later on


# function to check a users input for a url
# TODO: use for in the doc_agent.py file or the route on the main.py file
def check_for_url(user_input: str) -> bool:
    # get back true or false if url is found users input
    return bool(url_pattern.search(user_input))
