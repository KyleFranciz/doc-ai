import { GetMessagesResponse } from "../interfaces/chat-interfaces";

export default function MessageRender(chatInfo: GetMessagesResponse) {
  return (
    <div>
      {chatInfo.messages.map((chat) => (
        <div>{chat.content}</div>
      ))}
    </div>
  );
}
