import DOMPurify from 'isomorphic-dompurify';

type RichTextDisplayProps = {
  content: string;
  className?: string;
};

const RichTextDisplay = ({ content, className = '' }: RichTextDisplayProps) => {
  const sanitized = DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
  return (
    <div 
      className={`rich-text-display max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default RichTextDisplay;
