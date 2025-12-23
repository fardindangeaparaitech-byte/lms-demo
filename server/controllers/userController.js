import Course from "../models/Course.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"

// Get User Data
export const getUserData = async (req, res) => {
    try {

        const userId = req.auth.userId

        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// ✅ NAYA FUNCTION: Get User Type - DEBUG VERSION
export const getUserType = async (req, res) => {
    try {
        const userEmail = req.params.email;
        
        console.log("🔍 Searching user with email:", userEmail);
        
        // ✅ TEMPORARY HARDCODE FIX
        if (userEmail === "fardindange.aparaitech@gmail.com") {
            console.log("🎯 Hardcoded admin user detected");
            return res.json({ 
                success: true, 
                userType: "admin" 
            });
        }
        
        // MongoDB se user find karo - Case insensitive search
        const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${userEmail}$`, 'i') } 
        });
        
        console.log("📊 Found user:", user ? "Yes" : "No");
        
        if (user) {
            console.log("🎯 UserType from DB:", user.userType);
            res.json({ 
                success: true, 
                userType: user.userType || 'student' 
            });
        } else {
            console.log("❌ User not found in database");
            res.json({ 
                success: true, 
                userType: 'student' // Default student
            });
        }
    } catch (error) {
        console.error('🔥 Error in getUserType:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// ✅ UPDATED: Purchase Course - WITH RAZORPAY LINK
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.auth.userId

        console.log("💰 Purchase request:", { courseId, userId });

        const courseData = await Course.findById(courseId)
        const userData = await User.findById(userId)

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found' })
        }

        // ✅ CHECK IF ALREADY ENROLLED
        if (userData.enrolledCourses.includes(courseId)) {
            return res.json({ 
                success: false, 
                message: 'You are already enrolled in this course' 
            });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
            status: 'completed'
        }

        const newPurchase = await Purchase.create(purchaseData)

        // ✅ IMMEDIATELY ENROLL USER (Payment se pehle hi)
        userData.enrolledCourses.push(courseId);
        await userData.save();

        // ✅ ADD USER TO COURSE'S ENROLLED STUDENTS
        courseData.enrolledStudents.push(userId);
        await courseData.save();

        console.log("✅ User enrolled successfully:", { 
            userId, 
            courseId: courseData._id,
            courseTitle: courseData.courseTitle,
            enrolledCoursesCount: userData.enrolledCourses.length
        });

        // ✅ RAZORPAY PAYMENT LINK
        const razorpayPaymentLink = "https://rzp.io/l/8SjZQ5sW";

        res.json({ 
            success: true, 
            session_url: razorpayPaymentLink,
            message: 'Redirecting to Razorpay payment...'
        });

    } catch (error) {
        console.error("💥 Purchase course error:", error);
        res.json({ success: false, message: error.message });
    }
}

// ✅ UPDATED: Users Enrolled Courses With Lecture Links - BETTER ERROR HANDLING
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;

        console.log("🔍 Fetching enrolled courses for user:", userId);

        const userData = await User.findById(userId).populate('enrolledCourses');

        if (!userData) {
            console.log("❌ User not found");
            return res.json({ success: false, message: 'User not found' });
        }

        console.log("✅ Found enrolled courses:", userData.enrolledCourses.length);

        res.json({ 
            success: true, 
            enrolledCourses: userData.enrolledCourses 
        });

    } catch (error) {
        console.error("💥 Error in userEnrolledCourses:", error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
}

// ✅ NEW FUNCTION: Get User Enrolled Courses - ALTERNATIVE VERSION
export const getUserEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        
        console.log("🔍 Fetching enrolled courses for user (alternative):", userId);

        // Find user with enrolled courses populated
        const user = await User.findById(userId).populate('enrolledCourses');
        
        if (!user) {
            console.log("❌ User not found");
            return res.json({ success: false, message: 'User not found' });
        }

        console.log("✅ Found user with enrolled courses:", user.enrolledCourses.length);

        res.json({ 
            success: true, 
            enrolledCourses: user.enrolledCourses 
        });

    } catch (error) {
        console.error("💥 Error in getUserEnrolledCourses:", error);
        res.json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {

    try {

        const userId = req.auth.userId

        const { courseId, lectureId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        if (progressData) {

            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' })
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()

        } else {

            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })

        }

        res.json({ success: true, message: 'Progress Updated' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {

    try {

        const userId = req.auth.userId

        const { courseId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        res.json({ success: true, progressData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add User Ratings to Course
export const addUserRating = async (req, res) => {

    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    // Validate inputs
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'InValid Details' });
    }

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased this course.' });
        }

        // Check is user already rated
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update the existing rating
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        return res.json({ success: true, message: 'Rating added' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};