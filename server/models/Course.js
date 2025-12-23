import mongoose from 'mongoose';

// Common content schema that supports both lectures and tasks
const contentSchema = new mongoose.Schema({
    // Common fields
    contentId: { type: String, required: true },
    contentTitle: { type: String, required: true },
    contentType: { 
        type: String, 
        enum: ['lecture', 'task'], 
        default: 'task',
        required: true 
    },
    contentOrder: { type: Number, required: true },
    isPreviewFree: { type: Boolean, required: true },
    
    // Lecture specific fields (optional for tasks)
    lectureDuration: { 
        type: Number, 
        required: function() { return this.contentType === 'lecture'; } 
    },
    lectureUrl: { 
        type: String, 
        required: function() { return this.contentType === 'lecture'; } 
    },
    
    // Task specific fields (optional for lectures)
    taskDescription: { 
        type: String, 
        required: function() { return this.contentType === 'task'; } 
    },
    taskPdfUrl: { 
        type: String, 
        required: function() { return this.contentType === 'task'; } 
    }
}, { _id: false }); 

const chapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [contentSchema] // Use the new content schema here
}, { _id: false });

const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    courseContent: [chapterSchema], // Use the chapter schema here
    educator: {
        type: String,
        ref: 'User',
        required: true
    },
    courseRatings: [
        {
            userId: { type: String },
            rating: { type: Number, min: 1, max: 5 }
        }
    ],
    enrolledStudents: [
        {
            type: String,
            ref: 'User'
        }
    ],
}, { timestamps: true, minimize: false });

const Course = mongoose.model('Course', courseSchema);

export default Course;