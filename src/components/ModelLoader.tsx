
import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Circle } from 'lucide-react';

interface ModelLoaderProps {
  onModelLoaded: () => void;
  onProgress: (progress: number) => void;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ onModelLoaded, onProgress }) => {
  const [model, setModel] = useState<tf.GraphModel | tf.LayersModel | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // PLACEHOLDER MODEL URL - Replace with your actual model URL
  const MODEL_URL = '/models/crab-gender-classifier/model.json';
  
  const loadModel = async () => {
    try {
      setLoadingStatus('loading');
      setErrorMessage('');
      onProgress(10);
      
      console.log('Starting model load from:', MODEL_URL);
      
      // Initialize TensorFlow.js backend
      await tf.ready();
      onProgress(30);
      
      console.log('TensorFlow.js backend ready');
      
      // IMPORTANT: Replace this URL with your actual model path
      // Your model should be hosted and accessible at this URL
      // The model.json file should be accompanied by the weights files
      
      try {
        // Try loading as GraphModel first (for converted models)
        const loadedModel = await tf.loadGraphModel(MODEL_URL);
        setModel(loadedModel);
        console.log('Model loaded successfully as GraphModel');
      } catch (graphError) {
        console.log('Failed to load as GraphModel, trying LayersModel...');
        // Fallback to LayersModel (for native Keras models)
        const loadedModel = await tf.loadLayersModel(MODEL_URL);
        setModel(loadedModel);
        console.log('Model loaded successfully as LayersModel');
      }
      
      onProgress(90);
      
      // Warm up the model with a dummy prediction
      console.log('Warming up model with dummy prediction...');
      const dummyInput = tf.zeros([1, 224, 224, 3]); // Adjust input shape as needed
      
      if (model instanceof tf.GraphModel) {
        model.predict(dummyInput);
      } else if (model instanceof tf.LayersModel) {
        model.predict(dummyInput);
      }
      
      dummyInput.dispose();
      onProgress(100);
      
      setLoadingStatus('loaded');
      onModelLoaded();
      
      console.log('Model ready for inference');
      
    } catch (error) {
      console.error('Model loading failed:', error);
      setLoadingStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      onProgress(0);
    }
  };

  useEffect(() => {
    // Auto-load model on component mount
    loadModel();
  }, []);

  const getStatusColor = () => {
    switch (loadingStatus) {
      case 'loading': return 'text-yellow-600';
      case 'loaded': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (loadingStatus) {
      case 'loading': return 'Loading CNN model...';
      case 'loaded': return 'Model loaded and ready';
      case 'error': return 'Failed to load model';
      default: return 'Initializing...';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {loadingStatus === 'loading' && (
          <Circle className="h-4 w-4 animate-spin text-yellow-600" />
        )}
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {loadingStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="space-y-2">
              <p>Model loading failed: {errorMessage}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadModel}
                className="mt-2"
              >
                Retry Loading
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {loadingStatus === 'error' && (
        <Alert>
          <AlertDescription>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">To use your own model:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Convert your trained model to TensorFlow.js format</li>
                <li>Host the model.json and weights files on your server</li>
                <li>Update the MODEL_URL in ModelLoader.tsx</li>
                <li>Ensure the model input shape matches your training data</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {loadingStatus === 'loaded' && model && (
        <Alert>
          <AlertDescription>
            <div className="text-sm space-y-1">
              <p><strong>Model Type:</strong> {model instanceof tf.GraphModel ? 'GraphModel' : 'LayersModel'}</p>
              <p><strong>Backend:</strong> {tf.getBackend()}</p>
              <p><strong>Status:</strong> Ready for inference</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ModelLoader;
