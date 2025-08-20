type RichTextDisplayProps = {
  content: string;
  className?: string;
};

const RichTextDisplay = ({ content, className = '' }: RichTextDisplayProps) => {
  return (
    <div 
      className={`prose prose-invert prose-slate max-w-none text-slate-300 [&>*]:text-slate-300 [&_p]:text-slate-300 [&_div]:text-slate-300 [&_span]:text-slate-300 [&_strong]:text-white [&_em]:text-slate-200 [&_code]:text-blue-300 [&_pre]:text-slate-300 [&_blockquote]:text-slate-300 [&_li]:text-slate-300 [&_a]:text-blue-400 [&_a:hover]:text-blue-300 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichTextDisplay;
