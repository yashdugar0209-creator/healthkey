// components/Common/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { DataService } from '../../services/DataService';
import { 
  TrendingUp, Users, Activity, DollarSign, Clock, 
  Calendar, PieChart, BarChart, LineChart 
} from 'lucide-react';

const AnalyticsDashboard = ({ role, entityId }) => {
  const [analytics, setAnalytics] = useState({
    dailyStats: {},
    trends: [],
    predictions: [],
    recommendations: []
  });
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [role, entityId, timeRange]);

  const loadAnalytics = () => {
    const data = DataService.get();
    let stats = {};

    if (role === 'hospital' && entityId) {
      stats = DataService.getHospitalStats(entityId);
      
      // Generate trends data
      const trends = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        trends.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          patients: Math.floor(Math.random() * 50) + 20,
          revenue: Math.floor(Math.random() * 50000) + 20000
        });
      }

      setAnalytics({
        dailyStats: stats,
        trends,
        predictions: [
          { metric: 'Tomorrow Patients', value: Math.floor(stats.activeConsultations * 1.1), change: '+10%' },
          { metric: 'Weekly Revenue', value: Math.floor(stats.revenueToday * 7 * 0.9), change: '-10%' },
          { metric: 'Doctor Utilization', value: '78%', change: '+5%' }
        ],
        recommendations: [
          'Increase staffing during 2-4 PM peak hours',
          'Dr. Sharma has highest patient satisfaction (98%)',
          'Neurology department has 30% lower wait times'
        ]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">AI-Powered Analytics</h2>
            <p className="text-slate-600">Real-time insights and predictions</p>
          </div>
          <div className="flex gap-2">
            {['1d', '7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              {analytics.dailyStats.activeConsultations || 0}
            </h3>
            <p className="text-sm text-slate-600">Active Patients Today</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              ₹{analytics.dailyStats.revenueToday?.toLocaleString() || 0}
            </h3>
            <p className="text-sm text-slate-600">Revenue Today</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">12 min</h3>
            <p className="text-sm text-slate-600">Avg. Wait Time</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-amber-600" />
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">94%</h3>
            <p className="text-sm text-slate-600">Patient Satisfaction</p>
          </div>
        </div>

        {/* Trends Chart */}
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Patient Trends (Last 7 Days)</h3>
          <div className="h-64 flex items-end gap-2">
            {analytics.trends.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg"
                  style={{ height: `${(day.patients / 70) * 100}%` }}
                ></div>
                <div className="text-xs text-slate-600 mt-2">{day.date}</div>
                <div className="text-sm font-bold">{day.patients}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictions & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              AI Predictions
            </h3>
            <div className="space-y-4">
              {analytics.predictions.map((pred, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-slate-700">{pred.metric}</span>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{pred.value}</div>
                    <div className={`text-sm ${pred.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {pred.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {analytics.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-sm text-slate-700">{rec}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Generate Detailed Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;