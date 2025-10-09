# TODO: make the auth decoder to get the token from the header requst to extract the user_id
import os
from dotenv import load_dotenv
from fastapi import requests
import requests
from jose import jwt, jwk
from fastapi import HTTPException

# load all the variables from the .env
load_dotenv()

# bring in env variables
url: str = os.getenv("SUPABASE_URL")

# create the JWKS_URL to get the decoder key
JWKS_URL: str = f"{url}/auth/v1/.well-known/jwks.json"


# function to get the jwk structure to compare with the jwt
def get_jwks():
    # try to connect to the supabase auth and get the patterns
    try:
        print("JWKS_URL is fetched correctly")
        # jwks can now be used to authenticate the user requests
        return requests.get(JWKS_URL, timeout=10).json()  # return the response
    except Exception as e:
        print(f"Error fetching JWKS: {e}")
        return None


jwks = get_jwks()


def decode_token(token: str):
    try:
        # get the key ID from the token header
        unverified_header = jwt.get_unverified_header(
            token
        )  # decodes the token and gets the header
        kid = unverified_header.get("kid")  # from the dict get the kid

        key = None  # initialize the key as None
        for jwk_key in jwks["keys"]:  # get each of the keys from the jwks
            if jwk_key["kid"] == kid:  # check if the kid is the same as the key
                key = jwk.construct(jwk_key)  #
                break

        # decode the token and verify the signature
        payload = jwt.decode(token, key, algorithms=["RS256"])
        return {"id": payload["sub"], "email": payload.get("email")}

    except Exception:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
