import time
from fastapi import HTTPException
from jose import jwt, jwk
import requests


class JWKSCache:
    def __init__(self, jwks_url: str, ttl_seconds: int = 300):
        self.jwks_url = jwks_url
        self.ttl_seconds = ttl_seconds
        self._jwks = None
        self._expires_at = 0.0

    def _fetch(self) -> None:
        response = requests.get(self.jwks_url, timeout=10)
        response.raise_for_status()
        self._jwks = response.json()
        self._expires_at = time.time() + self.ttl_seconds

    def get(self) -> dict:
        if not self._jwks or time.time() >= self._expires_at:
            self._fetch()
        return self._jwks

    def get_key(self, kid: str):
        jwks = self.get()
        for jwk_key in jwks.get("keys", []):
            if jwk_key.get("kid") == kid:
                return jwk.construct(jwk_key)
        self._fetch()
        for jwk_key in self._jwks.get("keys", []):
            if jwk_key.get("kid") == kid:
                return jwk.construct(jwk_key)
        return None


def decode_jwt(token: str, jwks_cache: JWKSCache, issuer: str, audience: str) -> dict:
    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        key = jwks_cache.get_key(kid)
        if not key:
            raise HTTPException(status_code=401, detail="Unknown token key (kid)")
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            issuer=issuer,
            audience=audience,
        )
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
