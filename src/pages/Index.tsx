
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Image as ImageIcon, ArrowUp, Brain, TrendingUp, Zap } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import ModelLoader from '@/components/ModelLoader';
import ClassificationResult from '@/components/ClassificationResult';
import ModelMetrics from '@/components/ModelMetrics';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useModelInference } from '@/hooks/useModelInference';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  
  const { toast } = useToast();
  const { isClassifying, result, classifyImage, resetResult } = useModelInference();

  const handleImageUpload = useCallback((imageUrl: string) => {
    setUploadedImage(imageUrl);
    resetResult();
    console.log('Image uploaded successfully:', imageUrl);
  }, [resetResult]);

  const handleImageRemove = useCallback(() => {
    if (uploadedImage && uploadedImage.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    resetResult();
  }, [uploadedImage, resetResult]);

  const handleModelLoaded = useCallback(() => {
    setIsModelLoaded(true);
    setModelLoadingProgress(100);
    toast({
      title: "Model Loaded Successfully",
      description: "The AI model is ready for crab gender classification.",
    });
    console.log('CNN model loaded and ready for inference');
  }, [toast]);

  const handleClassification = useCallback(async () => {
    if (uploadedImage && isModelLoaded) {
      await classifyImage(uploadedImage, isModelLoaded);
    }
  }, [uploadedImage, isModelLoaded, classifyImage]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Mobile-first Header Section */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-4 lg:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-3 lg:p-6 rounded-2xl shadow-2xl">
                  <ImageIcon className="h-6 w-6 lg:h-10 lg:w-10 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 lg:mb-6 tracking-tight leading-tight">
              Crab Gender Classifier
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium px-4">
              Advanced AI-powered crab gender detection using cutting-edge computer vision technology
            </p>
            
            {/* Mobile-optimized Feature Badges */}
            <div className="flex flex-wrap justify-center gap-2 lg:gap-4 mt-4 lg:mt-8 px-4">
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-white/20">
                <Brain className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
                <span className="text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-300">AI Powered</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-white/20">
                <Zap className="h-3 w-3 lg:h-4 lg:w-4 text-indigo-600" />
                <span className="text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-300">Real-time</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-white/20">
                <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600" />
                <span className="text-xs lg:text-sm font-semibold text-slate-700 dark:text-slate-300">High Accuracy</span>
              </div>
            </div>
          </div>

          {/* Mobile-responsive Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-8 mb-8">
            {/* Left Column - Upload and Model */}
            <div className="space-y-4 lg:space-y-6">
              {/* Model Loading Section */}
              <Card className="shadow-xl lg:shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg lg:text-2xl">
                    <div className={`h-2 w-2 lg:h-3 lg:w-3 rounded-full ${isModelLoaded ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse shadow-lg`} />
                    AI Model Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 lg:space-y-4">
                  <ModelLoader 
                    onModelLoaded={handleModelLoaded}
                    onProgress={setModelLoadingProgress}
                  />
                  <div className="space-y-2">
                    <Progress value={modelLoadingProgress} className="h-2 bg-slate-200 dark:bg-slate-700" />
                    <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {isModelLoaded ? '✨ Model ready for inference' : '🔄 Loading neural network...'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload Section */}
              <Card className="shadow-xl lg:shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg lg:text-2xl">
                    <ImageIcon className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                    Upload Crab Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload 
                    onImageUpload={handleImageUpload} 
                    currentImage={uploadedImage}
                    onImageRemove={handleImageRemove}
                  />
                  {uploadedImage && (
                    <div className="mt-4 lg:mt-6">
                      <Button 
                        onClick={handleClassification}
                        disabled={!isModelLoaded || isClassifying}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 lg:py-4 text-sm lg:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                        size="lg"
                      >
                        {isClassifying ? (
                          <div className="flex items-center gap-2 lg:gap-3">
                            <LoadingSpinner size="sm" className="text-white" />
                            <span className="text-sm lg:text-base">Analyzing Image...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 lg:gap-3">
                            <Brain className="h-4 w-4 lg:h-5 lg:w-5" />
                            <span className="text-sm lg:text-base">Classify Gender</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-4 lg:space-y-6">
              {/* Classification Results */}
              <Card className="shadow-xl lg:shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg lg:text-2xl">
                    <ArrowUp className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-600" />
                    Classification Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ClassificationResult result={result} />
                </CardContent>
              </Card>

              {/* Model Performance Metrics */}
              <Card className="shadow-xl lg:shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                <CardHeader className="pb-3 lg:pb-4">
                  <CardTitle className="flex items-center gap-2 lg:gap-3 text-lg lg:text-2xl">
                    <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
                    Model Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ModelMetrics />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technical Information */}
          <Card className="shadow-xl lg:shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <CardHeader className="pb-3 lg:pb-4">
              <CardTitle className="text-lg lg:text-2xl">🔬 Technical Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-blue-200 bg-blue-50/80 dark:bg-blue-950/20 dark:border-blue-800">
                <AlertDescription className="text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  This application leverages <strong>TensorFlow.js</strong> for client-side CNN inference, ensuring complete privacy and lightning-fast predictions. 
                  The model runs entirely in your browser using WebGL acceleration. For production deployment, replace the placeholder model URL in 
                  <code className="mx-1 px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs lg:text-sm">ModelLoader.tsx</code> 
                  with your trained model hosted on a reliable CDN.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
