// this file is for rendering markdown content for my app
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";

// Define proper interface for code component props
interface CodeProps {
  children?: React.ReactNode;
  inline?: boolean;
  className?: string;
  [key: string]: any;
}

export type MarkdownRendererProps = {
  content: string | undefined;
};

// TODO: implement the CodeBlock component into this to load the code blocks from the Shadcn Library

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  const components: Components = {
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
    p: ({ children }) => <p className=" my-4 text-[17px]">{children}</p>,

    ol: ({ children }) => <ol className="list-inside my-5">{children}</ol>,
    li: ({ children }) => <li className="mb-6 mt-3 ">{children}</li>,
    ul: ({ children }) => (
      <div>
        <ul className="list-item font-semibold ml-6 mt-5">{children}</ul>
      </div>
    ),
    // Handle inline code (single backticks) and code blocks (triple backticks) differently
    code: ({ children, inline }: CodeProps) => {
      if (inline) {
        // Inline code styling - single backticks
        return (
          <code className="bg-gray-100 dark:bg-[#141414] text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        );
      } else {
        // Code block styling - triple backticks
        return (
          <div className="my-4 rounded-lg overflow-hidden">
            <pre className="bg-[#141414] text-gray-100 p-4 overflow-x-auto">
              <code
                style={{
                  fontFamily: '"Cascadia Code NF", "Cascadia Code", monospace',
                }}
                className="text-sm leading-relaxed"
              >
                {children}
              </code>
            </pre>
          </div>
        );
      }
    },
    blockquote: ({ children }) => (
      <blockquote className="">{children}</blockquote>
    ),
  };

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]} // made a fix for the highlight plugin
      remarkPlugins={[remarkGfm]} // made a fix for the gfm plugin
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};
