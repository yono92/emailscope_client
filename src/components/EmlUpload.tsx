import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import debounce from 'lodash/debounce';

const EmlUpload: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedContent, setParsedContent] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragCounter = useRef(0);

  const debouncedSetIsDragging = useRef(
    debounce((value: boolean) => {
      setIsDragging(value);
    }, 100)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSetIsDragging.cancel();
    };
  }, [debouncedSetIsDragging]);

  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/api/email/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload and parse the file.');
      }

      const data = await response.json();
      setParsedContent(data);
    } catch (err) {
      setError('Error uploading or parsing the file.');
    } finally {
      debouncedSetIsDragging(false);
      dragCounter.current = 0;
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    debouncedSetIsDragging(false);
    dragCounter.current = 0;
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      debouncedSetIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      debouncedSetIsDragging(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-start w-full max-w-2xl mx-auto mt-8">
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50 transition-opacity duration-300">
          <FaCloudUploadAlt className="text-white text-6xl" />
          <p className="text-white text-2xl mt-4">Drop your file here</p>
        </div>
      )}

      <div
        className={`border-4 ${
          isDragging ? 'border-blue-500' : 'border-gray-300'
        } border-dashed rounded-md p-6 text-center w-full mb-8 transition-all duration-300`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
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
      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
      {parsedContent && (
        <div className="mt-6 p-4 bg-gray-100 text-gray-900 rounded-md w-full max-h-[60vh] overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Parsed EML Content:</h2>
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: parsedContent.body }}
            style={{ maxWidth: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
};

export default EmlUpload;