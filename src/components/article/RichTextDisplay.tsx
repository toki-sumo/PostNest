type RichTextDisplayProps = {
  content: string;
  className?: string;
};

const RichTextDisplay = ({ content, className = '' }: RichTextDisplayProps) => {
  return (
    <div 
      className={`rich-text-display max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextDisplay;
