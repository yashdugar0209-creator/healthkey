import React, { useState, useEffect } from 'react';
import { DataService } from '../../services/DataService';
import { AnalyticsService } from '../../services/AnalyticsService';
import { Users, Building2, Activity, Shield, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHospitals: 0,
    pendingApprovals: 0,
    activeConsultations: 0,
    revenue: 0,
    systemHealth: 100
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState({});
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = () => {
    const data = DataService.get();
    
    const totalUsers = data.users?.length || 0;
    const totalHospitals = data.hospitals?.length || 0;
    const pendingApprovals = data.doctors?.filter(d => d.status === 'pending').length || 0;
    const activeConsultations = data.consultations?.filter(c => c.status === 'waiting').length || 0;
    const revenue = data.analytics?.monthlyRevenue || 0;

    setStats({
      totalUsers,
      totalHospitals,
      pendingApprovals,
      activeConsultations,
      revenue,
      systemHealth: 100
    });

    // Recent activity
    const activity = [
      { id: 1, action: 'New hospital registration', user: 'Apollo Delhi', time: '10 min ago', status: 'pending' },
      { id: 2, action: 'Doctor registration approved', user: 'Dr. Sharma', time: '1 hour ago', status: 'approved' },
      { id: 3, action: 'Emergency access granted', user: 'Emergency Staff', time: '2 hours ago', status: 'emergency' },
      { id: 4, action: 'System backup completed', user: 'System', time: '3 hours ago', status: 'success' },
      { id: 5, action: 'Failed login attempt', user: '192.168.1.1', time: '5 hours ago', status: 'failed' },
    ];
    setRecentActivity(activity);

    // Chart data
    const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const userData = [65, 78, 90, 85, 74, 88, 95];
    const consultationData = [120, 135, 150, 145, 130, 110, 125];
    const revenueData = [45000, 52000, 61000, 58000, 49000, 42000, 55000];

    setChartData({
      users: {
        labels: chartLabels,
        datasets: [
          {
            label: 'New Users',
            data: userData,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2
          }
        ]
      },
      consultations: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Consultations',
            data: consultationData,
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 2
          }
        ]
      },
      revenue: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Revenue (₹)',
            data: revenueData,
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 2
          }
        ]
      },
      hospitals: {
        labels: ['Apollo', 'Fortis', 'Max', 'Medanta', 'Others'],
        datasets: [
          {
            label: 'Patients Distribution',
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(239, 68, 68, 0.8)'
            ]
          }
        ]
      }
    });
  };

  const chartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-600">System overview and analytics</p>
        </div>
        <div className="flex gap-2">
          {['1d', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg ${
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +12% this month
              </p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Hospitals</p>
              <p className="text-3xl font-bold text-slate-800">{stats.totalHospitals}</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                +3 new
              </p>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Pending Approvals</p>
              <p className="text-3xl font-bold text-slate-800">{stats.pendingApprovals}</p>
              <p className="text-sm text-amber-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                Needs attention
              </p>
            </div>
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">System Health</p>
              <p className="text-3xl font-bold text-slate-800">{stats.systemHealth}%</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <CheckCircle className="w-4 h-4" />
                All systems operational
              </p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-slate-800 mb-4">User Growth</h3>
          <div className="h-64">
            {chartData.users && (
              <Line
                data={chartData.users}
                options={chartOptions('Daily New Users')}
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-slate-800 mb-4">Consultation Volume</h3>
          <div className="h-64">
            {chartData.consultations && (
              <Bar
                data={chartData.consultations}
                options={chartOptions('Daily Consultations')}
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-slate-800 mb-4">Revenue Trend</h3>
          <div className="h-64">
            {chartData.revenue && (
              <Line
                data={chartData.revenue}
                options={chartOptions('Daily Revenue (₹)')}
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-slate-800 mb-4">Hospital Distribution</h3>
          <div className="h-64">
            {chartData.hospitals && (
              <Pie
                data={chartData.hospitals}
                options={chartOptions('Patients by Hospital')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'approved' ? 'bg-green-100 text-green-600' :
                  activity.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                  activity.status === 'emergency' ? 'bg-red-100 text-red-600' :
                  activity.status === 'success' ? 'bg-blue-100 text-blue-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {activity.status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                   activity.status === 'pending' ? <AlertCircle className="w-4 h-4" /> :
                   activity.status === 'emergency' ? <AlertCircle className="w-4 h-4" /> :
                   <Activity className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{activity.action}</p>
                  <p className="text-sm text-slate-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                activity.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                activity.status === 'emergency' ? 'bg-red-100 text-red-700' :
                activity.status === 'success' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h4 className="font-bold text-red-800 mb-2">Critical Alerts</h4>
              <p className="text-sm text-red-700 mb-4">3 failed login attempts detected</p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Investigate
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
            <div>
              <h4 className="font-bold text-amber-800 mb-2">Pending Actions</h4>
              <p className="text-sm text-amber-700 mb-4">{stats.pendingApprovals} approvals pending</p>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
                Review All
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Activity className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-bold text-blue-800 mb-2">System Health</h4>
              <p className="text-sm text-blue-700 mb-4">All systems operational</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;