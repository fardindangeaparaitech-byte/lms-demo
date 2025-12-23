import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = "http://localhost:5000";
    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()
    const { getToken } = useAuth()
    const { user } = useUser()

    const [showLogin, setShowLogin] = useState(false)
    const [isEducator, setIsEducator] = useState(false)
    const [allCourses, setAllCourses] = useState([])
    const [userData, setUserData] = useState(null)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userType, setUserType] = useState('student')
    const [loading, setLoading] = useState(false)

    // ✅ Debug state changes
    useEffect(() => {
        console.log("🔄 userType changed to:", userType);
        setIsEducator(userType === 'educator');
    }, [userType]);

    useEffect(() => {
        console.log("🔄 userData changed:", userData);
    }, [userData]);

    useEffect(() => {
        console.log("🔄 enrolledCourses changed, count:", enrolledCourses.length);
        console.log("📚 Current enrolled courses:", enrolledCourses);
    }, [enrolledCourses]);

    // ✅ IMPROVED: Get User Type from Backend with Error Handling
    const fetchUserType = async (userEmail) => {
        if (!userEmail) {
            console.log("❌ No email provided for user type fetch");
            setUserType('student');
            return;
        }

        try {
            console.log("🔍 Fetching user type for:", userEmail);
            const response = await axios.get(`${backendUrl}/api/user/type/${userEmail}`);
            console.log("🎯 UserType API Response:", response.data);
            
            if (response.data.success) {
                const fetchedUserType = response.data.userType || 'student';
                console.log("✅ Setting userType to:", fetchedUserType);
                setUserType(fetchedUserType);
                setIsEducator(fetchedUserType === 'educator');
            } else {
                console.log("❌ UserType API failed, defaulting to student");
                setUserType('student');
                setIsEducator(false);
            }
        } catch (error) {
            console.log("🔥 Error fetching userType:", error.response?.data || error.message);
            setUserType('student');
            setIsEducator(false);
        }
    };

    // ✅ IMPROVED: Fetch All Courses with Loading State
    const fetchAllCourses = async () => {
        setLoading(true);
        try {
            console.log("📚 Fetching all courses...");
            const { data } = await axios.get(backendUrl + '/api/course/all');
            
            if (data.success) {
                console.log("✅ Courses fetched:", data.courses?.length || 0);
                setAllCourses(data.courses || [])
            } else {
                console.log("❌ Courses fetch failed:", data.message);
                toast.error(data.message);
                setAllCourses([]);
            }
        } catch (error) {
            console.log("💥 fetchAllCourses error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || error.message);
            setAllCourses([]);
        } finally {
            setLoading(false);
        }
    }

    // ✅ IMPROVED: Fetch UserData with Better Error Handling
    const fetchUserData = async () => {
        setLoading(true);
        try {
            console.log("🔄 fetchUserData started");
            
            const token = await getToken();
            if (!token) {
                console.log("❌ No token available for user data");
                setLoading(false);
                return;
            }

            console.log("🔑 Token received for user data");

            const { data } = await axios.get(backendUrl + '/api/user/data', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            });

            console.log("📊 UserData API Response:", data);

            if (data.success && data.user) {
                setUserData(data.user);
                console.log("👤 User data set:", data.user.email);
                
                // ✅ User type fetch karo after user data is set
                await fetchUserType(data.user.email);
            } else {
                console.log("❌ UserData API failed:", data.message);
                toast.error(data.message || "Failed to fetch user data");
                setUserData(null);
            }

        } catch (error) {
            console.log("💥 fetchUserData error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to fetch user data");
            setUserData(null);
        } finally {
            setLoading(false);
        }
    }

    // ✅ IMPROVED: Fetch User Enrolled Courses - WITH BETTER DEBUGGING
    const fetchUserEnrolledCourses = async () => {
        if (!user) {
            console.log("❌ No user logged in for enrolled courses");
            setEnrolledCourses([]);
            return;
        }

        setLoading(true);
        try {
            console.log("🔄 fetchUserEnrolledCourses started for user:", user.id);
            
            const token = await getToken();
            if (!token) {
                console.log("❌ No token available for enrolled courses");
                setEnrolledCourses([]);
                return;
            }

            console.log("🔑 Token received for enrolled courses");
            
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("📦 Enrolled Courses API Response:", data);

            if (data.success) {
                const courses = data.enrolledCourses || [];
                console.log("✅ Enrolled courses fetched:", courses.length);
                
                if (courses.length > 0) {
                    console.log("📚 Course details:");
                    courses.forEach((course, index) => {
                        console.log(`  ${index + 1}. ${course.courseTitle} (${course._id})`);
                    });
                } else {
                    console.log("ℹ️ No enrolled courses found");
                }
                
                setEnrolledCourses(courses.reverse());
            } else {
                console.log("❌ Enrolled courses API failed:", data.message);
                toast.error(data.message || "Failed to fetch enrolled courses");
                setEnrolledCourses([]);
            }

        } catch (error) {
            console.log("💥 fetchUserEnrolledCourses error:", error);
            console.log("Error details:", error.response?.data);
            
            // Don't show toast for 404 or no enrolled courses
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || "Failed to fetch enrolled courses");
            }
            setEnrolledCourses([]);
        } finally {
            setLoading(false);
        }
    }

    // ✅ IMPROVED: Sequential Data Fetching
    const fetchAllUserData = async () => {
        if (!user) {
            console.log("❌ No user available for data fetch");
            return;
        }

        setLoading(true);
        try {
            console.log("🚀 Starting sequential user data fetch...");
            
            // Step 1: Fetch basic user data
            await fetchUserData();
            
            // Step 2: Only fetch enrolled courses if user data was successfully fetched
            if (userData) {
                await fetchUserEnrolledCourses();
            }
            
            console.log("✅ All user data fetched successfully");
        } catch (error) {
            console.log("💥 fetchAllUserData error:", error);
        } finally {
            setLoading(false);
        }
    }

    // Function to Calculate Course Chapter Time
    const calculateChapterTime = (chapter) => {
        if (!chapter || !chapter.chapterContent) return "0m";
        
        let time = 0;
        chapter.chapterContent.forEach((lecture) => {
            time += lecture.lectureDuration || 0;
        });
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    // Function to Calculate Course Duration
    const calculateCourseDuration = (course) => {
        if (!course || !course.courseContent) return "0m";
        
        let time = 0;
        course.courseContent.forEach((chapter) => {
            if (chapter.chapterContent) {
                chapter.chapterContent.forEach((lecture) => {
                    time += lecture.lectureDuration || 0;
                });
            }
        });
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    // Function to Calculate Course Rating
    const calculateRating = (course) => {
        if (!course || !course.courseRatings || course.courseRatings.length === 0) {
            return 0;
        }
        
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating || 0;
        });
        return Math.floor(totalRating / course.courseRatings.length);
    }

    // Function to Calculate Number of Lectures
    const calculateNoOfLectures = (course) => {
        if (!course || !course.courseContent) return 0;
        
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    // ✅ IMPROVED: Initial data fetch
    useEffect(() => {
        fetchAllCourses();
    }, []);

    // ✅ IMPROVED: User-based data fetching with dependencies
    useEffect(() => {
        console.log("👤 User state changed:", user ? "Logged in" : "Logged out");
        
        if (user) {
            console.log("📧 User email:", user.primaryEmailAddress?.emailAddress);
            fetchAllUserData();
        } else {
            console.log("🚪 User logged out, clearing data");
            setUserData(null);
            setEnrolledCourses([]);
            setUserType('student');
            setIsEducator(false);
        }
    }, [user]);

    const value = {
        showLogin, setShowLogin,
        backendUrl, currency, navigate,
        userData, setUserData, getToken,
        allCourses, fetchAllCourses,
        enrolledCourses, fetchUserEnrolledCourses,
        calculateChapterTime, calculateCourseDuration,
        calculateRating, calculateNoOfLectures,
        isEducator, setIsEducator,
        userType, setUserType,
        loading, setLoading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}