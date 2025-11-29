import React, { useState, useEffect } from 'react';
import { FaGem, FaRedoAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('web-dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  // Refresh + URL change par active tab set karo
  useEffect(() => {
    const path = location.pathname.replace("/", "");

    switch (path) {
      case "overview":
        setActiveTab("overview");
        break;
      case "incidents":
        setActiveTab("incidents");
        break;
      case "settings":
        setActiveTab("settings");
        break;
      default:
        setActiveTab("web-dashboard");
    }
  }, [location.pathname]);

  // Tab styles
  const tabStyles = (tabName) => {
    const isActive = activeTab === tabName;
    return `
      py-3 px-6 text-sm font-medium transition-all duration-300 rounded-lg
      ${isActive 
        ? 'bg-sky-700/30 text-white'
        : 'bg-transparent text-gray-300 hover:text-white hover:bg-sky-700/30'
      }
    `;
  };

  return (
    <div className="bg-[#0b203a] flex flex-col font-sans">
      
      <main className="flex-grow flex flex-col justify-start items-center pt-16 pb-10 px-4">
        
        {/* Hero Text Section */}
        <div className="text-center mb-12">
          <h2
            className="text-5xl font-bold mb-4 leading-tight"
            style={{
              background: 'linear-gradient(to right, #e879f9, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Protect Your Digital Assets
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Monitor domains and email addresses for dark web exposure and data breaches in real-time
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="bg-blue-900/30 p-1 rounded-xl shadow-2xl flex space-x-1 w-full max-w-md justify-between text-sm">

          <button
            className={tabStyles('web-dashboard')}
            onClick={() => {
              setActiveTab('web-dashboard');
              navigate('/web-dashboard');
            }}
          >
            Dashboard
          </button>

          <button
            className={tabStyles('overview')}
            onClick={() => {
              setActiveTab('overview');
              navigate('/overview');
            }}
          >
            Overview
          </button>

          <button
            className={tabStyles('incidents')}
            onClick={() => {
              setActiveTab('incidents');
              navigate('/incidents');
            }}
          >
            Incidents
          </button>

          <button
            className={tabStyles('settings')}
            onClick={() => {
              setActiveTab('settings');
              navigate('/settings');
            }}
          >
            Settings
          </button>

        </nav>

      </main>
    </div>
  );
};

export default HeroSection;
