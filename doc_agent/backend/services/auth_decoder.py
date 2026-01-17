import os
from dotenv import load_dotenv
from fastapi import HTTPException
from services.jwks_cache import JWKSCache, decode_jwt


load_dotenv()

url: str | None = os.getenv("SUPABASE_URL")
if not url:
    raise ValueError("Supabase Url was not loaded properly")

project_id = os.getenv("PROJECT_ID")
if project_id:
    jwks_url = f"https://{project_id}.supabase.co/auth/v1/.well-known/jwks.json"
else:
    jwks_url = f"{url}/auth/v1/.well-known/jwks.json"
issuer = os.getenv("SUPABASE_JWT_ISSUER", f"{url}/auth/v1")
audience = os.getenv("SUPABASE_JWT_AUD", "authenticated")
cache_ttl = int(os.getenv("JWKS_CACHE_TTL", "300"))

jwks_cache = JWKSCache(jwks_url, ttl_seconds=cache_ttl)


def decode_token(token: str):
    try:
        payload = decode_jwt(token, jwks_cache, issuer=issuer, audience=audience)
        return {"id": payload["sub"], "email": payload.get("email")}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
