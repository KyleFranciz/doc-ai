import React from "react";
import { ChatMessage } from "../interfaces/chat-interfaces";
//import ReactMarkdown, { Components } from "react-markdown";
//import remarkGfm from "remark-gfm";
//import rehypeHighlight from "rehype-highlight";

type MessageRenderProps = {
  chatInfo: ChatMessage[];
};

const MessageRender: React.FC<MessageRenderProps> = ({ chatInfo }) => {
  //todo: add user Icon to the chat box when the user sends a message
  return chatInfo.map((info) => (
    <div className="" key={info.id}>
      {info.role === "ai" ? (
        <div className="p-2 my-1 max-w-xl rounded-md bg-[#171717] text-[#fffffe4]">
          {info.content}
        </div>
      ) : (
        <div className="p-2 max-w-xl my-2 rounded-md bg-[#282828] font-medium text-[#ffffff]">
          {info.content}
        </div>
      )}
    </div>
  ));
};

export default MessageRender;
