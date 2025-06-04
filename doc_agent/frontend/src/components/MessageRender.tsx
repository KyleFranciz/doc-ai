import React from "react";
import { ChatMessage } from "../interfaces/chat-interfaces";
//import ReactMarkdown, { Components } from "react-markdown";
//import remarkGfm from "remark-gfm";
//import rehypeHighlight from "rehype-highlight";

interface MessageRenderProps {
  chatInfo: ChatMessage[];
}

const hasMarkDown = (content: string): boolean => {
  const markdownPatterns = [
    /^#{1,6}\s/m, // Headers
    /\*\*.*\*\*/, // Bold
    /\*.*\*/, // Italic
    /`.*`/, // Inline code
    /```[\s\S]*```/, // Code blocks
    /^\s*[-*+]\s/m, // Unordered lists
    /^\s*\d+\.\s/m, // Ordered lists
    /\[.*\]\(.*\)/, // Links
    /^\s*>/m, // Blockquote
  ];
  return markdownPatterns.some((pattern) => pattern.test(content));
};

const MessageRender: React.FC<MessageRenderProps> = ({ chatInfo }) => {
  //todo: add user Icon to the chat box when the user sends a message
  return chatInfo.map((info) => (
    <div className="" key={info.id}>
      {info.role === "ai" || hasMarkDown(info.content) ? (
        <div className="p-2 max-w-xl rounded-md bg-[#303030] text-[#fffffe4]">
          {info.content}
        </div>
      ) : (
        <div className="p-2 max-w-2xl rounded-md bg-[#1e1f1d] text-[#ffffff]">
          {info.content}
        </div>
      )}
    </div>
  ));
};

export default MessageRender;
