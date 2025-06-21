
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ModelMetrics: React.FC = () => {
  // Production-ready metrics - replace with your actual model performance data
  const modelPerformance = {
    overallAccuracy: 94.2,
    maleAccuracy: 96.8,
    femaleAccuracy: 91.5,
    totalSamples: 2500,
    trainingSamples: 2000,
    testingSamples: 500,
    f1Score: 93.8,
    precision: 94.1,
    recall: 93.5
  };

  // Data for accuracy bar chart
  const accuracyData = [
    {
      category: 'Overall',
      accuracy: modelPerformance.overallAccuracy,
      color: '#3B82F6'
    },
    {
      category: 'Male',
      accuracy: modelPerformance.maleAccuracy,
      color: '#10B981'
    },
    {
      category: 'Female',
      accuracy: modelPerformance.femaleAccuracy,
      color: '#F59E0B'
    }
  ];

  // Data for performance metrics
  const performanceData = [
    {
      metric: 'Precision',
      value: modelPerformance.precision,
      color: '#8B5CF6'
    },
    {
      metric: 'Recall',
      value: modelPerformance.recall,
      color: '#EF4444'
    },
    {
      metric: 'F1-Score',
      value: modelPerformance.f1Score,
      color: '#06B6D4'
    }
  ];

  // Data for dataset distribution
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
        <div className="bg-white dark:bg-slate-800 p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-slate-900 dark:text-slate-100">{label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            {payload[0].dataKey === 'accuracy' ? 'Accuracy' : 'Value'}: {payload[0].value.toFixed(1)}%
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

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {modelPerformance.f1Score}%
              </div>
              <div className="text-sm opacity-90">F1-Score</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {modelPerformance.totalSamples.toLocaleString()}
              </div>
              <div className="text-sm opacity-90">Training Samples</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Classification Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <YAxis 
                    domain={[80, 100]}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }}
                    className="text-slate-600 dark:text-slate-400"
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

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="metric" 
                    tick={{ fontSize: 12 }}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <YAxis 
                    domain={[80, 100]}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dataset Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Dataset Distribution</CardTitle>
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
            <CardTitle>Model Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Training:</span>
                  <Badge variant="outline">{modelPerformance.trainingSamples.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Testing:</span>
                  <Badge variant="outline">{modelPerformance.testingSamples.toLocaleString()}</Badge>
                </div>
              </div>

              <div className="pt-4 border-t dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 dark:text-gray-400">Performance:</span>
                  <Badge className={`${getAccuracyLevel(modelPerformance.overallAccuracy).color} text-white`}>
                    {getAccuracyLevel(modelPerformance.overallAccuracy).level}
                  </Badge>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="pt-4 border-t dark:border-gray-700">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Technical Specs</h4>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="block font-medium">Architecture:</span>
                    <span>Custom CNN</span>
                  </div>
                  <div>
                    <span className="block font-medium">Input Size:</span>
                    <span>224×224×3</span>
                  </div>
                  <div>
                    <span className="block font-medium">Classes:</span>
                    <span>2 (Binary)</span>
                  </div>
                  <div>
                    <span className="block font-medium">Framework:</span>
                    <span>TensorFlow.js</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Notes */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="pt-6">
          <div className="text-sm text-emerald-800 dark:text-emerald-200">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              🚀 Production Ready Features:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 list-disc list-inside">
                <li>Error boundaries for crash protection</li>
                <li>Loading states and progress indicators</li>
                <li>Image validation and optimization</li>
                <li>Responsive design for all devices</li>
              </ul>
              <ul className="space-y-2 list-disc list-inside">
                <li>Modern glassmorphism UI design</li>
                <li>Dark mode support</li>
                <li>Performance optimizations</li>
                <li>Netlify deployment configuration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelMetrics;
