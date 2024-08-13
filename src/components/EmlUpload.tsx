import React, { useState, useCallback } from 'react';

const EmlUpload: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedContent, setParsedContent] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setParsedContent(content);  // 이 부분은 실제 파싱된 데이터를 넣어야 합니다.
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div
        className="border-4 border-dashed border-gray-300 rounded-md p-6 text-center w-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p className="text-lg">Drag and drop your EML file here, or click to upload</p>
        <input
          type="file"
          accept=".eml"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer text-blue-500 underline">
          Click to upload
        </label>
      </div>
      {fileName && (
        <p className="mt-4 text-green-500">Uploaded file: {fileName}</p>
      )}
      {parsedContent && (
        <div className="mt-6 p-4 bg-gray-100 text-gray-900 rounded-md w-full">
          <h2 className="text-lg font-semibold mb-2">Parsed EML Content:</h2>
          <pre className="whitespace-pre-wrap">{parsedContent}</pre>
        </div>
      )}
    </div>
  );
};

export default EmlUpload;
