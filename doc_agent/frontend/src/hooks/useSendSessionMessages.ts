import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../api/ChatSenders";

export const useSendSessionMessages = (
  content: string,
  sessionId: string | undefined,
  role: "human" | "ai" = "human"
) => {
  if (!sessionId || !content.trim()) {
    console.log("Please make sure that the message is typed in correctly");
  }

  return useMutation({
    mutationFn: () => sendChatMessage(content, role, sessionId),
    onSuccess: () => {},
  });
};
