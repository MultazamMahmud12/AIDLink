import { useState, useEffect } from 'react';
import EventCard from './Eventcard';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Events");

  // Filter functions for different categories
  const ongoingEvents = events.filter(event => event.isOngoing === true);
  const highPriorityEvents = events.filter(event => event.urgencyLevel === 'high');
  const naturalDisasterEvents = events.filter(event => event.category === 'natural_disaster');

  // Get filtered events based on selected category
  const getFilteredEvents = () => {
    switch (selectedCategory) {
      case "Ongoing":
        return ongoingEvents;
      case "High Priority":
        return highPriorityEvents;
      case "Natural Disasters":
        return naturalDisasterEvents;
      case "All Events":
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/events.json');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Current Crises & Events
          </h1>
          <p className="text-lg text-gray-text max-w-2xl mx-auto">
            Help us support communities in need. Your contribution can make a real difference in people's lives.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            onClick={() => setSelectedCategory("All Events")} 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === "All Events" 
                ? "bg-primary text-white" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Events ({events.length})
          </button>
          <button 
            onClick={() => setSelectedCategory("Ongoing")} 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === "Ongoing" 
                ? "bg-primary text-white" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Ongoing ({ongoingEvents.length})
          </button>
          <button 
            onClick={() => setSelectedCategory("High Priority")} 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === "High Priority" 
                ? "bg-primary text-white" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            High Priority ({highPriorityEvents.length})
          </button>
          <button 
            onClick={() => setSelectedCategory("Natural Disasters")} 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === "Natural Disasters" 
                ? "bg-primary text-white" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Natural Disasters ({naturalDisasterEvents.length})
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md font-medium transition-colors duration-200">
            Load More Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventList;
