import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios'
import { AppContext } from '../../context/AppContext';
import 'quill/dist/quill.snow.css';

const AddCourse = () => {

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken } = useContext(AppContext)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [taskDetails, setTaskDetails] = useState({
    taskTitle: '',
    taskDescription: '',
    googleDriveUrl: '', // ✅ CHANGE: PDF file ki jagah Google Drive URL
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Module Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleTask = (action, chapterId, taskIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(taskIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addTask = () => {
    // ✅ UPDATED VALIDATION - Google Drive URL check karo
    if (!taskDetails.taskTitle || !taskDetails.taskDescription || !taskDetails.googleDriveUrl) {
      toast.error('Please fill all task details and add Google Drive URL');
      return;
    }

    // ✅ Google Drive URL format validate karo
    if (!isValidGoogleDriveUrl(taskDetails.googleDriveUrl)) {
      toast.error('Please enter a valid Google Drive URL');
      return;
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newTask = {
            ...taskDetails,
            taskOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].taskOrder + 1 : 1,
            taskId: uniqid(),
            // ✅ GOOGLE DRIVE URL USE KARO
            taskPdfUrl: convertToDirectUrl(taskDetails.googleDriveUrl), // Direct download URL
            // ✅ CONTENT TYPE BHI ADD KARO
            contentType: 'task'
          };
          chapter.chapterContent.push(newTask);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setTaskDetails({
      taskTitle: '',
      taskDescription: '',
      googleDriveUrl: '', // ✅ RESET TO EMPTY STRING
      isPreviewFree: false,
    });
    toast.success('Task added successfully!');
  };

  // ✅ GOOGLE DRIVE URL VALIDATION FUNCTION
  const isValidGoogleDriveUrl = (url) => {
    return url.includes('drive.google.com') && (url.includes('/file/d/') || url.includes('uc?id='));
  };

  // ✅ GOOGLE DRIVE URL TO DIRECT DOWNLOAD URL CONVERTER
  const convertToDirectUrl = (url) => {
    try {
      // Agar already direct URL hai
      if (url.includes('uc?export=download')) {
        return url;
      }
      
      // Agar view URL hai toh direct download URL mein convert karo
      if (url.includes('/file/d/')) {
        const fileIdMatch = url.match(/\/file\/d\/([^\/]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
        }
      }
      
      return url; // Original URL return karo agar convert nahi ho paya
    } catch (error) {
      console.error('URL conversion error:', error);
      return url;
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!image) {
        toast.error('Please select a project thumbnail');
        return;
      }

      if (chapters.length === 0) {
        toast.error('Please add at least one module');
        return;
      }

      // ✅ COURSE DATA KO BACKEND COMPATIBLE BANAYE
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters.map(chapter => ({
          ...chapter,
          chapterContent: chapter.chapterContent.map(task => ({
            // ✅ TASK DATA KO BACKEND SCHEMA KE ACCORED MAPPING KARO
            contentId: task.taskId,
            contentTitle: task.taskTitle,
            contentType: 'task',
            contentOrder: task.taskOrder,
            isPreviewFree: task.isPreviewFree,
            taskDescription: task.taskDescription,
            taskPdfUrl: task.taskPdfUrl, // ✅ Ye ab Google Drive URL hoga
            // ✅ LECTURE FIELDS (BACKWARD COMPATIBILITY)
            lectureTitle: task.taskTitle,
            lectureDuration: 0,
            lectureUrl: task.taskPdfUrl, // ✅ Same Google Drive URL
            lectureOrder: task.taskOrder,
            lectureId: task.taskId
          }))
        })),
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      // ❌ PDF FILES UPLOAD REMOVE KAR DIYA - Ab sirf Google Drive URLs hain
      console.log(`📄 Google Drive URLs being sent: ${chapters.reduce((count, chapter) => count + chapter.chapterContent.length, 0)}`);

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      )

      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML = ""
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error("❌ Error in course creation:", error);
      toast.error(error.response?.data?.message || error.message)
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ],
        },
      });
    }
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create New Live Project</h1>
          <p className='text-gray-600'>Build your amazing project with Google Drive PDF links</p>
        </div>

        <form onSubmit={handleSubmit} className='bg-white rounded-2xl shadow-lg border border-purple-100 p-6'>
          
          {/* Project Basic Info */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
            <div className='space-y-6'>
              {/* Project Title */}
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-gray-700'>Project Title</label>
                <input 
                  onChange={e => setCourseTitle(e.target.value)} 
                  value={courseTitle} 
                  type="text" 
                  placeholder='Enter Project title' 
                  className='outline-none py-3 px-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200' 
                  required 
                />
              </div>

              {/* Project Description */}
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-gray-700'>Project Description</label>
                <div 
                  ref={editorRef} 
                  className='min-h-[200px] rounded-xl border border-gray-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all duration-200'
                />
              </div>
            </div>

            <div className='space-y-6'>
              {/* Pricing Section */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-semibold text-gray-700'>Project Price ({'\u20B9'})</label>
                  <input 
                    onChange={e => setCoursePrice(e.target.value)} 
                    value={coursePrice} 
                    type="number" 
                    placeholder='0' 
                    className='outline-none py-3 px-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200' 
                    required 
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-semibold text-gray-700'>Discount %</label>
                  <input 
                    onChange={e => setDiscount(e.target.value)} 
                    value={discount} 
                    type="number" 
                    placeholder='0' 
                    min={0} 
                    max={100} 
                    className='outline-none py-3 px-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200' 
                    required 
                  />
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-gray-700'>Project Thumbnail</label>
                <label htmlFor='thumbnailImage' className='flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 cursor-pointer'>
                  <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                    <span className='text-purple-600 text-xl'>📷</span>
                  </div>
                  <div className='text-center'>
                    <p className='text-sm font-medium text-gray-700'>Click to upload thumbnail</p>
                    <p className='text-xs text-gray-500'>PNG, JPG, WEBP up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    id='thumbnailImage' 
                    onChange={e => setImage(e.target.files[0])} 
                    accept="image/*" 
                    hidden 
                  />
                </label>
                {image && (
                  <div className='mt-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
                    <p className='text-sm text-green-700 font-medium'>✓ Thumbnail selected</p>
                    <img className='max-h-20 mx-auto mt-2 rounded-lg' src={URL.createObjectURL(image)} alt="Project thumbnail" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modules & Tasks Section */}
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-gray-900'>Project Content</h2>
              <span className='text-sm text-gray-600'>{chapters.length} modules</span>
            </div>

            {chapters.map((chapter, chapterIndex) => (
              <div key={chapter.chapterId} className="bg-gray-50 rounded-xl border border-gray-200 mb-4 overflow-hidden">
                {/* Module Header */}
                <div className="flex justify-between items-center p-4 bg-white border-b">
                  <div className="flex items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => handleChapter('toggle', chapter.chapterId)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-200 ${chapter.collapsed && "rotate-[-90deg]"}`}
                    >
                      ↓
                    </button>
                    <div>
                      <span className="font-semibold text-gray-900">Module {chapterIndex + 1}: {chapter.chapterTitle}</span>
                      <p className="text-sm text-gray-500">{chapter.chapterContent.length} tasks</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                  >
                    ×
                  </button>
                </div>

                {/* Module Content */}
                {!chapter.collapsed && (
                  <div className="p-4 space-y-3">
                    {chapter.chapterContent.map((task, taskIndex) => (
                      <div key={task.taskId} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-medium text-gray-900">{taskIndex + 1}. {task.taskTitle}</span>
                            {task.isPreviewFree && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Free Preview</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>📄 PDF Task</span>
                            <span className="text-purple-600 font-medium">
                              Google Drive Link
                            </span>
                          </div>
                          {task.taskDescription && (
                            <p className="text-xs text-gray-500 mt-1">{task.taskDescription}</p>
                          )}
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleTask('remove', chapter.chapterId, taskIndex)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => handleTask('add', chapter.chapterId)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-200 font-medium"
                    >
                      <span>+</span>
                      Add Task
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Module Button */}
            <button 
              type="button"
              onClick={() => handleChapter('add')}
              className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg"
            >
              <span className="text-xl">+</span>
              Add New Module
            </button>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <button 
              type="submit" 
              className='bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg'
            >
              Create Project
            </button>
          </div>
        </form>

        {/* Add Task Popup - UPDATED FOR GOOGLE DRIVE */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
                <button 
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Task Title</label>
                  <input
                    type="text"
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    value={taskDetails.taskTitle}
                    onChange={(e) => setTaskDetails({ ...taskDetails, taskTitle: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Task Description</label>
                  <textarea
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    value={taskDetails.taskDescription}
                    onChange={(e) => setTaskDetails({ ...taskDetails, taskDescription: e.target.value })}
                    placeholder="Enter task description"
                    rows="3"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Google Drive PDF URL</label>
                  <input
                    type="url"
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    value={taskDetails.googleDriveUrl}
                    onChange={(e) => setTaskDetails({ ...taskDetails, googleDriveUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    📌 Upload PDF to Google Drive and paste the shareable link here
                  </p>
                  {taskDetails.googleDriveUrl && !isValidGoogleDriveUrl(taskDetails.googleDriveUrl) && (
                    <p className="text-xs text-red-500 mt-1">⚠️ Please enter a valid Google Drive URL</p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    checked={taskDetails.isPreviewFree}
                    onChange={(e) => setTaskDetails({ ...taskDetails, isPreviewFree: e.target.checked })}
                  />
                  <label className="text-sm font-medium text-gray-700">Available as free preview</label>
                </div>
              </div>
              
              <button 
                type='button' 
                onClick={addTask}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold"
              >
                Add Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCourse;