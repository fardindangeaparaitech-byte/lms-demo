import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='w-full py-20 bg-gradient-to-br from-gray-50 to-blue-50'>
      <div className='max-w-4xl mx-auto text-center px-4'>
        
        {/* Main Heading */}
        <h1 className='text-5xl font-bold text-gray-900 mb-6'>
          Ready to <span className='text-purple-600'>Transform</span> Your Career?
        </h1>
        
        {/* Subtitle */}
        <p className='text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed'>
          Join thousands of successful students who have accelerated their careers with our live projects and industry expert mentorship.
        </p>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-purple-100 text-center'>
            <div className='text-3xl font-bold text-purple-600 mb-2'>10,000+</div>
            <div className='text-gray-600 text-sm'>Students Transformed</div>
          </div>
          
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-purple-100 text-center'>
            <div className='text-3xl font-bold text-purple-600 mb-2'>500+</div>
            <div className='text-gray-600 text-sm'>Live Projects Completed</div>
          </div>
          
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-purple-100 text-center'>
            <div className='text-3xl font-bold text-purple-600 mb-2'>94%</div>
            <div className='text-gray-600 text-sm'>Success Rate</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
          <button className='bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl hover:scale-105'>
            🚀 Start Your Journey Today
          </button>
          
          <button className='flex items-center gap-3 border border-purple-600 text-purple-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-purple-50 hover:shadow-lg group'>
            Learn More About Programs
            <img 
              src={assets.arrow_icon} 
              alt="arrow_icon" 
              className='w-5 h-5 transition-transform duration-300 group-hover:translate-x-1' 
            />
          </button>
        </div>

        {/* Trust Badge with Simple Black Border */}
        <div className='mt-12 flex flex-col items-center'>
          <p className='text-gray-500 text-sm mb-4'>Trusted by learners from top companies</p>
          <div className='flex flex-wrap justify-center gap-6'>
            <div className='bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium transition-all duration-300 hover:border-black'>
              Google
            </div>
            
            <div className='bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium transition-all duration-300 hover:border-black'>
              Microsoft
            </div>
            
            <div className='bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium transition-all duration-300 hover:border-black'>
              Amazon
            </div>
            
            <div className='bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium transition-all duration-300 hover:border-black'>
              Meta
            </div>
            
            <div className='bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium transition-all duration-300 hover:border-black'>
              Apple
            </div>
            
            <div className='bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium transition-all duration-300 hover:border-black'>
              Netflix
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CallToAction