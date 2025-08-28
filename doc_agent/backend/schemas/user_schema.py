"""This file will have the schema for the user"""

from pydantic import BaseModel


# Profile schema that tells the sorts the type of data that will be in the profile
class ProfileRequest(BaseModel):
    username: str  # username that the user creates
    user_id: str  # user_id from supabase auth user
    avatar_url: str  # users icon, is blank till the user uploads one


# Profile schema to tell the sort of data that will be sent to the frontend
class ProfileResponse(BaseModel):
    user_id: str  # user_id from supabase auth user
    username: str  # username that the user creates
    avatar_url: str  # might not use till I set up in the database
