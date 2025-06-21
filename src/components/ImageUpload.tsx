
import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { validateImageFile, createImagePreview, preloadImage } from '@/utils/imageUtils';
import LoadingSpinner from './LoadingSpinner';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string | null;
  onImageRemove?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  currentImage,
  onImageRemove 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    console.log('Processing uploaded file:', file.name, 'Size:', (file.size / 1024).toFixed(1) + 'KB');

    try {
      // Create image preview
      const imageUrl = await createImagePreview(file);
      
      // Preload image to ensure it's ready
      await preloadImage(imageUrl);
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      onImageUpload(imageUrl);
      
      toast({
        title: "Image Uploaded Successfully",
        description: "Your crab image is ready for classification",
      });
      
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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
    // Reset input value to allow re-uploading the same file
    e.target.value = '';
  }, [handleFileSelect]);

  const handleRemoveImage = useCallback(() => {
    if (currentImage && onImageRemove) {
      // Clean up object URL if it exists
      if (currentImage.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage);
      }
      onImageRemove();
    }
  }, [currentImage, onImageRemove]);

  if (currentImage) {
    return (
      <div className="space-y-4">
        <div className="relative group">
          <img 
            src={currentImage} 
            alt="Uploaded crab" 
            className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => {
              toast({
                title: "Image Error",
                description: "Failed to display the image. Please try uploading again.",
                variant: "destructive",
              });
            }}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => document.getElementById('file-input')?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Different Image
        </Button>
        
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 dark:bg-gray-900/20'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/30'}
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
            p-4 rounded-full transition-all duration-300
            ${isDragOver ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}
          `}>
            {isUploading ? (
              <LoadingSpinner size="lg" className="text-blue-600" />
            ) : (
              <ImageIcon className={`h-8 w-8 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {isUploading ? 'Processing Image...' : 'Upload Crab Image'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {isDragOver 
                ? 'Drop your image here' 
                : 'Drag and drop your image here, or click to browse'
              }
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
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
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📸 Image Guidelines:</h4>
        <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <p>• Use clear, well-lit images of crabs</p>
          <p>• Ensure the crab is clearly visible and not obscured</p>
          <p>• Images are processed locally for privacy</p>
          <p>• Supported formats: JPG, PNG, WebP (max 10MB)</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
