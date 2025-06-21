
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ClassificationResultProps {
  result: {
    gender: 'Male' | 'Female';
    confidence: number;
  } | null;
}

const ClassificationResult: React.FC<ClassificationResultProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">🦀</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Classification Yet</h3>
        <p className="text-gray-500">Upload an image and click classify to see results</p>
      </div>
    );
  }

  const getGenderColor = (gender: string) => {
    return gender === 'Male' ? 'from-blue-500 to-blue-600' : 'from-pink-500 to-pink-600';
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'Male' ? '♂️' : '♀️';
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) return { level: 'Very High', color: 'bg-green-500' };
    if (confidence >= 75) return { level: 'High', color: 'bg-blue-500' };
    if (confidence >= 60) return { level: 'Moderate', color: 'bg-yellow-500' };
    return { level: 'Low', color: 'bg-red-500' };
  };

  const confidenceInfo = getConfidenceLevel(result.confidence);

  return (
    <div className="space-y-6">
      {/* Main Result Display */}
      <div className="text-center">
        <div className={`
          bg-gradient-to-r ${getGenderColor(result.gender)} 
          rounded-full p-8 w-32 h-32 mx-auto mb-6 
          flex items-center justify-center shadow-lg
        `}>
          <span className="text-4xl text-white">
            {getGenderIcon(result.gender)}
          </span>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {result.gender}
        </h2>
        
        <Badge 
          variant="secondary" 
          className={`${confidenceInfo.color} text-white text-lg px-4 py-2`}
        >
          {result.confidence.toFixed(1)}% Confidence
        </Badge>
      </div>

      {/* Detailed Confidence Breakdown */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Confidence Level:</span>
              <Badge variant="outline" className={`${confidenceInfo.color} text-white border-0`}>
                {confidenceInfo.level}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prediction Confidence</span>
                <span className="font-semibold">{result.confidence.toFixed(1)}%</span>
              </div>
              <Progress 
                value={result.confidence} 
                className="h-3"
              />
            </div>

            {/* Alternative Probability */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Alternative ({result.gender === 'Male' ? 'Female' : 'Male'})</span>
                <span className="font-semibold">{(100 - result.confidence).toFixed(1)}%</span>
              </div>
              <Progress 
                value={100 - result.confidence} 
                className="h-3"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interpretation Guide */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Result Interpretation:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          {result.confidence >= 90 && (
            <p>• Very high confidence - The model is very certain about this prediction</p>
          )}
          {result.confidence >= 75 && result.confidence < 90 && (
            <p>• High confidence - The model shows strong indicators for this gender</p>
          )}
          {result.confidence >= 60 && result.confidence < 75 && (
            <p>• Moderate confidence - Some uncertainty in the prediction</p>
          )}
          {result.confidence < 60 && (
            <p>• Low confidence - Consider retaking the image for better results</p>
          )}
          <p>• This prediction is based on morphological features learned by the CNN model</p>
        </div>
      </div>
    </div>
  );
};

export default ClassificationResult;
