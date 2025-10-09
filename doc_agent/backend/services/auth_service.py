# this file is for services to use inside the main server function


from fastapi import HTTPException, Header

from services.auth_decoder import decode_token


def get_current_user(auth: str = Header(...)):
    """
    This function gets the auth info from the header and checks the token and get the auth info by deciphering it

    auth : str (Header) get the header from a request, use with the Depends function to implement in routes
    """
    # check if the request header has the Bearer
    if not auth.startswith("Bearer "):
        # raise and except
        raise HTTPException(
            status_code=401, detail="Missing or Invalid authorization header"
        )

    # otherwise split the second item
    token = auth.split(" ")[1]

    # decode the token that we got back
    decoded = decode_token(token)

    # return it
    return decoded
