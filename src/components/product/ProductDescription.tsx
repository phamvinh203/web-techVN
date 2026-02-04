import ReactMarkdown from 'react-markdown';

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <div className="border-t pt-6 mb-8">
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
  );
}
