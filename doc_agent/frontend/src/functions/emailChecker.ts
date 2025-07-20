import { supabase } from "@/connections/supabaseClient";
import { toast } from "sonner"


// this file is for checking the email of a user
export const emailChecker = async (email: string) => {
  try {
    const { data, emailError } = await supabase.auth.getUser();

    if (emailError) {
      console.log(emailError);
      return;
    }

    if (email === data.user?.email) {
      toast.error("email is alreasdy in use")
    } else {
      return
    }
  } catch (error) {
    console.log(error)
  };
}
