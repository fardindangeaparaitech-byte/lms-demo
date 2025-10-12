import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {

  const { backendUrl, getToken, userType, currency } = useContext(AppContext) // ✅ userType use karo

  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse())
      } else {
        toast.success(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (userType === 'admin') { // ✅ userType check karo
      fetchEnrolledStudents()
    }
  }, [userType]) // ✅ userType pe depend karo

  return enrolledStudents ? (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className='max-w-7xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Enrolled Students</h1>
          <p className='text-gray-600'>Track all students enrolled in your Projects</p>
        </div>

        {/* Stats Summary */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          {/* Total Students */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                <span className='text-purple-600 text-xl'>👨‍🎓</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>{enrolledStudents.length}</p>
                <p className='text-gray-600'>Total Students</p>
              </div>
            </div>
          </div>

          {/* Unique Students */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <span className='text-blue-600 text-xl'>👥</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>
                  {new Set(enrolledStudents.map(item => item.student._id)).size}
                </p>
                <p className='text-gray-600'>Unique Students</p>
              </div>
            </div>
          </div>

          {/* Total Courses */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                <span className='text-green-600 text-xl'>📚</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>
                  {new Set(enrolledStudents.map(item => item.courseTitle)).size}
                </p>
                <p className='text-gray-600'>Projects Offered</p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
                <span className='text-yellow-600 text-xl'>💰</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>
                  {currency}{enrolledStudents.reduce((total, item) => total + (item.coursePrice || 0), 0)}
                </p>
                <p className='text-gray-600'>Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table - Expanded to full width */}
        <div className='bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden'>
          <div className='p-8 border-b border-gray-200'>
            <h2 className='text-2xl font-bold text-gray-900'>Student Enrollment Details</h2>
            <p className='text-gray-600 mt-2 text-lg'>Complete overview of all student enrollments across your projects</p>
          </div>
          
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Student Information</th>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Project Details</th>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Enrollment Date & Time</th>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Payment Details</th>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {enrolledStudents.map((item, index) => (
                  <tr key={index} className='hover:bg-purple-50 transition-colors duration-200 group'>
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-4'>
                        <img
                          src={item.student.imageUrl}
                          alt={item.student.name}
                          className="w-14 h-14 rounded-full border-2 border-purple-200 group-hover:border-purple-300 transition-colors"
                        />
                        <div className='min-w-0 flex-1'>
                          <p className='font-semibold text-gray-900 text-lg mb-1'>{item.student.name}</p>
                          <p className='text-gray-500 text-sm'>{item.student.email}</p>
                          <p className='text-gray-400 text-xs mt-1'>Student ID: {item.student._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='min-w-0 flex-1'>
                        <p className='font-semibold text-gray-900 text-lg mb-2'>{item.courseTitle}</p>
                        <p className='text-gray-500 text-sm line-clamp-3 leading-relaxed'>
                          {item.courseDescription?.replace(/<[^>]*>/g, '').slice(0, 120)}...
                        </p>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex flex-col'>
                        <span className='text-gray-900 font-medium text-lg mb-1'>
                          {new Date(item.purchaseDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className='text-gray-500 text-sm'>
                          {new Date(item.purchaseDate).toLocaleDateString('en-US', { 
                            weekday: 'long' 
                          })}
                        </span>
                        <span className='text-gray-400 text-xs mt-1'>
                          {new Date(item.purchaseDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex flex-col'>
                        <span className='font-semibold text-green-600 text-lg mb-1'>
                          {currency}{item.coursePrice || 0}
                        </span>
                        <span className='text-gray-500 text-sm'>One-time payment</span>
                        <span className='text-gray-400 text-xs mt-1'>Payment completed</span>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex flex-col'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 w-fit'>
                          <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
                          Active
                        </span>
                        <span className='text-gray-400 text-xs mt-2'>Enrolled successfully</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {enrolledStudents.length === 0 && (
            <div className='text-center py-20'>
              <div className='w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-purple-600 text-4xl'>👨‍🎓</span>
              </div>
              <h3 className='text-2xl font-semibold text-gray-900 mb-3'>No students enrolled yet</h3>
              <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto'>
                Students will appear here once they enroll in your courses. Promote your courses to get more enrollments!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  ) : <Loading />
};

export default StudentsEnrolled;