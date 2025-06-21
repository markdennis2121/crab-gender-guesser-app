
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ModelMetrics: React.FC = () => {
  // PLACEHOLDER METRICS - Replace with your actual model performance data
  const modelPerformance = {
    overallAccuracy: 94.2,
    maleAccuracy: 96.8,
    femaleAccuracy: 91.5,
    totalSamples: 2500,
    trainingSamples: 2000,
    testingSamples: 500
  };

  // Data for bar chart
  const accuracyData = [
    {
      category: 'Overall',
      accuracy: modelPerformance.overallAccuracy,
      color: '#3B82F6'
    },
    {
      category: 'Male Classification',
      accuracy: modelPerformance.maleAccuracy,
      color: '#10B981'
    },
    {
      category: 'Female Classification',
      accuracy: modelPerformance.femaleAccuracy,
      color: '#F59E0B'
    }
  ];

  // Data for pie chart
  const genderDistribution = [
    {
      name: 'Male Samples',
      value: 52.4,
      color: '#3B82F6'
    },
    {
      name: 'Female Samples',
      value: 47.6,
      color: '#EC4899'
    }
  ];

  const getAccuracyLevel = (accuracy: number) => {
    if (accuracy >= 95) return { level: 'Excellent', color: 'bg-green-500' };
    if (accuracy >= 90) return { level: 'Very Good', color: 'bg-blue-500' };
    if (accuracy >= 85) return { level: 'Good', color: 'bg-yellow-500' };
    return { level: 'Needs Improvement', color: 'bg-red-500' };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            Accuracy: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {modelPerformance.overallAccuracy}%
              </div>
              <div className="text-sm opacity-90">Overall Accuracy</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {modelPerformance.maleAccuracy}%
              </div>
              <div className="text-sm opacity-90">Male Classification</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {modelPerformance.femaleAccuracy}%
              </div>
              <div className="text-sm opacity-90">Female Classification</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accuracy Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Model Accuracy Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[80, 100]}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="accuracy" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gender Distribution Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Data Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Model Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Model Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Training Samples:</span>
                <Badge variant="outline">{modelPerformance.trainingSamples.toLocaleString()}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Testing Samples:</span>
                <Badge variant="outline">{modelPerformance.testingSamples.toLocaleString()}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Dataset:</span>
                <Badge variant="outline">{modelPerformance.totalSamples.toLocaleString()}</Badge>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Performance Level:</span>
                  <Badge className={`${getAccuracyLevel(modelPerformance.overallAccuracy).color} text-white`}>
                    {getAccuracyLevel(modelPerformance.overallAccuracy).level}
                  </Badge>
                </div>
              </div>

              {/* Model Configuration Info */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-3">Model Configuration</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Architecture:</span>
                    <span className="font-medium">CNN (Custom)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input Size:</span>
                    <span className="font-medium">224x224x3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classes:</span>
                    <span className="font-medium">2 (Male/Female)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Notes */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="text-sm text-amber-800">
            <h4 className="font-semibold mb-3">📝 Implementation Notes:</h4>
            <ul className="space-y-2 list-disc list-inside">
              <li>These metrics are placeholder values for demonstration</li>
              <li>Replace the modelPerformance object with your actual model's metrics</li>
              <li>Accuracy values should be calculated from your validation/test sets</li>
              <li>Consider adding confusion matrix and other relevant metrics</li>
              <li>Update the model configuration details to match your architecture</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelMetrics;
