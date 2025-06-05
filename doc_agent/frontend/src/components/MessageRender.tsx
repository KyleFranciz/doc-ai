import React from "react";
import { ChatMessage } from "../interfaces/chat-interfaces";

interface MessageRenderProps {
  chatInfo: ChatMessage[];
}

const MessageRender: React.FC<MessageRenderProps> = ({ chatInfo }) => {
  //todo: add user Icon to the chat box when the user sends a message
  return chatInfo.map((info) => (
    <div className="pt-2">
      <div
        key={info.id}
        className={`p-2 max-w-md rounded-md ${
          info.role === "ai"
            ? "bg-[#303030] text-[#fffffe4]"
            : "bg-[#1e1f1d] text-[#ffffff]"
        }`}
      >
        {info.content}
      </div>
    </div>
  ));
};

export default MessageRender;
