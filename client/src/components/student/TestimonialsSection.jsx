import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
  return (
    <div className="w-full py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="w-full text-center mb-16">
          <span className="inline-block px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
            💫 Success Stories
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-purple-600">Students Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our learners as they share their journeys of transformation, success, 
            and how our platform has made a difference in their lives.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyTestimonial.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-purple-300 hover:transform hover:scale-105 hover:z-10 relative group"
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4">
                <div className="flex items-center gap-4">
                  <img 
                    className="h-14 w-14 rounded-full border-2 border-white" 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                  />
                  <div>
                    <h1 className="text-lg font-semibold text-white">{testimonial.name}</h1>
                    <p className="text-white/90 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Stars Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <img
                      className="h-5 w-5"
                      key={i}
                      src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                      alt="star"
                    />
                  ))}
                  <span className="text-gray-500 text-sm ml-2">({testimonial.rating})</span>
                </div>

                {/* Feedback */}
                <p className="text-gray-600 leading-relaxed">
                  {testimonial.feedback.length > 120 
                    ? `${testimonial.feedback.substring(0, 120)}...` 
                    : testimonial.feedback
                  }
                </p>

                {/* Read More Button */}
                <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-md">
                  Read Full Story
                </button>
              </div>

              {/* Corner Decoration */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-bl-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Success Story?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with our live projects and expert mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg">
                Start Learning Today
              </button>
              <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-purple-50">
                View More Testimonials
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TestimonialsSection;