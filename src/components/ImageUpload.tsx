
import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    console.log('Processing uploaded file:', file.name, 'Size:', file.size);

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);
    
    // Simulate upload processing
    setTimeout(() => {
      onImageUpload(imageUrl);
      setIsUploading(false);
      toast({
        title: "Image Uploaded Successfully",
        description: "Your crab image is ready for classification",
      });
    }, 500);
  }, [onImageUpload, toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="w-full">
      {/* Drag and Drop Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`
            p-3 rounded-full transition-colors duration-200
            ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}
          `}>
            {isUploading ? (
              <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ImageIcon className={`h-8 w-8 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {isUploading ? 'Processing Image...' : 'Upload Crab Image'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop your image here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports JPG, PNG, WebP (max 10MB)
            </p>
          </div>
        </div>
        
        {!isUploading && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('file-input')?.click();
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• For best results, use clear, well-lit images of crabs</p>
        <p>• Ensure the crab is clearly visible and not obscured</p>
        <p>• Images will be processed locally on your device</p>
      </div>
    </div>
  );
};

export default ImageUpload;
