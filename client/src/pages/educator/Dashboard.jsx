import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  console.log("🎯 DASHBOARD COMPONENT LOADED!");
  
  const { backendUrl, currency, getToken, userType } = useContext(AppContext)
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      console.log("🔄 Fetching dashboard data...");
      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/dashboard',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        console.log("✅ Dashboard data received:", data.dashboardData);
        setDashboardData(data.dashboardData)
      } else {
        console.log("❌ API failed:", data.message);
        toast.error(data.message)
      }
    } catch (error) {
      console.error("❌ Dashboard error:", error);
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = () => {
    navigate('/educator/add-course');
  }

  useEffect(() => {
    console.log("🎯 Dashboard mounted - userType:", userType);
    
    if (userType === 'admin') {
      fetchDashboardData()
    } else {
      setLoading(false)
    }
  }, [userType])

  // ✅ SAFE DATA ACCESS
  const enrolledStudents = dashboardData?.enrolledStudentsData || [];
  const totalCourses = dashboardData?.totalCourses || 0;
  const totalEarnings = dashboardData?.totalEarnings || 0;

  if (loading) {
    console.log("⏳ Showing loading...");
    return <Loading />
  }

  console.log("🎨 Rendering FULL dashboard UI");

  // ✅ APKA ORIGINAL BEAUTIFUL DASHBOARD
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6 pt-24'>
      <div className='max-w-7xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Educator Dashboard</h1>
          <p className='text-gray-600'>Welcome to your teaching dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {/* Total Enrolments Card */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                <span className='text-purple-600 text-xl'>👨‍🎓</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>{enrolledStudents.length}</p>
                <p className='text-gray-600'>Total Enrolments</p>
              </div>
            </div>
            <div className='mt-4 flex items-center gap-2 text-green-600 text-sm'>
              <span>📈</span>
              <span>Growing steadily</span>
            </div>
          </div>

          {/* Total Courses Card */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <span className='text-blue-600 text-xl'>📚</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>{totalCourses}</p>
                <p className='text-gray-600'>Total Projects</p>
              </div>
            </div>
            <div className='mt-4 flex items-center gap-2 text-blue-600 text-sm'>
              <span>🚀</span>
              <span>Active Projects</span>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                <span className='text-green-600 text-xl'>💰</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>{currency}{Math.floor(totalEarnings)}</p>
                <p className='text-gray-600'>Total Earnings</p>
              </div>
            </div>
            <div className='mt-4 flex items-center gap-2 text-green-600 text-sm'>
              <span>🎯</span>
              <span>Lifetime earnings</span>
            </div>
          </div>
        </div>

        {/* Latest Enrolments Table */}
        <div className='bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden'>
          <div className='p-6 border-b border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900'>Latest Enrolments</h2>
            <p className='text-gray-600 mt-1'>Recent students who enrolled in your Project</p>
          </div>
          
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Student</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Project Title</th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden md:table-cell'>Enrolled Date</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {enrolledStudents.map((item, index) => (
                  <tr key={index} className='hover:bg-purple-50 transition-colors duration-200'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <img
                          src={item.student?.imageUrl || assets.person_icon}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border-2 border-purple-200"
                        />
                        <div>
                          <p className='font-medium text-gray-900'>{item.student?.name || 'Unknown Student'}</p>
                          <p className='text-sm text-gray-500'>Student</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <p className='text-gray-900 font-medium'>{item.courseTitle || 'Unknown Course'}</p>
                      <p className='text-sm text-gray-500 truncate max-w-xs'>{item.courseDescription?.slice(0, 60) || 'No description available'}...</p>
                    </td>
                    <td className='px-6 py-4 text-gray-500 hidden md:table-cell'>
                      {new Date().toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {enrolledStudents.length === 0 && (
            <div className='text-center py-12'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-purple-600 text-2xl'>👥</span>
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>No enrolments yet</h3>
              <p className='text-gray-600'>Students will appear here once they enroll in your courses</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
          <div className='bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white'>
            <h3 className='text-xl font-bold mb-2'>Create New Project</h3>
            <p className='text-purple-100 mb-4'>Start building your next amazing Live course</p>
            <button 
              onClick={handleCreateCourse}
              className='bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors'
            >
              Create Project
            </button>
          </div>
          
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6'>
            <h3 className='text-xl font-bold text-gray-900 mb-2'>Analytics Overview</h3>
            <p className='text-gray-600 mb-4'>View detailed analytics and insights</p>
            <button className='bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors'>
              View Analytics
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard