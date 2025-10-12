import React, { useContext, useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube';
import { useAuth } from '@clerk/clerk-react';
import Loading from '../../components/student/Loading';

const CourseDetails = () => {

  const { id } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)

  const { backendUrl, currency, userData, calculateChapterTime, calculateCourseDuration, calculateRating, calculateNoOfLectures } = useContext(AppContext)
  const { getToken } = useAuth()


  const fetchCourseData = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/course/' + id)

      if (data.success) {
        setCourseData(data.courseData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {

      toast.error(error.message)

    }

  }

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  const enrollCourse = async () => {

    try {

      if (!userData) {
        return toast.warn('Login to Enroll')
      }

      if (isAlreadyEnrolled) {
        return toast.warn('Already Enrolled')
      }

      const token = await getToken();

      const { data } = await axios.post(backendUrl + '/api/user/purchase',
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        const { session_url } = data
        window.location.replace(session_url)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [])

  useEffect(() => {

    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }

  }, [userData, courseData])

  return courseData ? (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50/80 to-blue-50/80"> {/* Lighter with opacity */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Course Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8">
                <span className="inline-block px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                  🚀 Live Project
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {courseData.courseTitle}
                </h1>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}>
                </p>

                {/* Ratings and Info */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <img 
                          key={i} 
                          src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} 
                          alt='' 
                          className='w-5 h-5' 
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{calculateRating(courseData)}</span>
                    <span className="text-purple-600">({courseData.courseRatings.length} ratings)</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">👨‍🎓</span>
                      <span>{courseData.enrolledStudents.length} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">⏱️</span>
                      <span>{calculateCourseDuration(courseData)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">📚</span>
                      <span>{calculateNoOfLectures(courseData)} lessons</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600">
                  Course by <span className="text-purple-600 font-semibold">{courseData.educator.name}</span>
                </p>
              </div>

              {/* Course Structure */}
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {courseData.courseContent.map((chapter, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-300">
                      <div
                        className="flex items-center justify-between px-6 py-4 cursor-pointer bg-gray-50 hover:bg-purple-50 transition-colors"
                        onClick={() => toggleSection(index)}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={assets.down_arrow_icon} 
                            alt="arrow icon" 
                            className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""} w-4 h-4`} 
                          />
                          <h3 className="font-semibold text-gray-900 text-lg">{chapter.chapterTitle}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{chapter.chapterContent.length} lectures</span>
                          <span>•</span>
                          <span>{calculateChapterTime(chapter)}</span>
                        </div>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`}>
                        <div className="p-4 space-y-3">
                          {chapter.chapterContent.map((lecture, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600 text-sm">▶</span>
                                </div>
                                <span className="text-gray-800">{lecture.lectureTitle}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                {lecture.isPreviewFree && (
                                  <button 
                                    onClick={() => setPlayerData({
                                      videoId: lecture.lectureUrl.split('/').pop()
                                    })}
                                    className="text-purple-600 hover:text-purple-700 font-medium text-sm px-3 py-1 rounded border border-purple-200 hover:border-purple-300 transition-colors"
                                  >
                                    Preview
                                  </button>
                                )}
                                <span className="text-gray-500 text-sm">
                                  {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Description */}
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About This Course</h3>
                <div className="rich-text text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Video Player / Thumbnail */}
                <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden mb-6">
                  {
                    playerData
                      ? <YouTube 
                          videoId={playerData.videoId} 
                          opts={{ playerVars: { autoplay: 1 } }} 
                          iframeClassName='w-full aspect-video' 
                        />
                      : <img 
                          src={courseData.courseThumbnail} 
                          alt={courseData.courseTitle} 
                          className="w-full aspect-video object-cover"
                        />
                  }
                  
                  <div className="p-6">
                    {/* Price Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-red-500 font-semibold mb-3">
                        <span>⏰</span>
                        <span>5 days left at this price!</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {currency}{courseData.coursePrice}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {courseData.discount}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <button 
                      onClick={enrollCourse} 
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        isAlreadyEnrolled 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg'
                      }`}
                    >
                      {isAlreadyEnrolled ? "🎉 Already Enrolled" : "🚀 Enroll Now"}
                    </button>

                    {/* Course Features */}
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-gray-600">
                          <span className="text-green-500">✓</span>
                          Lifetime access with free updates
                        </li>
                        <li className="flex items-center gap-3 text-gray-600">
                          <span className="text-green-500">✓</span>
                          Step-by-step project guidance
                        </li>
                        <li className="flex items-center gap-3 text-gray-600">
                          <span className="text-green-500">✓</span>
                          Downloadable resources & code
                        </li>
                        <li className="flex items-center gap-3 text-gray-600">
                          <span className="text-green-500">✓</span>
                          Quizzes & assessments
                        </li>
                        <li className="flex items-center gap-3 text-gray-600">
                          <span className="text-green-500">✓</span>
                          Certificate of completion
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Support Card */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                  <h4 className="text-lg font-semibold mb-2">Need Help?</h4>
                  <p className="text-purple-100 mb-4">Our support team is here to help you succeed</p>
                  <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
};

export default CourseDetails;