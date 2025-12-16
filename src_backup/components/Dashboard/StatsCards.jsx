import React from 'react';
import { Users, Activity, TrendingUp, DollarSign, Clock, Shield, Stethoscope, Building2 } from 'lucide-react';

const StatsCards = ({ stats, role }) => {
  const getStatsForRole = () => {
    if (role === 'patient') {
      return [
        {
          title: 'Health Score',
          value: stats.healthScore || 85,
          icon: Activity,
          color: 'bg-blue-500',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          suffix: '/100',
          trend: '+2.5%'
        },
        {
          title: 'Active Prescriptions',
          value: stats.activePrescriptions || 2,
          icon: Shield,
          color: 'bg-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: '+1'
        },
        {
          title: 'Upcoming Appointments',
          value: stats.upcomingAppointments || 1,
          icon: Users,
          color: 'bg-purple-500',
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          trend: 'Tomorrow'
        },
        {
          title: 'Medical Records',
          value: stats.medicalRecords || 12,
          icon: TrendingUp,
          color: 'bg-amber-500',
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          trend: '+3 this month'
        }
      ];
    }

    if (role === 'doctor') {
      return [
        {
          title: 'Patients in Queue',
          value: stats.patientsInQueue || 8,
          icon: Users,
          color: 'bg-blue-500',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          trend: '+2 today'
        },
        {
          title: 'Completed Today',
          value: stats.completedToday || 15,
          icon: Activity,
          color: 'bg-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: '+5%'
        },
        {
          title: 'Avg. Consultation Time',
          value: stats.avgTime || '12',
          icon: Clock,
          color: 'bg-purple-500',
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          suffix: 'min',
          trend: '-2 min'
        },
        {
          title: 'Revenue Today',
          value: stats.revenueToday || '8,500',
          icon: DollarSign,
          color: 'bg-amber-500',
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          prefix: '₹',
          trend: '+12%'
        }
      ];
    }

    if (role === 'hospital') {
      return [
        {
          title: 'Total Patients Today',
          value: stats.totalPatients || 124,
          icon: Users,
          color: 'bg-blue-500',
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          trend: '+18%'
        },
        {
          title: 'Active Doctors',
          value: stats.activeDoctors || 24,
          icon: Stethoscope,
          color: 'bg-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-green-50',
          trend: 'All present'
        },
        {
          title: 'Revenue Today',
          value: stats.revenue || '2,45,000',
          icon: DollarSign,
          color: 'bg-purple-500',
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          prefix: '₹',
          trend: '+15%'
        },
        {
          title: 'Avg. Wait Time',
          value: stats.avgWaitTime || '18',
          icon: Clock,
          color: 'bg-amber-500',
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          suffix: 'min',
          trend: '-3 min'
        }
      ];
    }

    // Default stats
    return [
      {
        title: 'Total Users',
        value: 1250,
        icon: Users,
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        trend: '+125 this month'
      },
      {
        title: 'Active Hospitals',
        value: 48,
        icon: Building2,
        color: 'bg-green-500',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50',
        trend: '+3 new'
      },
      {
        title: 'Total Consultations',
        value: '12,450',
        icon: Activity,
        color: 'bg-purple-500',
        textColor: 'text-purple-600',
        bgColor: 'bg-purple-50',
        trend: '+1,240 this month'
      },
      {
        title: 'System Health',
        value: '99.8',
        icon: Shield,
        color: 'bg-amber-500',
        textColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
        suffix: '%',
        trend: 'Optimal'
      }
    ];
  };

  const statsData = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500">{stat.title}</p>
              <div className="flex items-baseline gap-1 mt-2">
                {stat.prefix && (
                  <span className="text-2xl font-bold text-slate-800">{stat.prefix}</span>
                )}
                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                {stat.suffix && (
                  <span className="text-lg text-slate-600">{stat.suffix}</span>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'text-slate-600'}`}>
              {stat.trend}
            </span>
            <span className="text-xs text-slate-500">from yesterday</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;