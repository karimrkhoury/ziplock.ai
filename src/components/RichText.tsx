interface RichTextProps {
  text: string;
  className?: string;
}

export function RichText({ text, className = "" }: RichTextProps) {
  // Split text by HTML tags and preserve the tags
  const parts = text.split(/(<bdi>.*?<\/bdi>)/);
  
  return (
    <p className={`inline-block w-full ${className}`}>
      {parts.map((part, i) => {
        if (part.startsWith('<bdi>')) {
          // Extract content between bdi tags
          const content = part.replace(/<\/?bdi>/g, '');
          return <bdi key={i} className="inline-block">{content}</bdi>;
        }
        return part;
      })}
    </p>
  );
} 