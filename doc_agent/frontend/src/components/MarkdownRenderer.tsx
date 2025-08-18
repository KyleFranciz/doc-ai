// this file is for rendering markdown content for my app
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { CodeBlock, CodeBlockCopyButton } from "./ai-elements/code-block";

// TODO: FIGURE OUT THE CodeBlock COMPONENT AND WHY ITS NOT WORKING PROPERLY

// Define proper interface for code component props
interface CodeProps {
  children?: React.ReactNode;
  inline?: boolean;
  className?: string;
  [key: string]: any;
}

export type MarkdownRendererProps = {
  content: string;
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
    code: ({ children, className, ...props }: CodeProps) => {
      console.log("Code component props:", { className, children, props });

      // Check if this code element is inside a pre element (code block)
      // If it has a language class, it's likely a code block
      const isCodeBlock = className && className.startsWith("language-");

      console.log("Is code block:", isCodeBlock, "className:", className);

      if (!isCodeBlock) {
        // This is inside a <pre> element (code block), so just style the content
        const language = className?.replace("language-", "");
        const codeString = String(children).replace(/\n$/, ""); // Remove trailing newline
        return (
          <CodeBlock
            code={codeString}
            language={language || "python"}
            showLineNumbers={false}
            className=""
          >
            <CodeBlockCopyButton />
          </CodeBlock>
        );
      }
      //   // Inline code styling - single backticks
      //   return (
      //     <code className="bg-[#141414] text-red-300 px-1.5 py-0.5 rounded ">
      //       {children}
      //     </code>
      //   );
      // }

      //   // Code blocks are wrapped in <pre> tags
      //   return (
      //     <div className="my-4 rounded-lg overflow-hidden">
      //       <pre className="bg-[#141414] text-white p-4 overflow-x-auto">
      //         {children}
      //       </pre>
      //     </div>
      //   );
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
