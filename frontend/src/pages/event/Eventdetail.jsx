import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { FiHeart, FiCalendar, FiMapPin, FiUsers, FiShare2, FiFlag, FiClock, FiTrendingUp, FiArrowLeft } from "react-icons/fi";
import getImgUrl from "../../utils/getImgURL";

const Eventdetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch('/events.json');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        const eventData = data.find(e => e._id.toString() === eventId);
        
        if (!eventData) {
          throw new Error('Event not found');
        }
        
        setEvent(eventData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'severe':
        return 'text-orange-600';
      case 'moderate':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleDonate = () => {
    // Handle donation logic here
    console.log(`Donating to event ${event._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <Link 
            to="/events"
            className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const fundingPercentage = (event.currentFunding / event.fundingGoal) * 100;
  const remainingFunding = event.fundingGoal - event.currentFunding;

  return (
    <div className="min-h-screen bg-bg-light py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/events"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6 font-medium"
        >
          <FiArrowLeft className="mr-2" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image and Basic Info */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-96">
                <img
                  src={getImgUrl(event.coverImage)}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {/* Status Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {event.isOngoing ? (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Ongoing Crisis
                    </span>
                  ) : (
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Resolved
                    </span>
                  )}
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(event.urgencyLevel)}`}>
                    {event.urgencyLevel.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                    {event.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
                      <FiShare2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
                      <FiFlag className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-black mb-4">{event.title}</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FiUsers className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Affected People</p>
                    <p className="font-bold text-lg">{formatNumber(event.estimatedAffectedPeople)}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FiMapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-bold text-sm">{event.location}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FiCalendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Started</p>
                    <p className="font-bold text-sm">{new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <FiTrendingUp className={`h-6 w-6 mx-auto mb-2 ${getSeverityColor(event.severity)}`} />
                    <p className="text-sm text-gray-600">Severity</p>
                    <p className={`font-bold text-sm ${getSeverityColor(event.severity)}`}>
                      {event.severity.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-3">About This Crisis</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {event.description}
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">Current Situation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    This {event.category.replace('_', ' ')} has affected approximately {formatNumber(event.estimatedAffectedPeople)} people in {event.location}. 
                    The situation is classified as {event.severity} severity with {event.urgencyLevel} priority for immediate assistance.
                    {event.isOngoing ? ' The crisis is ongoing and requires immediate support.' : ' The situation has been resolved, but recovery efforts continue.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            {event.endDate && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FiClock className="mr-2 text-primary" />
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
                    <div>
                      <p className="font-medium">Crisis Started</p>
                      <p className="text-sm text-gray-600">{new Date(event.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-4"></div>
                    <div>
                      <p className="font-medium">Crisis Resolved</p>
                      <p className="text-sm text-gray-600">{new Date(event.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Donation Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Support This Cause</h3>
              
              {/* Funding Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Funding Progress</span>
                  <span className="font-medium">{fundingPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-primary">${formatNumber(event.currentFunding)}</p>
                  <p className="text-sm text-gray-600">raised of ${formatNumber(event.fundingGoal)} goal</p>
                  <p className="text-sm text-gray-600 mt-1">${formatNumber(remainingFunding)} still needed</p>
                </div>
              </div>

             
              

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
              >
                <FiHeart />
                <span>Donate Now</span>
              </button>

              {/* Share Button */}
              <button className="w-full border border-primary text-primary hover:bg-primary hover:text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                <FiShare2 />
                <span>Share This Cause</span>
              </button>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Crisis Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgency Level:</span>
                    <span className={`font-medium ${event.urgencyLevel === 'high' ? 'text-red-600' : event.urgencyLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {event.urgencyLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{event.category.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${event.isOngoing ? 'text-red-600' : 'text-gray-600'}`}>
                      {event.isOngoing ? 'Ongoing' : 'Resolved'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventdetail;
