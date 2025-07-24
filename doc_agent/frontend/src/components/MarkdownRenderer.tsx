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
          <h1 className="text-2xl font-bold">{children}</h1>
        ),
        h2: ({ children }) => <h2 className="text-xl font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold">{children}</h3>,
        p: ({ children }) => <p className="mb-2">{children}</p>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
