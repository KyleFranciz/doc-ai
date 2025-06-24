// user schema for supabase
export interface User {
  id: string; // special user ID
  email: string; // users email
  name: string; // username
  password: string; // users password (hashed)
  created_at: string; // when the user was created
  updated_at: string; // when the user was last updated
  is_admin: boolean; // whether the user is an admin or not
  is_verified: boolean; // whether the user has verified their email
  verified_at?: string; // optional: will change based on the user verifies their email
  last_login_at?: string; // optional: will change based on the user logs in
  profile_picture?: string; // optional: will change based on what the user picks as the profile picture
  role: string; // the user's role (either "user" or "admin")
}
