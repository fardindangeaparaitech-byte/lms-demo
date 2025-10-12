import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const MyCourses = () => {

  const { backendUrl, userType, currency, getToken } = useContext(AppContext)

  const [courses, setCourses] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/courses', { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      data.success && setCourses(data.courses)
    } catch (error) {
      toast.error(error.message)
    }
  }

  // ✅ NAYA FUNCTION: Course Delete Karne Ka
  const deleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `${backendUrl}/api/educator/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success('Course deleted successfully!');
        // Remove course from state
        setCourses(courses.filter(course => course._id !== courseId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userType === 'admin') {
      fetchEducatorCourses()
    }
  }, [userType])

  return courses ? (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className='max-w-7xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>My Project's</h1>
          <p className='text-gray-600'>Manage and track your published Project's</p>
        </div>

        {/* Stats Summary */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          {/* Total Courses */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                <span className='text-purple-600 text-xl'>📚</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>{courses.length}</p>
                <p className='text-gray-600'>Total Project's</p>
              </div>
            </div>
          </div>

          {/* Total Students */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <span className='text-blue-600 text-xl'>👨‍🎓</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>
                  {courses.reduce((total, course) => total + course.enrolledStudents.length, 0)}
                </p>
                <p className='text-gray-600'>Total Students</p>
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                <span className='text-green-600 text-xl'>💰</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>
                  {currency}{Math.floor(courses.reduce((total, course) => 
                    total + (course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))
                  , 0))}
                </p>
                <p className='text-gray-600'>Total Earnings</p>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6 transition-all duration-300 hover:shadow-xl hover:border-purple-300'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
                <span className='text-yellow-600 text-xl'>⭐</span>
              </div>
              <div>
                <p className='text-3xl font-bold text-gray-900'>
                  {courses.length > 0 ? (courses.reduce((total, course) => total + (course.rating || 0), 0) / courses.length).toFixed(1) : '0.0'}
                </p>
                <p className='text-gray-600'>Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table with Delete Button */}
        <div className='bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden'>
          <div className='p-8 border-b border-gray-200'>
            <h2 className='text-2xl font-bold text-gray-900'>Project's Overview</h2>
            <p className='text-gray-600 mt-2 text-lg'>Detailed breakdown of your Project's and performance metrics</p>
          </div>
          
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Project Details</th>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Earnings</th>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Students</th>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Rating</th>
                  <th className='px-8 py-6 text-left text-base font-semibold text-gray-900'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {courses.map((course) => (
                  <tr key={course._id} className='hover:bg-purple-50 transition-colors duration-200 group'>
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-6'>
                        <img
                          src={course.courseThumbnail}
                          alt={course.courseTitle}
                          className="w-20 h-16 rounded-xl object-cover border-2 border-purple-200 group-hover:border-purple-300 transition-colors"
                        />
                        <div className='min-w-0 flex-1'>
                          <p className='font-semibold text-gray-900 text-lg mb-1 truncate'>{course.courseTitle}</p>
                          <p className='text-gray-500 text-base truncate'>{currency}{course.coursePrice} • {course.discount}% off</p>
                          <p className='text-sm text-gray-400 mt-1 truncate'>
                            {course.courseDescription?.replace(/<[^>]*>/g, '').slice(0, 80)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex flex-col'>
                        <span className='font-semibold text-green-600 text-lg'>
                          {currency}{Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}
                        </span>
                        <span className='text-gray-500 text-base'>{course.enrolledStudents.length} sales</span>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-3'>
                        <span className='font-semibold text-gray-900 text-lg'>{course.enrolledStudents.length}</span>
                        <span className='text-gray-500 text-base'>students</span>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-3'>
                        <span className='text-yellow-500 text-xl'>⭐</span>
                        <span className='font-semibold text-gray-900 text-lg'>{course.rating || 'N/A'}</span>
                      </div>
                    </td>
                    <td className='px-8 py-6'>
                      <div className='flex flex-col gap-2'>
                        {/* ✅ EDIT BUTTON */}
                        <button 
                          onClick={() => {/* Add edit functionality later */}}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        {/* ✅ DELETE BUTTON */}
                        <button 
                          onClick={() => deleteCourse(course._id, course.courseTitle)}
                          disabled={loading}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className='text-center py-20'>
              <div className='w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-purple-600 text-4xl'>📚</span>
              </div>
              <h3 className='text-2xl font-semibold text-gray-900 mb-3'>No courses published yet</h3>
              <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto'>
                Start creating your first course to share your knowledge with students
              </p>
              <button className='bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 text-lg'>
                Create Your First Course
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  ) : <Loading />
};

export default MyCourses;