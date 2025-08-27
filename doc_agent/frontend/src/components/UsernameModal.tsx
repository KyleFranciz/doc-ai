import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserName } from "@/connections/user-connections";
import { useState } from "react";
import { FormEvent } from "react"; // for the form event
import { User } from "@supabase/supabase-js";

// interface for the UsernameModal component
interface UsernameModalProps {
  user: User | null;
}

export function UsernameModal({ user }: UsernameModalProps) {
  // states to keep track of the open state of the modal
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // funtion to close the modal
  const closeModal = () => {
    setOpen(false);
  };

  // function to handle the submition of the username
  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault(); // prevent the form from submitting

    // set the loading state to true
    setIsLoading(true);

    // call the create username function
    updateUserName(username, user?.id as string);

    // set the loading state to false
    setIsLoading(false);

    // close the modal
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-neutral-900 text-white border-black">
        <DialogHeader>
          <DialogTitle>Change your username</DialogTitle>
          <DialogDescription>
            Make changes to your username here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              className="text-white"
              id="link"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleModalSubmit(e);
                }
              }}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {/* TODO: change the styling on the button */}
            <Button type="button" className="bg-[#202020] text-white">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
