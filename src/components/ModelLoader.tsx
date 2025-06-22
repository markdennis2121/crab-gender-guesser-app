
import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from './LoadingSpinner';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ModelLoaderProps {
  onModelLoaded: () => void;
  onProgress: (progress: number) => void;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ onModelLoaded, onProgress }) => {
  const [model, setModel] = useState<tf.GraphModel | tf.LayersModel | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  // For demo purposes - replace with your actual hosted model URL
  // Example: 'https://your-cdn.com/models/crab-classifier/model.json'
  const MODEL_URL = 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/classification/5/default/1';
  
  const loadModel = async () => {
    try {
      setLoadingStatus('loading');
      setErrorMessage('');
      onProgress(10);
      
      console.log('Initializing TensorFlow.js...');
      
      // Initialize TensorFlow.js backend
      await tf.ready();
      onProgress(30);
      
      console.log('TensorFlow.js backend ready:', tf.getBackend());
      
      // For demo purposes, we'll use a simplified approach
      // In production, replace this with your actual model loading
      console.log('Loading demo model for crab classification...');
      
      // Simulate model loading for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      onProgress(70);
      
      // Create a simple mock model for demo purposes
      // Replace this entire section with: const loadedModel = await tf.loadLayersModel(MODEL_URL);
      console.log('Model loaded successfully (demo mode)');
      
      // For now, we'll mark as loaded without a real model
      setModel(null); // In production, set the actual loaded model here
      onProgress(100);
      
      setLoadingStatus('loaded');
      onModelLoaded();
      setRetryCount(0);
      
      console.log('Model ready for inference (demo mode)');
      
    } catch (error) {
      console.error('Model loading failed:', error);
      setLoadingStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      onProgress(0);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadModel();
  };

  useEffect(() => {
    loadModel();
  }, []);

  const getStatusIcon = () => {
    switch (loadingStatus) {
      case 'loading':
        return <LoadingSpinner size="sm" className="text-yellow-600" />;
      case 'loaded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (loadingStatus) {
      case 'loading':
        return 'Loading AI model...';
      case 'loaded':
        return 'Model ready for classification';
      case 'error':
        return 'Model loading failed';
      default:
        return 'Initializing...';
    }
  };

  const getStatusColor = () => {
    switch (loadingStatus) {
      case 'loading':
        return 'text-yellow-700';
      case 'loaded':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="flex items-center gap-2 lg:gap-3">
        {getStatusIcon()}
        <span className={`font-medium text-sm lg:text-base ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {loadingStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-medium text-sm">Model Loading Error</p>
              <p className="text-xs lg:text-sm">{errorMessage}</p>
              {retryCount < 3 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="bg-red-50 border-red-200 hover:bg-red-100 text-xs lg:text-sm"
                >
                  <LoadingSpinner size="sm" className="mr-2" />
                  Retry ({3 - retryCount} attempts left)
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {loadingStatus === 'loaded' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-3 lg:pt-4">
            <div className="text-xs lg:text-sm space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4">
                <div>
                  <span className="font-semibold text-green-800">Model Type:</span>
                  <p className="text-green-700">CNN Classifier</p>
                </div>
                <div>
                  <span className="font-semibold text-green-800">Backend:</span>
                  <p className="text-green-700">{tf.getBackend()}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-green-200">
                <span className="font-semibold text-green-800">Status:</span>
                <p className="text-green-700">Ready for inference</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Production Deployment Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-3 lg:pt-4">
          <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm">
            <p className="font-semibold text-blue-800">🚀 For Production Deployment:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Host your trained model files on a CDN (AWS S3, Google Cloud, etc.)</li>
              <li>Update MODEL_URL with your model's public URL</li>
              <li>Ensure CORS is properly configured for your model hosting</li>
              <li>Consider using model quantization for faster loading</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelLoader;
