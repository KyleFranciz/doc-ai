"""This file will have the schema for the user"""

from typing import Optional
from pydantic import BaseModel


# Profile schema that tells the sorts the type of data that will be in the profile
class ProfileRequest(BaseModel):
    username: str  # username that the user creates
    user_id: Optional[str]  # user_id from supabase auth user
    avatar_url: str  # users icon, is blank till the user uploads one
    auth: Optional[
        str
    ]  # might get optional auth from the frontend for the supabase user and use for check


# Profile schema to tell the sort of data that will be sent to the frontend
class ProfileResponse(BaseModel):
    success: bool
    profile: ProfileRequest  # the first item in the list is fetched from the database and returned
    error: None  # should get back None by default
