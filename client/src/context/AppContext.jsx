import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = "http://localhost:5000"; // ✅ HARCODED FOR TESTING
    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()
    const { getToken } = useAuth()
    const { user } = useUser()

    const [showLogin, setShowLogin] = useState(false)
    const [isEducator,setIsEducator] = useState(false)
    const [allCourses, setAllCourses] = useState([])
    const [userData, setUserData] = useState(null)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userType, setUserType] = useState('student')

    // ✅ Debug state changes
    useEffect(() => {
        console.log("🔄 userType changed to:", userType);
    }, [userType]);

    useEffect(() => {
        console.log("🔄 userData changed:", userData?.email);
    }, [userData]);

    // ✅ NAYA FUNCTION: Get User Type from Backend
    const fetchUserType = async (userEmail) => {
        try {
            console.log("🔍 Fetching user type for:", userEmail);
            const response = await axios.get(`${backendUrl}/api/user/type/${userEmail}`);
            console.log("🎯 UserType API Response:", response.data);
            
            if (response.data.success) {
                console.log("✅ Setting userType to:", response.data.userType);
                setUserType(response.data.userType);
            } else {
                console.log("❌ UserType API failed");
                setUserType('student');
            }
        } catch (error) {
            console.log("🔥 Error fetching userType:", error);
            setUserType('student');
        }
    };

    // Fetch All Courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all');
            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Fetch UserData - UPDATED WITH DEBUG
    const fetchUserData = async () => {
        try {
            console.log("🔄 fetchUserData started");
            
            const token = await getToken();
            console.log("🔑 Token received");

            const { data } = await axios.get(backendUrl + '/api/user/data',
                { headers: { Authorization: `Bearer ${token}` } })

            console.log("📊 UserData API Response:", data);

            if (data.success) {
                setUserData(data.user)
                console.log("👤 User data set:", data.user?.email);
                
                // ✅ User type fetch karo
                if (data.user && data.user.email) {
                    await fetchUserType(data.user.email);
                }
            } else {
                console.log("❌ UserData API failed");
                toast.error(data.message)
            }

        } catch (error) {
            console.log("💥 fetchUserData error:", error);
            toast.error(error.message)
        }
    }

    // Fetch User Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        const token = await getToken();
        const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses',
            { headers: { Authorization: `Bearer ${token}` } })
        if (data.success) {
            setEnrolledCourses(data.enrolledCourses.reverse())
        } else (
            toast.error(data.message)
        )
    }

    // Function to Calculate Course Chapter Time
    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    // Function to Calculate Course Duration
    const calculateCourseDuration = (course) => {
        let time = 0
        course.courseContent.map(
            (chapter) => chapter.chapterContent.map(
                (lecture) => time += lecture.lectureDuration
            )
        )
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])

    // Fetch User's Data if User is Logged In
    useEffect(() => {
        if (user) {
            console.log("👤 User detected, fetching data...");
            fetchUserData()
            fetchUserEnrolledCourses()
        } else {
            console.log("👤 No user logged in");
            setUserType('student');
        }
    }, [user])

    const value = {
        showLogin, setShowLogin,
        backendUrl, currency, navigate,
        userData, setUserData, getToken,
        allCourses, fetchAllCourses,
        enrolledCourses, fetchUserEnrolledCourses,
        calculateChapterTime, calculateCourseDuration,
        calculateRating, calculateNoOfLectures,
        isEducator,setIsEducator,
        userType, setUserType
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}