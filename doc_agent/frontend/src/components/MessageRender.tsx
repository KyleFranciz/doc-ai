import React from "react";
import { ChatMessage } from "../interfaces/chat-interfaces";

interface MessageRenderProps {
  chatInfo: ChatMessage[];
}

const MessageRender: React.FC<MessageRenderProps> = ({ chatInfo }) => {
  return chatInfo.map((info, index) => (
    <div className="pt-2">
      <div
        key={index}
        className={`p-2 max-w-md rounded-md ${
          info.role === "ai"
            ? "bg-[#303030] text-[#fffffe4]"
            : "bg-[#95AA75] text-[#303030]"
        }`}
      >
        {info.content}
      </div>
    </div>
  ));
};

export default MessageRender;
