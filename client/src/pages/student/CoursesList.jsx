import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/student/Footer'
import { assets } from '../../assets/assets'
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';

const CoursesList = () => {

    const { input } = useParams()
    const { allCourses } = useContext(AppContext)
    const navigate = useNavigate()

    const [filteredCourse, setFilteredCourse] = useState([])
    const [searchQuery, setSearchQuery] = useState(input || '')

    // Handle search function
    const handleSearch = (query) => {
        setSearchQuery(query)
        if (query.trim()) {
            navigate(`/course-list/${query}`)
        } else {
            navigate('/course-list')
        }
    }

    // Filter courses based on search
    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            if (input) {
                const filtered = allCourses.filter(course => 
                    course.courseTitle.toLowerCase().includes(input.toLowerCase()) ||
                    (course.instructorName && course.instructorName.toLowerCase().includes(input.toLowerCase())) ||
                    (course.category && course.category.toLowerCase().includes(input.toLowerCase()))
                )
                setFilteredCourse(filtered)
            } else {
                setFilteredCourse(allCourses)
            }
        }
    }, [allCourses, input])

    // Clear search
    const clearSearch = () => {
        setSearchQuery('')
        navigate('/course-list')
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="relative md:px-8 px-4 pt-28 pb-16 max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full mb-12'>
                        <div>
                            <h1 className='text-4xl font-bold text-gray-900 mb-3'>Discover Courses</h1>
                            <p className='text-gray-600 text-lg'>
                                <span 
                                    onClick={() => navigate('/')} 
                                    className='text-purple-600 cursor-pointer hover:text-purple-700 font-medium transition-colors duration-200'
                                >
                                    Home
                                </span> 
                                <span className='text-gray-400 mx-2'>/</span> 
                                <span className='text-gray-800 font-medium'>Course List</span>
                            </p>
                        </div>
                        <div className='w-full md:w-auto'>
                            {/* Updated SearchBar with proper props */}
                            <SearchBar 
                                onSearch={handleSearch} 
                                initialValue={searchQuery}
                            />
                        </div>
                    </div>

                    {/* Search Filter Tag */}
                    {input && (
                        <div className='inline-flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-purple-200 shadow-lg mb-8 text-gray-700'>
                            <span className='text-sm font-medium'>Search results for:</span>
                            <span className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium'>{input}</span>
                            <img 
                                onClick={clearSearch} 
                                className='cursor-pointer w-4 h-4 hover:scale-110 transition-transform duration-200' 
                                src={assets.cross_icon} 
                                alt="Clear search" 
                            />
                        </div>
                    )}

                    {/* Results Count */}
                    <div className='mb-8'>
                        <p className='text-gray-600'>
                            Showing <span className='font-semibold text-purple-600'>{filteredCourse.length}</span> 
                            {filteredCourse.length === 1 ? ' course' : ' courses'} 
                            {input && ` for "${input}"`}
                        </p>
                    </div>

                    {/* Courses Grid with Hover Effects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCourse.map((course, index) => (
                            <div 
                                key={index} 
                                className="border-2 border-gray-300 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-purple-400"
                            >
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredCourse.length === 0 && (
                        <div className='text-center py-16'>
                            <div className='w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                                <span className='text-purple-600 text-3xl'>📚</span>
                            </div>
                            <h3 className='text-2xl font-semibold text-gray-900 mb-3'>No courses found</h3>
                            <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto'>
                                {input 
                                    ? `No courses found matching "${input}". Try searching with different keywords.`
                                    : 'No courses available at the moment. Please check back later.'
                                }
                            </p>
                            {input && (
                                <button 
                                    onClick={clearSearch}
                                    className='bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg'
                                >
                                    View All Courses
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CoursesList