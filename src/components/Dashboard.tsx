import React from 'react';
import { FolderOpen, Clock, Users, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Projects',
      value: '24',
      icon: FolderOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Jobs',
      value: '18',
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: 'Team Members',
      value: '12',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Completed This Month',
      value: '35',
      icon: BarChart3,
      color: 'bg-purple-500',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      text: 'Project U completed by Digital Solutions',
      type: 'success',
    },
    {
      id: 2,
      text: 'New job assigned to Naveen KR',
      type: 'info',
    },
    {
      id: 3,
      text: 'Logo Project deadline approaching',
      type: 'warning',
    },
  ];

  const teamPerformance = [
    { name: 'Ravi Coordinator', percentage: 92, color: 'bg-green-500' },
    { name: 'Digital Solutions', percentage: 88, color: 'bg-blue-500' },
    { name: 'Naveen KR', percentage: 85, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome To P5 ! Here's an overview of your projects.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-orange-500'
                }`}></div>
                <p className="text-gray-600">{activity.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Performance</h2>
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{member.name}</span>
                  <span className="text-sm font-medium text-gray-800">{member.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${member.color}`}
                    style={{ width: `${member.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;