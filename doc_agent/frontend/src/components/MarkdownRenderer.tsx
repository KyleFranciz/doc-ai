// this file is for rendering markdown content for my app
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export type MarkdownRendererProps = {
  content: string | undefined;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[rehypeHighlight]}
      components={{
        h1: ({ children }) => (
          <h1 className="mt-5 text-[2.1rem] font-bold">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className=" mt-5 text-[2.8rem] font-bold">{children}</h2>
        ),
        h3: ({ children }) => (
          <div>
            <h3 className="mt-5 text-[1.7rem] font-bold">{children}</h3>
          </div>
        ),
        p: ({ children }) => <p className="my-4 text-[17px]">{children}</p>,

        ol: ({ children }) => <ol className="list-inside my-5">{children}</ol>,
        li: ({ children }) => <li className="mb-6 mt-3 ">{children}</li>,
        ul: ({ children }) => (
          <div>
            <ul className="list-item font-semibold ml-6 mt-5">{children}</ul>
          </div>
        ),
        code: ({ children }) => (
          <div>
            <hr className="my-5 opacity-10" />
            <pre className="bg-[#141414] text-[#fffffe] overflow-x-auto p-4 rounded-md my-3">
              <code className="rext-[0.98rem] font-mono text-gray-400">
                {children}
              </code>
            </pre>

            <hr className="my-5 opacity-10" />
          </div>
        ),
        blockquote: ({ children }) => (
          <blockquote className="">{children}</blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
