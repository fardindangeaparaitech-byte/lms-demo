import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div 
      className="w-full bg-gradient-to-br from-purple-50 to-blue-50"
      style={{ paddingTop: '40px' }}
    >
      <div className="w-full py-20">
        
        <div className="w-full text-center mb-16 px-4">
          <span className="inline-block px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
            🚀 Real-World Experience
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Master Skills with <span className="text-purple-600">Live Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Work on real client projects, build your portfolio, and earn while learning. 
            Get hands-on experience that employers value.
          </p>
        </div>

        {/* FEATURE BOXES WITH THIN BORDER ON HOVER */}
        <div className="w-full px-4 mb-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 text-center transition-all duration-300 hover:shadow-md hover:border-black group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-200">
                <span className="text-xl">💼</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Industry Projects</h3>
              <p className="text-gray-600 text-sm">Real client requirements and deadlines</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 text-center transition-all duration-300 hover:shadow-md hover:border-black group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                <span className="text-xl">👨‍💻</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mentor Support</h3>
              <p className="text-gray-600 text-sm">1:1 guidance from industry experts</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 text-center transition-all duration-300 hover:shadow-md hover:border-black group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-200">
                <span className="text-xl">📁</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Portfolio Ready</h3>
              <p className="text-gray-600 text-sm">Build projects that impress recruiters</p>
            </div>
          </div>
        </div>

        {/* SMALL CARDS WITH SAME PRICE IN BOTH PLACES */}
        <div className="w-full px-4 mb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.slice(0, 6).map((course, index) => {
              // Get the actual course price from course object
              const coursePrice = course.price || course.actualPrice || (1999 + index * 500);
              
              // Create a modified course object with the same price
              const modifiedCourse = {
                ...course,
                price: coursePrice, // Ensure same price is used
                actualPrice: coursePrice // Ensure same price is used
              };
              
              return (
                <div 
                  key={index}
                  className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-black hover:border-2 hover:transform hover:scale-105 hover:z-10 relative group min-h-0"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 text-xs font-medium">
                    🚀 LIVE PROJECT
                  </div>
                  
                  <div className="p-2">
                    {/* CourseCard with modified course object to ensure same price */}
                    <div className="scale-90 origin-center -my-2">
                      <CourseCard course={modifiedCourse} />
                    </div>
                    
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Level:</span>
                        <span className="px-1 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          {index % 3 === 0 ? 'Beginner' : index % 3 === 1 ? 'Intermediate' : 'Advanced'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Weeks:</span>
                        <span className="font-medium text-gray-900">4-6</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Sessions:</span>
                        <span className="font-medium text-gray-900">8</span>
                      </div>
                    </div>

                    {/* Enroll button WITHOUT price */}
                    <button className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-1.5 rounded text-xs font-semibold transition-all duration-300 hover:from-purple-700 hover:to-blue-700">
                      Enroll Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Build Your Career?
              </h3>
              <p className="text-gray-600 mb-6">
                Join 10,000+ students who have transformed their careers with our live projects
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to={'/course-list'} 
                  onClick={() => scrollTo(0, 0)} 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg"
                >
                  Explore All Projects
                </Link>
                <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-purple-50">
                  Book Free Consultation
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoursesSection;