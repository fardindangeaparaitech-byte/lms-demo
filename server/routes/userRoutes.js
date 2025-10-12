import express from 'express'
import { 
    addUserRating, 
    getUserCourseProgress, 
    getUserData, 
    purchaseCourse, 
    updateUserCourseProgress, 
    userEnrolledCourses,
    getUserType  // ✅ Naya function import karo
} from '../controllers/userController.js';

const userRouter = express.Router()

// Existing routes
userRouter.get('/data', getUserData)
userRouter.post('/purchase', purchaseCourse)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)

// ✅ NAYA ROUTE ADD KARO - User type get karne ke liye
userRouter.get('/type/:email', getUserType)

export default userRouter;