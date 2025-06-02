import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../api/ChatFetcher";

export const useGetSessionMessages = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: ["sessionMessages", { sessionId }],
    queryFn: () => fetchMessages(sessionId),
  });
};
