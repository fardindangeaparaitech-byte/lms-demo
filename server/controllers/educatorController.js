import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'

// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        })

        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// ✅ UPDATED: Add New Course - GOOGLE DRIVE SUPPORT (NO PDF UPLOAD)
export const addCourse = async (req, res) => {
    try {
        console.log("🔄 Course creation with Google Drive URLs started...");
        
        const { courseData } = req.body
        // ✅ SIRF IMAGE FILE CHAHIYE - PDF FILES NAHI
        const imageFile = req.files['image'] ? req.files['image'][0] : null
        const educatorId = req.auth.userId

        console.log("📦 Received files:", {
            hasImage: !!imageFile,
            allFileFields: Object.keys(req.files)
        });

        if (!imageFile) {
            console.log("❌ No thumbnail attached");
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        if (!courseData) {
            console.log("❌ No course data received");
            return res.json({ success: false, message: 'Course data is required' })
        }

        // ✅ COURSE DATA PARSE KARO
        let parsedCourseData;
        try {
            parsedCourseData = JSON.parse(courseData);
            console.log("✅ Course data parsed successfully");
        } catch (parseError) {
            console.log("❌ JSON parse error:", parseError.message);
            return res.json({ success: false, message: 'Invalid course data format' })
        }

        parsedCourseData.educator = educatorId;

        // ✅ VALIDATE BASIC FIELDS
        if (!parsedCourseData.courseTitle) {
            return res.json({ success: false, message: 'Course title is required' })
        }

        console.log("📝 Course title:", parsedCourseData.courseTitle);
        console.log("💰 Course price:", parsedCourseData.coursePrice);
        console.log("📚 Chapters count:", parsedCourseData.courseContent?.length || 0);

        // ✅ GOOGLE DRIVE URLS VALIDATE KARO
        let googleDriveUrlCount = 0;
        if (parsedCourseData.courseContent && parsedCourseData.courseContent.length > 0) {
            parsedCourseData.courseContent.forEach((chapter, chapterIndex) => {
                if (chapter.chapterContent && chapter.chapterContent.length > 0) {
                    chapter.chapterContent.forEach((task, taskIndex) => {
                        if (task.contentType === 'task' && task.taskPdfUrl) {
                            console.log(`📄 Chapter ${chapterIndex}, Task ${taskIndex}: ${task.taskPdfUrl}`);
                            googleDriveUrlCount++;
                            
                            // ✅ ENSURE LECTURE URL IS SAME AS TASK PDF URL
                            if (!task.lectureUrl) {
                                task.lectureUrl = task.taskPdfUrl;
                            }
                        }
                    });
                }
            });
        }
        
        console.log(`🔗 Total Google Drive URLs found: ${googleDriveUrlCount}`);

        // ✅ COURSE CREATE KARO (GOOGLE DRIVE URLs KE SAATH)
        console.log("📚 Creating course in database...");
        let newCourse;
        try {
            newCourse = await Course.create(parsedCourseData);
            console.log("✅ Course created successfully with ID:", newCourse._id);
        } catch (dbError) {
            console.log("❌ Database error:", dbError.message);
            return res.json({ 
                success: false, 
                message: `Database error: ${dbError.message}` 
            });
        }

        // ✅ THUMBNAIL UPLOAD KARO CLOUDINARY PAR
        console.log("🖼️ Uploading thumbnail to Cloudinary...");
        try {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path);
            newCourse.courseThumbnail = imageUpload.secure_url;
            console.log("✅ Thumbnail uploaded successfully:", imageUpload.secure_url);
        } catch (uploadError) {
            console.log("❌ Thumbnail upload error:", uploadError.message);
            // Thumbnail error hai lekin course create ho gaya hai, isliye course delete karo
            await Course.findByIdAndDelete(newCourse._id);
            return res.json({ 
                success: false, 
                message: `Thumbnail upload failed: ${uploadError.message}` 
            });
        }

        // ❌ PDF UPLOAD LOGIC REMOVE KAR DIYA - Ab Google Drive URLs direct use honge

        // ✅ FINAL COURSE SAVE KARO
        console.log("💾 Saving course with Google Drive URLs...");
        await newCourse.save();
        console.log("✅ Course saved successfully with Google Drive URLs!");

        res.json({ 
            success: true, 
            message: `Project Created Successfully with ${googleDriveUrlCount} Google Drive PDFs!`,
            courseId: newCourse._id 
        });

    } catch (error) {
        console.error("💥 UNEXPECTED ERROR in addCourse:");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // Agar course create hua hai lekin error aaya hai toh delete karo
        if (newCourse) {
            await Course.findByIdAndDelete(newCourse._id);
            console.log("🗑️ Partial course deleted due to error");
        }
        
        res.status(500).json({ 
            success: false, 
            message: `Server error: ${error.message}`,
            errorDetails: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack,
                type: error.name
            } : undefined
        });
    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({ educator })
        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// ✅ NAYA FUNCTION: Course Delete Karne Ka
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const educatorId = req.auth.userId;

        console.log("🔍 Deleting course:", courseId, "by educator:", educatorId);

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        // Check if course belongs to educator
        if (course.educator.toString() !== educatorId) {
            return res.json({ success: false, message: 'Unauthorized to delete this course' });
        }

        // Delete course from database
        await Course.findByIdAndDelete(courseId);

        console.log("✅ Course deleted successfully");

        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error("❌ Error deleting course:", error);
        res.json({ success: false, message: error.message });
    }
}

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        const courses = await Course.find({ educator });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch purchases with user and course data
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};