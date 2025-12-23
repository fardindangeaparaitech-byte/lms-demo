import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // ✅ useNavigate ADD KARO
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import YouTube from 'react-youtube';
import { useAuth } from '@clerk/clerk-react';
import Loading from '../../components/student/Loading';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ ADD KARO

  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);

  const { backendUrl, currency, userData, calculateRating, calculateNoOfLectures } = useContext(AppContext);
  const { getToken } = useAuth();

  // ✅ Fetch Course Data with Error Handling
  const fetchCourseData = async () => {
    setLoading(true);
    try {
      console.log("📚 Fetching course data for ID:", id);
      
      const { data } = await axios.get(backendUrl + '/api/course/' + id);

      if (data.success && data.courseData) {
        setCourseData(data.courseData);
        
        console.log("🎯 Full Course Data Received:", data.courseData);

      } else {
        toast.error(data.message || "Failed to fetch course data");
      }

    } catch (error) {
      console.log("💥 fetchCourseData error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // ✅ CHECK PAYMENT SUCCESS ON PAGE LOAD
  useEffect(() => {
    const checkPaymentAndRedirect = async () => {
      // Check if user just came back from payment
      const justCameFromPayment = localStorage.getItem('just_came_from_payment');
      
      if (justCameFromPayment === 'true') {
        console.log("✅ User returned from payment, checking enrollment...");
        
        try {
          const token = await getToken();
          
          // Refresh user data to check if enrolled
          const { data } = await axios.get(backendUrl + '/api/user/data', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (data.success && data.user) {
            const enrolled = data.user.enrolledCourses?.includes(id) || false;
            setIsAlreadyEnrolled(enrolled);
            
            if (enrolled) {
              toast.success('🎉 Payment successful! Course enrolled.');
              // ✅ REDIRECT TO MY-ENROLLMENTS AFTER 2 SECONDS
              setTimeout(() => {
                navigate('/my-enrollments');
              }, 2000);
            } else {
              toast.info('⏳ Please wait while we process your payment...');
            }
          }
          
        } catch (error) {
          console.error("Error checking enrollment:", error);
        }
        
        // Clear the flag
        localStorage.removeItem('just_came_from_payment');
      }
    };

    checkPaymentAndRedirect();
  }, [id, navigate, getToken, backendUrl]);

  // ✅ SIMPLIFIED ENROLL COURSE FUNCTION FOR RAZORPAY
  const enrollCourse = async () => {
    try {
      if (!userData) {
        toast.warn('Please login to enroll in this course');
        return;
      }

      if (isAlreadyEnrolled) {
        toast.warn('You are already enrolled in this course');
        navigate('/my-enrollments');
        return;
      }

      if (!courseData) {
        toast.error('Course data not available');
        return;
      }

      setEnrollLoading(true);
      const token = await getToken();

      toast.info('Redirecting to payment...');

      const { data } = await axios.post(
        backendUrl + '/api/user/purchase',
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        // ✅ SET FLAG THAT USER IS GOING TO PAYMENT
        localStorage.setItem('just_came_from_payment', 'true');
        
        console.log("💰 Redirecting to Razorpay payment...");
        window.location.href = data.session_url;
        
      } else {
        toast.error(data.message || "Enrollment failed");
      }

    } catch (error) {
      console.log("💥 enrollCourse error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrollLoading(false);
    }
  };

  // ✅ SIMPLIFIED PDF HANDLING FUNCTION - GOOGLE DRIVE SUPPORT
  const handlePDFAction = (lecture) => {
    try {
      const lectureTitle = lecture?.lectureTitle || 'Course Material';
      const pdfUrl = lecture?.taskPdfUrl || lecture?.lectureUrl;
      
      console.log("📄 Google Drive PDF Action:", {
        lectureTitle: lectureTitle,
        pdfUrl: pdfUrl,
        isGoogleDrive: pdfUrl?.includes('drive.google.com')
      });

      if (!pdfUrl) {
        toast.error('PDF not available for this lecture');
        return;
      }

      // ✅ GOOGLE DRIVE URL - DIRECT OPEN IN NEW TAB
      if (pdfUrl.includes('drive.google.com')) {
        let finalUrl = pdfUrl;
        if (pdfUrl.includes('uc?export=download')) {
          const fileIdMatch = pdfUrl.match(/[&?]id=([^&]+)/);
          if (fileIdMatch && fileIdMatch[1]) {
            finalUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
          }
        }
        
        console.log("🔗 Opening Google Drive URL:", finalUrl);
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
        
      } else {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      }

    } catch (error) {
      console.error('❌ PDF action error:', error);
      toast.error('Failed to open PDF');
    }
  };

  // ✅ Video Player Handler
  const handleVideoPreview = (lecture) => {
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

      console.log("🎬 Setting video player with ID:", videoId);
      setPlayerData({ videoId });

    } catch (error) {
      console.error('❌ Video preview error:', error);
      toast.error('Failed to load video');
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  useEffect(() => {
    if (userData && courseData) {
      const enrolled = userData.enrolledCourses?.includes(courseData._id) || false;
      setIsAlreadyEnrolled(enrolled);
    }
  }, [userData, courseData]);

  if (loading) {
    return <Loading />;
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/80 to-blue-50/80 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The requested course could not be loaded.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50/80 to-blue-50/80">
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
                  {courseData.courseTitle || 'Untitled Course'}
                </h1>
                <p 
                  className="text-xl text-gray-600 mb-6 leading-relaxed" 
                  dangerouslySetInnerHTML={{ 
                    __html: courseData.courseDescription 
                      ? courseData.courseDescription.slice(0, 200) + (courseData.courseDescription.length > 200 ? '...' : '')
                      : 'No description available' 
                  }}
                />

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
                    <span className="text-lg font-semibold text-gray-900">
                      {calculateRating(courseData) || 0}
                    </span>
                    <span className="text-purple-600">
                      ({courseData.courseRatings?.length || 0} ratings)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">👨‍🎓</span>
                      <span>{courseData.enrolledStudents?.length || 0} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">📚</span>
                      <span>{calculateNoOfLectures(courseData)} Tasks</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600">
                  Course by <span className="text-purple-600 font-semibold">
                    {courseData.educator?.name || 'Unknown Educator'}
                  </span>
                </p>
              </div>

              {/* Course Structure */}
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mt-8">
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
                                  const isPreviewFree = lecture?.isPreviewFree || false;
                                  const pdfUrl = lecture?.taskPdfUrl || lecture?.lectureUrl;
                                  const isGoogleDrive = pdfUrl?.includes('drive.google.com');
                                  
                                  return (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                          <span className="text-purple-600 text-sm">
                                            {contentType === 'task' ? '📄' : '▶'}
                                          </span>
                                        </div>
                                        <span className="text-gray-800">{lectureTitle}</span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        {isPreviewFree && (
                                          <div>
                                            {contentType === 'task' ? (
                                              <button 
                                                onClick={() => handlePDFAction(lecture)}
                                                className="text-purple-600 hover:text-purple-700 font-medium text-sm px-3 py-1 rounded border border-purple-200 hover:border-purple-300 transition-colors"
                                              >
                                                {isGoogleDrive ? 'View PDF' : 'Download PDF'}
                                              </button>
                                            ) : (
                                              <button 
                                                onClick={() => handleVideoPreview(lecture)}
                                                className="text-purple-600 hover:text-purple-700 font-medium text-sm px-3 py-1 rounded border border-purple-200 hover:border-purple-300 transition-colors"
                                              >
                                                Preview
                                              </button>
                                            )}
                                          </div>
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

              {/* Course Description */}
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About This Project</h3>
                <div 
                  className="rich-text text-gray-600 leading-relaxed" 
                  dangerouslySetInnerHTML={{ 
                    __html: courseData.courseDescription || 'No description available for this course.' 
                  }}
                />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Video Player / Thumbnail */}
                <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden mb-6">
                  {playerData ? (
                    <YouTube 
                      videoId={playerData.videoId} 
                      opts={{ 
                        playerVars: { 
                          autoplay: 1,
                          modestbranding: 1,
                          rel: 0
                        } 
                      }} 
                      iframeClassName='w-full aspect-video' 
                    />
                  ) : (
                    <img 
                      src={courseData.courseThumbnail || assets.default_thumbnail} 
                      alt={courseData.courseTitle} 
                      className="w-full aspect-video object-cover"
                      onError={(e) => {
                        e.target.src = assets.default_thumbnail;
                      }}
                    />
                  )}
                  
                  <div className="p-6">
                    {/* Price Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-red-500 font-semibold mb-3">
                        <span>⏰</span>
                        <span>5 days left at this price!</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {currency}{(courseData.coursePrice - (courseData.discount || 0) * courseData.coursePrice / 100).toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {currency}{courseData.coursePrice || 0}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {courseData.discount || 0}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <button 
                      onClick={enrollCourse} 
                      disabled={enrollLoading}
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        isAlreadyEnrolled 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : enrollLoading
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg'
                      }`}
                    >
                      {enrollLoading ? "🔄 Processing..." : 
                       isAlreadyEnrolled ? "🎉 Already Enrolled" : "🚀 Enroll Now"}
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
  );
};

export default CourseDetails;