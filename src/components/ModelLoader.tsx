
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

  // Production-ready model URL - replace with your actual model
  const MODEL_URL = '/models/crab-gender-classifier/model.json';
  
  const loadModel = async () => {
    try {
      setLoadingStatus('loading');
      setErrorMessage('');
      onProgress(10);
      
      console.log('Initializing TensorFlow.js...');
      
      // Initialize TensorFlow.js backend with better error handling
      await tf.ready();
      onProgress(30);
      
      console.log('TensorFlow.js backend ready:', tf.getBackend());
      
      // Attempt to load the model with proper error handling
      let loadedModel: tf.GraphModel | tf.LayersModel;
      
      try {
        console.log('Attempting to load model from:', MODEL_URL);
        loadedModel = await tf.loadGraphModel(MODEL_URL);
        console.log('Model loaded successfully as GraphModel');
      } catch (graphError) {
        console.log('GraphModel loading failed, trying LayersModel...');
        try {
          loadedModel = await tf.loadLayersModel(MODEL_URL);
          console.log('Model loaded successfully as LayersModel');
        } catch (layersError) {
          throw new Error(`Failed to load model: ${graphError instanceof Error ? graphError.message : 'Unknown error'}`);
        }
      }
      
      setModel(loadedModel);
      onProgress(80);
      
      // Warm up the model with appropriate input shape
      console.log('Warming up model...');
      const dummyInput = tf.zeros([1, 224, 224, 3]);
      
      try {
        if (loadedModel instanceof tf.GraphModel) {
          loadedModel.predict(dummyInput);
        } else {
          loadedModel.predict(dummyInput);
        }
      } catch (warmupError) {
        console.warn('Model warmup failed, but continuing:', warmupError);
      }
      
      dummyInput.dispose();
      onProgress(100);
      
      setLoadingStatus('loaded');
      onModelLoaded();
      setRetryCount(0);
      
      console.log('Model ready for inference');
      
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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {loadingStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-medium">Model Loading Error</p>
              <p className="text-sm">{errorMessage}</p>
              {retryCount < 3 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="bg-red-50 border-red-200 hover:bg-red-100"
                >
                  <LoadingSpinner size="sm" className="mr-2" />
                  Retry ({3 - retryCount} attempts left)
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {loadingStatus === 'error' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="space-y-3 text-sm">
              <p className="font-semibold text-blue-800">For Production Deployment:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Replace MODEL_URL with your trained model's URL</li>
                <li>Ensure model.json and weight files are accessible</li>
                <li>Host model files on a CDN for better performance</li>
                <li>Consider using TensorFlow.js model quantization</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {loadingStatus === 'loaded' && model && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="text-sm space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-green-800">Model Type:</span>
                  <p className="text-green-700">{model instanceof tf.GraphModel ? 'GraphModel' : 'LayersModel'}</p>
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
    </div>
  );
};

export default ModelLoader;
