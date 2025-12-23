import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';

const MyEnrollments = () => {

    const { userData, enrolledCourses, fetchUserEnrolledCourses, navigate, backendUrl, getToken, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext)

    const [progressArray, setProgressData] = useState([])
    const [loading, setLoading] = useState(true)
    const [forceRefresh, setForceRefresh] = useState(0)

    console.log("📊 MyEnrollments - enrolledCourses:", enrolledCourses.length);
    console.log("👤 MyEnrollments - userData:", userData);

    const getCourseProgress = async () => {
        try {
            const token = await getToken();

            const tempProgressArray = await Promise.all(
                enrolledCourses.map(async (course) => {
                    const { data } = await axios.post(
                        `${backendUrl}/api/user/get-course-progress`,
                        { courseId: course._id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    let totalLectures = calculateNoOfLectures(course);
                    const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
                    return { totalLectures, lectureCompleted };
                })
            );

            setProgressData(tempProgressArray);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ REFRESH ENROLLMENTS WHEN PAGE LOADS
    useEffect(() => {
        console.log("🔄 MyEnrollments mounted, fetching enrolled courses...");
        if (userData) {
            fetchUserEnrolledCourses();
        }
    }, [userData, forceRefresh]);

    useEffect(() => {
        if (enrolledCourses.length > 0) {
            console.log("📈 Fetching progress for", enrolledCourses.length, "courses");
            getCourseProgress();
        } else {
            console.log("ℹ️ No courses to show progress for");
            setLoading(false);
        }
    }, [enrolledCourses])

    // ✅ MANUAL REFRESH BUTTON FUNCTION
    const handleRefresh = () => {
        console.log("🔄 Manual refresh triggered");
        setLoading(true);
        setForceRefresh(prev => prev + 1);
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="relative md:px-8 px-4 pt-28 pb-16 max-w-7xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-3">My Enrollments</h1>
                                <p className="text-gray-600 text-lg">
                                    <span 
                                        onClick={() => navigate('/')} 
                                        className="text-purple-600 cursor-pointer hover:text-purple-700 font-medium transition-colors duration-200"
                                    >
                                        Home
                                    </span> 
                                    <span className="text-gray-400 mx-2">/</span> 
                                    <span className="text-gray-800 font-medium">My Enrollments</span>
                                </p>
                            </div>
                            {/* ✅ REFRESH BUTTON */}
                            <button 
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center gap-2 bg-white border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className={loading ? "animate-spin" : ""}>🔄</span>
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Enrollments Count */}
                    <div className="mb-8">
                        <p className="text-gray-600">
                            <span className="font-semibold text-purple-600">{enrolledCourses.length}</span> 
                            {enrolledCourses.length === 1 ? ' Project enrolled' : ' Projects enrolled'}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    ) : enrolledCourses.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-purple-600 text-3xl">📚</span>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No enrollments yet</h3>
                            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                                You haven't enrolled in any Project yet. Start your learning journey today!
                            </p>
                            <button 
                                onClick={() => navigate('/course-list')}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
                            >
                                Browse Projects
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {enrolledCourses.map((course, index) => {
                                const progress = progressArray[index] 
                                    ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures 
                                    : 0;
                                const isCompleted = progress === 100;

                                return (
                                    <div 
                                        key={index} 
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300 overflow-hidden"
                                    >
                                        {/* Course Thumbnail */}
                                        <div className="h-48 bg-gray-200 overflow-hidden">
                                            <img 
                                                src={course.courseThumbnail} 
                                                alt={course.courseTitle}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                                onClick={() => navigate('/player/' + course._id)}
                                            />
                                        </div>

                                        {/* Course Content */}
                                        <div className="p-6">
                                            {/* Course Title */}
                                            <h3 
                                                className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors duration-200"
                                                onClick={() => navigate('/player/' + course._id)}
                                            >
                                                {course.courseTitle}
                                            </h3>

                                            {/* Progress Section */}
                                            <div className="space-y-4">
                                                {/* Progress Bar */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Progress</span>
                                                        <span className="text-sm font-semibold text-purple-600">
                                                            {Math.round(progress)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div 
                                                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Course Details */}
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    {/* <div className="flex items-center gap-2">
                                                        <span className="text-purple-500">⏱️</span>
                                                        <span>{calculateCourseDuration(course)}</span>
                                                    </div> */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-purple-500">📺</span>
                                                        <span>
                                                            {progressArray[index] ? `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}` : '0/0'} lectures
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <button 
                                                    onClick={() => navigate('/player/' + course._id)}
                                                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                                                        isCompleted 
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg' 
                                                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                                                    }`}
                                                >
                                                    {isCompleted ? 'Completed - Review' : 'Continue Learning'}
                                                </button>

                                                {/* Completion Badge */}
                                                {isCompleted && (
                                                    <div className="flex justify-center">
                                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                            <span>🎉</span>
                                                            Course Completed
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default MyEnrollments