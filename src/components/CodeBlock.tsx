interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="relative rounded-lg bg-gray-900 p-4">
      <pre className="overflow-x-auto">
        <code className={`language-${language} text-sm text-gray-100`}>
          {code.trim()}
        </code>
      </pre>
    </div>
  );
}
