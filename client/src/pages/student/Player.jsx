import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import YouTube from 'react-youtube';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Rating from '../../components/student/Rating';
import Footer from '../../components/student/Footer';
import Loading from '../../components/student/Loading';

const Player = ({ }) => {

  const { enrolledCourses, backendUrl, getToken, calculateChapterTime, userData, fetchUserEnrolledCourses } = useContext(AppContext)

  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course)
        course.courseRatings.map((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating)
          }
        })
      }
    })
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // ✅ PDF HANDLING FUNCTION
  const handlePDFAction = (lecture) => {
    try {
      const pdfUrl = lecture?.taskPdfUrl || lecture?.lectureUrl;
      
      if (!pdfUrl) {
        toast.error('PDF not available for this lecture');
        return;
      }

      if (pdfUrl.includes('drive.google.com')) {
        let finalUrl = pdfUrl;
        if (pdfUrl.includes('uc?export=download')) {
          const fileIdMatch = pdfUrl.match(/[&?]id=([^&]+)/);
          if (fileIdMatch && fileIdMatch[1]) {
            finalUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
          }
        }
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      }

    } catch (error) {
      console.error('❌ PDF action error:', error);
      toast.error('Failed to open PDF');
    }
  };

  // ✅ VIDEO PLAYER HANDLER
  const handleVideoPlay = (lecture, chapterIndex, lectureIndex) => {
    try {
      const videoUrl = lecture?.lectureUrl;
      if (!videoUrl) {
        toast.error('Video URL not available');
        return;
      }

      let videoId = '';
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const urlObj = new URL(videoUrl);
        videoId = urlObj.searchParams.get('v') || videoUrl.split('/').pop();
      }

      if (!videoId) {
        window.open(videoUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      setPlayerData({ 
        videoId, 
        lectureTitle: lecture.lectureTitle,
        chapter: chapterIndex + 1, 
        lecture: lectureIndex + 1,
        lectureId: lecture.contentId 
      });

    } catch (error) {
      console.error('❌ Video preview error:', error);
      toast.error('Failed to load video');
    }
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData()
    }
  }, [enrolledCourses])

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/update-course-progress',
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Task marked as completed! ✅')
        getCourseProgress()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/get-course-progress',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setProgressData(data.progressData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRate = async (rating) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/add-rating',
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getCourseProgress()
  }, [])

  return courseData ? (
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36' >
      
      {/* ✅ UPDATED COURSE STRUCTURE SECTION - NEW THEME */}
      <div className="text-gray-800" >
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseData.courseTitle}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <span className="text-lg">📚</span>
              <span>
                {progressData ? `${progressData.lectureCompleted?.length || 0} of ${courseData.courseContent?.reduce((total, chapter) => total + (chapter.chapterContent?.length || 0), 0)} tasks completed` : 'Loading progress...'}
              </span>
            </div>
          </div>
        </div>

        {/* Course Structure */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Curriculum</h2>
          <div className="space-y-4">
            {courseData.courseContent && courseData.courseContent.length > 0 ? (
              courseData.courseContent.map((chapter, index) => {
                const chapterTitle = chapter?.chapterTitle || `Chapter ${index + 1}`;
                const chapterContent = chapter?.chapterContent || [];
                
                return (
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
                        <h3 className="font-semibold text-gray-900 text-lg">{chapterTitle}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{chapterContent.length} Tasks</span>
                      </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`}>
                      <div className="p-4 space-y-3">
                        {chapterContent.length > 0 ? (
                          chapterContent.map((lecture, i) => {
                            const lectureTitle = lecture?.lectureTitle || `Task ${i + 1}`;
                            const contentType = lecture?.contentType || 'task';
                            const isCompleted = progressData?.lectureCompleted?.includes(lecture.contentId);
                            
                            return (
                              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 text-sm">
                                      {contentType === 'task' ? '📄' : '▶'}
                                    </span>
                                  </div>
                                  <span className={`text-gray-800 ${isCompleted ? ' text-green-600' : ''}`}>
                                    {lectureTitle}
                                    {isCompleted && <span className="ml-2 text-green-500">✓</span>}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  {/* ✅ MARK COMPLETE BUTTON - FOR ALL TASKS */}
                                  {!isCompleted && (
                                    <button 
                                      onClick={() => markLectureAsCompleted(lecture.contentId)}
                                      className="text-green-600 hover:text-green-700 font-medium text-sm px-3 py-1 rounded border border-green-200 hover:border-green-300 transition-colors"
                                    >
                                      Mark Complete
                                    </button>
                                  )}
                                  
                                  {contentType === 'task' ? (
                                    <button 
                                      onClick={() => handlePDFAction(lecture)}
                                      className="text-purple-600 hover:text-purple-700 font-medium text-sm px-3 py-1 rounded border border-purple-200 hover:border-purple-300 transition-colors"
                                    >
                                      View PDF
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => handleVideoPlay(lecture, index, i)}
                                      className="text-purple-600 hover:text-purple-700 font-medium text-sm px-3 py-1 rounded border border-purple-200 hover:border-purple-300 transition-colors"
                                    >
                                      Watch
                                    </button>
                                  )}
                                  <span className="text-gray-500 text-sm">
                                    {contentType === 'task' ? 'PDF Task' : 'Video'}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center text-gray-500 py-4">
                            No tasks available in this chapter
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-8">
                No course content available yet.
              </div>
            )}
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">Rate this Course:</h3>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

      </div>

      {/* ✅ UPDATED VIDEO PLAYER SECTION - FULL SIZE IMAGE WITH ROUNDED CORNERS */}
      <div className='md:mt-10'>
        {
          playerData
            ? (
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
                <YouTube 
                  iframeClassName='w-full aspect-video' 
                  videoId={playerData.videoId} 
                  opts={{ 
                    playerVars: { 
                      autoplay: 1,
                      modestbranding: 1,
                      rel: 0
                    } 
                  }} 
                />
                <div className='flex justify-between items-center p-6'>
                  <p className='text-xl font-semibold text-gray-900'>
                    {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                  </p>
                  <button 
                    onClick={() => markLectureAsCompleted(playerData.lectureId)} 
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      progressData && progressData.lectureCompleted.includes(playerData.lectureId) 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed ✓' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            )
            : (
              // ✅ UPDATED: FULL SIZE IMAGE WITH ROUNDED CORNERS
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden h-full">
                <img 
                  src={courseData ? courseData.courseThumbnail : ''} 
                  alt={courseData?.courseTitle} 
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    e.target.src = assets.default_thumbnail;
                  }}
                />
              </div>
            )
        }
      </div>
    </div>
    <Footer />
    </>
  ) : <Loading />
}

export default Player