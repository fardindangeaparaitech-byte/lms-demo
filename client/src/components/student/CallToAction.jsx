import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Namaste! 👋 Main StudyBot hoon. Aapko courses ke bare mein kya help chahiye?", sender: 'bot' }
  ]);

  // WhatsApp Redirect Function
  const redirectToWhatsApp = () => {
    const phoneNumber = '8390976474';
    const message = 'Hello! I want to learn more about your programs and courses. Can you please provide me with more information?';
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  // Start Journey Function
  const handleStartJourney = () => {
    window.location.href = '/courses';
  }

  // Toggle Chatbot
  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  }

  // Handle Chat Send
  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const userMessage = { text: chatInput, sender: 'user' };
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simple bot response
    const getBotResponse = (input) => {
      const userInput = input.toLowerCase();
      
      if (userInput.includes('course') || userInput.includes('program')) {
        return "Humare paas Web Development, Data Science, AI/ML ke courses hain! Kya aapko kisi specific field mein interest hai?";
      }
      else if (userInput.includes('fee') || userInput.includes('price')) {
        return "Courses ₹999 se ₹4999 tak hain. Aap course page par detailed fees dekh sakte hain!";
      }
      else if (userInput.includes('enroll') || userInput.includes('admission')) {
        return "Aap directly course page par 'Enroll Now' button click karke enroll ho sakte hain!";
      }
      else if (userInput.includes('hi') || userInput.includes('hello')) {
        return "Namaste! 😊 Main aapki kya help kar sakta hoon?";
      }
      else {
        return "Aap courses, fees, ya enrollment ke bare mein puchh sakte hain!";
      }
    };
    
    const botResponse = getBotResponse(chatInput);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 500);
    
    setChatInput('');
  }

  // Handle Enter Key Press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleChatSend();
    }
  }

  return (
    <div className='w-full py-20 bg-gradient-to-br from-gray-50 to-blue-50'>
      
      {/* CHATBOT ICON - SIMPLE & CLEAN */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={toggleChatbot}
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        >
          <span className="text-2xl text-white">💬</span>
        </button>
      </div>

      {/* CHATBOT WINDOW - FIXED POSITION */}
      {isChatbotOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-purple-100 flex flex-col z-50">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold">StudyBot Assistant</h3>
                  <p className="text-xs text-purple-200">Online - Ready to help</p>
                </div>
              </div>
              <button 
                onClick={toggleChatbot}
                className="text-white hover:text-purple-200 transition-colors text-xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              <button 
                onClick={handleChatSend}
                disabled={!chatInput.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📤
              </button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['fees?', 'How to enroll?', 'Available courses'].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setChatInput(suggestion);
                    // Auto focus back to input
                    document.querySelector('input[type="text"]')?.focus();
                  }}
                  className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT - NO CHANGES, NO EFFECTS */}
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
          <button 
            onClick={handleStartJourney}
            className='bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl hover:scale-105'
          >
            🚀 Start Your Journey Today
          </button>
          
          <button 
            onClick={redirectToWhatsApp}
            className='flex items-center gap-3 border border-purple-600 text-purple-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-purple-50 hover:shadow-lg group'
          >
            <span className="flex items-center gap-2">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-green-500"
              >
                <path 
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.176-1.24-6.165-3.495-8.411" 
                  fill="currentColor"
                />
              </svg>
              Let's Connect on WhatsApp & Learn More
            </span>
            <img 
              src={assets.arrow_icon} 
              alt="arrow_icon" 
              className='w-5 h-5 transition-transform duration-300 group-hover:translate-x-1' 
            />
          </button>
        </div>

        {/* Trust Badge */}
        <div className='mt-12 flex flex-col items-center'>
          <p className='text-gray-500 text-sm mb-4'>Trusted by learners from top companies</p>
          <div className='flex flex-wrap justify-center gap-6'>
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'].map((company, index) => (
              <div key={index} className='bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium transition-all duration-300 hover:border-black'>
                {company}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default CallToAction