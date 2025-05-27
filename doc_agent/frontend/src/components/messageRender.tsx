import { ChatMessage } from "../interfaces/chat-interfaces";

export default function MessageRender(message: ChatMessage) {
  return (
    <div key={message.id}>
      <div>{message.role}</div>
      <div>{message.content}</div>
      <div>{message.createdAt}</div>
    </div>
  );
}
