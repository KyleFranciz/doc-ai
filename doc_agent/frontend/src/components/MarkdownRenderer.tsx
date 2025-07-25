// this file is for rendering markdown content for my app
import ReactMarkdown from "react-markdown";

export type MarkdownRendererProps = {
  content: string | undefined;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-[2.1rem] font-bold">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-[2.8rem] font-bold">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[1.5rem] font-bold">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-3 text-[17px]">{children}</p>,

        ol: ({ children }) => <ol className="list-inside my-3">{children}</ol>,
        li: ({ children }) => <li className="mb-8 mt-3 ">{children}</li>,
        ul: ({ children }) => (
          <ul className="list-disc font-bold ml-6 mt-5">{children}</ul>
        ),
        code: ({ children }) => <code className="bg-blue-950">{children}</code>,
        blockquote: ({ children }) => (
          <blockquote className="bg-red-700">{children}</blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
