import requests

# TODO: refactor to search the web for specific queries that I need Doc to return the right answer to.


# function for searching the web using DuckDuckGo
def web_search(query: str):
    """
    This is a function for searching the web using DuckDuckGo.
    This should only search for the top 5 results, and only if Doc doesn't know the answer.

    query: str
        The search query to be used for the web search.
        (users question will be passed here)
    """

    # url to access the DuckDuckGo search API
    url = "https://www.searchapi.io/api/v1/search"
    # params for the search API
    params = {
        "engine": "duckduckgo",
        "q": query,
    }

    # sending the request to the DuckDuckGo search API
    response = requests.get(url, params=params)

    if response.status_code == 400:
        return "Error: Bad Request. Please check your query."

    if response.status_code == 200:
        return response.text
