// this file is for rendering markdown content for my app
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export type MarkdownRendererProps = {
  content: string | undefined;
};

type InlineCodeProps = React.HTMLAttributes<HTMLElement> & { inline?: boolean };

// TODO: implement the CodeBlock component into this to load the code blocks from the Shadcn Library

// interface CodeProps {
//   children: string,
//   inline?: boolean,
// }

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]} // made a fix for the highlight plugin
      remarkPlugins={[remarkGfm]} // made a fix for the gfm plugin
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
        // made a fix for the code block so that the different code blacks are formatted correctly
        code: ({ children, inline }: InlineCodeProps) =>
          inline ? (
            <code className="bg-[#141414] text-[#fffffe] p-2 rounded-md my-3 font-mono w-auto">
              {children}
            </code>
          ) : (
            <div>
              <pre className="bg-[#141414] text-[#fffffe] overflow-x-auto p-4 rounded-md my-5 font-mono">
                <code className="text-[0.98rem] font-mono text-[#ececec]">
                  {children}
                </code>
              </pre>
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
