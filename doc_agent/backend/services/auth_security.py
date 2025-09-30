# This has all the functions to help me handle auth with supabase and auth from requests

# imports
from fastapi import HTTPException, Header
from jose import jwk, jwt
from main import get_jwks

# use the function and use it to use in the function
jwks = get_jwks()


# Function to check if the user is authenticated before allowing access to routes
def get_current_user(auth: str = Header(...)):
    # check for the bearer token
    if not auth.startswith("Bearer "):
        # raise and exeption if the bearer token isn't in the auth
        raise HTTPException(status_code=401, detail="Missing authentication header")
    # get the token to use
    token = auth.split(" ")[1]
    # attempt to get use the token in the header
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

        payload = jwt.decode(token, key, algorithms=["RS256"])
        return {"id": payload["sub"], "email": payload.get("email")}
    except Exception:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
