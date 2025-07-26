import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { 
  FiMapPin, 
  FiGlobe, 
  FiMail, 
  FiPhone, 
  FiUsers, 
  FiDollarSign, 
  FiStar, 
  FiShield, 
  FiHeart,
  FiExternalLink,
  FiCalendar,
  FiCheckCircle,
  FiAward,
  FiFilter,
  FiX
} from "react-icons/fi";

const Recipients = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [eventInfo, setEventInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch organizations
        const orgResponse = await fetch('/registered_organizations.json');
        if (!orgResponse.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const orgData = await orgResponse.json();
        setOrganizations(orgData);
        
        // If eventId is provided, filter organizations and fetch event info
        if (eventId) {
          const filtered = orgData.filter(org => 
            org.eventRegistrations && 
            org.eventRegistrations.some(event => event.eventId === eventId)
          );
          setFilteredOrganizations(filtered);
          
          // Fetch event information
          try {
            const eventResponse = await fetch('/events.json');
            if (eventResponse.ok) {
              const eventData = await eventResponse.json();
              const currentEvent = eventData.find(event => event._id === eventId);
              setEventInfo(currentEvent);
            }
          } catch (eventErr) {
            console.warn('Could not fetch event information:', eventErr);
          }
        } else {
          setFilteredOrganizations(orgData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getOrganizationTypeColor = (type) => {
    switch (type) {
      case 'international_ngo':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'child_welfare_ngo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disaster_relief':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStarRating = (rating) => {
    const stars = rating ? parseInt(rating.split('_')[0]) : 0;
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleDonate = (org) => {
    setSelectedOrg(org);
  };

  const processDonation = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) return;
    
    // Handle donation logic here
    console.log(`Donating $${donationAmount} to ${selectedOrg.organizationInfo.commonName}`);
    alert(`Thank you for donating $${donationAmount} to ${selectedOrg.organizationInfo.commonName}!`);
    
    // Reset form
    setSelectedOrg(null);
    setDonationAmount('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            {eventId ? 'Event Recipients' : 'Verified Recipients'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {eventId 
              ? `Organizations registered and responding to this specific event.`
              : 'Support trusted organizations making a difference. All recipients are verified with proper documentation and transparency ratings.'
            }
          </p>
          
          {/* Event Info Banner */}
          {eventId && eventInfo && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <FiCalendar className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {eventInfo.title}
                  </h3>
                  <p className="text-blue-700 text-sm mb-2">
                    {eventInfo.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-blue-600">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="h-4 w-4" />
                      {eventInfo.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers className="h-4 w-4" />
                      {formatNumber(eventInfo.estimatedAffectedPeople)} affected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Filter Info */}
          {eventId && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiFilter className="h-4 w-4" />
                <span>Showing {filteredOrganizations.length} organization(s) registered for this event</span>
              </div>
              <Link 
                to="/recipients" 
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <FiX className="h-4 w-4" />
                Show All Recipients
              </Link>
            </div>
          )}
        </div>

        {/* No Results Message */}
        {eventId && filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <FiUsers className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                No Registered Organizations
              </h3>
              <p className="text-yellow-700 text-sm mb-4">
                No organizations are currently registered for this specific event.
              </p>
              <Link 
                to="/recipients" 
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                View All Recipients
              </Link>
            </div>
          </div>
        )}

        {/* Organizations Grid */}
        {filteredOrganizations.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOrganizations.map((org) => {
              // Get event registration info if eventId is provided
              const eventRegistration = eventId 
                ? org.eventRegistrations?.find(reg => reg.eventId === eventId)
                : null;

              return (
                <div key={org._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {org.organizationInfo.acronym}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-black">
                            {org.organizationInfo.legalName}
                          </h3>
                          <p className="text-gray-600">{org.organizationInfo.commonName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiShield className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">Verified</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getOrganizationTypeColor(org.organizationInfo.organizationType)}`}>
                        {org.organizationInfo.organizationType.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        {org.registrationStatus.approvalStatus.toUpperCase()}
                      </span>
                      {eventRegistration && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {eventRegistration.role.replace('_', ' ').toUpperCase()}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {org.organizationDetails.mission}
                    </p>
                    
                    {/* Event Registration Info */}
                    {eventRegistration && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 text-sm mb-2">Event Registration Details</h4>
                        <div className="space-y-1 text-xs text-blue-700">
                          <p><span className="font-medium">Allocated Budget:</span> ${formatNumber(eventRegistration.estimatedBudgetAllocated)}</p>
                          <p><span className="font-medium">Expected Beneficiaries:</span> {formatNumber(eventRegistration.expectedBeneficiaries)}</p>
                          <p><span className="font-medium">Response Time:</span> {eventRegistration.responseTime.replace('_', ' ')}</p>
                          {eventRegistration.servicesOffered && (
                            <p><span className="font-medium">Services:</span> {eventRegistration.servicesOffered.join(', ').replace(/_/g, ' ')}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    {/* Contact & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiMapPin className="h-4 w-4 mr-2" />
                          <span>{org.addressInfo.headquarters.city}, {org.addressInfo.headquarters.country}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiGlobe className="h-4 w-4 mr-2" />
                          <a 
                            href={org.organizationInfo.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="h-4 w-4 mr-2" />
                          <span>Est. {new Date(org.organizationInfo.establishedDate).getFullYear()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiUsers className="h-4 w-4 mr-2" />
                          <span>{org.organizationDetails.operationalCapacity.staffCount} Staff</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <FiDollarSign className="h-4 w-4 mr-2" />
                        Financial Transparency
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Annual Budget</p>
                          <p className="font-bold text-lg">${formatNumber(org.financialInformation.annualBudget.totalBudget)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Program Efficiency</p>
                          <p className="font-bold text-lg">{org.financialInformation.annualBudget.programEfficiencyRatio}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Trust Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          {getStarRating(org.trustMetrics.overallRating)}
                        </div>
                        <p className="text-xs text-gray-600">Overall Rating</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <FiCheckCircle className="h-4 w-4 text-green-500" />
                          <span className="ml-1 text-sm font-bold">{org.trustMetrics.transparencyScore}</span>
                        </div>
                        <p className="text-xs text-gray-600">Transparency</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <FiAward className="h-4 w-4 text-blue-500" />
                          <span className="ml-1 text-sm font-bold">{org.trustMetrics.impactScore}</span>
                        </div>
                        <p className="text-xs text-gray-600">Impact Score</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDonate(org)}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <FiHeart className="h-4 w-4" />
                        Donate Now
                      </button>
                      <Link
                        to={`/recipients/${org._id}`}
                        className="flex-1 border border-primary text-primary hover:bg-primary hover:text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 text-center"
                      >
                        View Details
                      </Link>
                      <a
                        href={org.organizationInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                      >
                        <FiGlobe className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results Message for All Recipients */}
        {!eventId && filteredOrganizations.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No organizations found.</p>
          </div>
        )}
      </div>

      {/* Donation Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              Donate to {selectedOrg.organizationInfo.commonName}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount ($)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {[50, 100, 250].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount.toString())}
                  className="py-2 px-3 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrg(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={processDonation}
                disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                className="flex-1 bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipients;
