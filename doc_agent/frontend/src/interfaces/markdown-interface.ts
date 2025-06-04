// interface for code blocks
export interface CodeProps {
  node?: never;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

// interface for the heading props
export interface HeadingProps {
  children: React.ReactNode;
  level?: number;
}

// interface for the link props
export interface LinkProps {
  href?: string;
  children: React.ReactNode;
}

// interface for the blockquote props
export interface BlockquoteProps {
  children: React.ReactNode;
}

// interface for the list props
export interface ListProps {
  children: React.ReactNode;
  ordered?: boolean;
}

//interface for the paragraph props
export interface ParagraphProps {
  children: React.ReactNode;
}

// interface for the table props
export interface TableProps {
  children: React.ReactNode;
}

// interface for the table cell props
export interface TableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
}
