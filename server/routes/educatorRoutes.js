import express from 'express'
import { 
    addCourse, 
    educatorDashboardData, 
    getEducatorCourses, 
    getEnrolledStudentsData, 
    updateRoleToEducator,
    deleteCourse
} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router()

// ✅ Educator Role Update Karne Ka Route
educatorRouter.get('/update-role', updateRoleToEducator)

// ✅ UPDATED: COURSE CREATE KARNE KA ROUTE - GOOGLE DRIVE SUPPORT
// Ab sirf image upload hoga, PDF files nahi
educatorRouter.post('/add-course', upload.fields([
  { name: 'image', maxCount: 1 }        // ✅ SIRF IMAGE, PDF FILES NAHI
]), protectEducator, addCourse)

// ✅ Educator ke Courses Get Karne Ka Route
educatorRouter.get('/courses', protectEducator, getEducatorCourses)

// ✅ Educator Dashboard Data Ka Route
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)

// ✅ Enrolled Students Data Ka Route
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)

// ✅ Course Delete Karne Ka Route
educatorRouter.delete('/course/:courseId', protectEducator, deleteCourse)

export default educatorRouter;