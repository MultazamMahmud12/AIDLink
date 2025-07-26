import { FiHeart, FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import PropTypes from "prop-types";
import getImgUrl from "../../utils/getImgURL";

const EventCard = ({ event }) => {
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
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const fundingPercentage = (event.currentFunding / event.fundingGoal) * 100;

  return (
    <div className="w-full h-full rounded-lg shadow-md p-4 bg-white dark:bg-gray-900 transition-shadow duration-300 flex flex-col hover:shadow-lg">
      <div className="flex-grow">
        {/* Event Image */}
        <div className="h-48 flex justify-center items-center mb-4 overflow-hidden rounded-md relative">
          <img
            src={getImgUrl(event.coverImage)}
            alt={event.title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
          />
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            {event.isOngoing ? (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Ongoing
              </span>
            ) : (
              <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Resolved
              </span>
            )}
          </div>
          {/* Urgency Badge */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(event.urgencyLevel)}`}>
              {event.urgencyLevel} priority
            </span>
          </div>
        </div>

        {/* Event Details */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title || "Event Title"}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {event.description || "Event Description"}
        </p>

        {/* Event Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FiMapPin className="mr-2 text-primary" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FiUsers className="mr-2 text-primary" />
            <span>{formatNumber(event.estimatedAffectedPeople)} people affected</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FiCalendar className="mr-2 text-primary" />
            <span>Started: {new Date(event.startDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">Funding Progress</span>
            <span className="font-medium">{fundingPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-300">
              ${formatNumber(event.currentFunding)} raised
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              Goal: ${formatNumber(event.fundingGoal)}
            </span>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
            {event.category.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto">
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex-1 flex items-center justify-center gap-2">
          <FiHeart />
          <span>Donate Now</span>
        </button>
        <button className="border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-md font-medium transition-colors duration-200">
          Learn More
        </button>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventCard;
