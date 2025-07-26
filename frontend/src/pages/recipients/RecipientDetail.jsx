import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import getImgUrl, { getOrgFallbackImg } from '../../utils/getImgURL';
import { 
  FiArrowLeft, 
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
  FiDownload,
  FiEye,
  FiFileText,
  FiImage,
  FiUser,
  FiTarget,
  FiTrendingUp,
  FiShare2
} from "react-icons/fi";

const RecipientDetail = () => {
  const { recipientId } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        const response = await fetch('/registered_organizations.json');
        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const data = await response.json();
        const orgData = data.find(org => org._id === recipientId);
        
        if (!orgData) {
          throw new Error('Organization not found');
        }
        
        setOrganization(orgData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (recipientId) {
      fetchOrganizationDetails();
    }
  }, [recipientId]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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

  const handleDonate = () => {
    setShowDonationModal(true);
  };

  const processDonation = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) return;
    
    // Handle donation logic here
    console.log(`Donating $${donationAmount} to ${organization.organizationInfo.commonName}`);
    alert(`Thank you for donating $${donationAmount} to ${organization.organizationInfo.commonName}!`);
    
    // Reset form
    setShowDonationModal(false);
    setDonationAmount('');
  };

  const handleDocumentView = (doc) => {
    setSelectedDocument(doc);
  };

  const handleDocumentDownload = async (doc) => {
    const fileName = doc.imageUrl || doc.reportUrl || doc.certificateUrl;
    const docType = doc.type || doc.name;
    
    if (!fileName) {
      alert('Document file not available for download');
      return;
    }

    try {
      // For development, we'll use placeholder files from public folder
      // In production, these would be actual document URLs from your server
      const downloadUrl = `/documents/${fileName}`;
      
      // Fetch the file
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        // If file doesn't exist, create a sample download
        downloadSampleFile(fileName, docType);
        return;
      }
      
      // Get the file as blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert(`Successfully downloaded ${docType}`);
      
    } catch (error) {
      console.error('Download error:', error);
      // Fallback to sample download
      downloadSampleFile(fileName, docType);
    }
  };

  const downloadSampleFile = (fileName, docType) => {
    // Create a sample file content for demonstration
    const fileExtension = fileName.split('.').pop().toLowerCase();
    let content, mimeType;
    
    if (fileExtension === 'pdf') {
      // Create a simple PDF-like content (this would be a real PDF in production)
      content = `Sample PDF Document: ${docType}\n\nThis is a placeholder for the actual document.\nIn a real application, this would be the actual PDF file.\n\nDocument: ${fileName}\nType: ${docType}\nGenerated: ${new Date().toLocaleString()}`;
      mimeType = 'application/pdf';
    } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      // For images, create a text file with image info
      content = `Image Document: ${docType}\n\nThis represents an image document.\nActual file: ${fileName}\nType: ${docType}\nGenerated: ${new Date().toLocaleString()}`;
      mimeType = 'text/plain';
      fileName = fileName.replace(/\.(jpg|jpeg|png)$/i, '.txt');
    } else {
      // Default text content
      content = `Document: ${docType}\n\nFile: ${fileName}\nGenerated: ${new Date().toLocaleString()}\n\nThis is a sample document for demonstration purposes.`;
      mimeType = 'text/plain';
    }
    
    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert(`Downloaded sample file: ${docType}`);
  };

  const renderDocumentViewer = (doc) => {
    const fileName = doc.imageUrl || doc.reportUrl || doc.certificateUrl;
    const isImage = fileName && (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.jpeg'));
    const isPDF = fileName && fileName.includes('.pdf');

    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isImage ? <FiImage className="h-5 w-5 text-blue-500" /> : <FiFileText className="h-5 w-5 text-red-500" />}
            <span className="font-medium">{doc.type || doc.name}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDocumentView(doc)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="View Document"
            >
              <FiEye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDocumentDownload(doc)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Download Document"
            >
              <FiDownload className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {isImage ? (
          <div className="bg-gray-100 rounded-md h-32 flex items-center justify-center overflow-hidden">
            <img
              src={getImgUrl(fileName)}
              alt={doc.type || doc.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-gray-500 text-sm">Image Preview: ${fileName}</span>`;
              }}
            />
          </div>
        ) : isPDF ? (
          <div className="bg-red-50 rounded-md h-32 flex items-center justify-center">
            <span className="text-red-600 text-sm">PDF Document: {fileName}</span>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-md h-32 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Document: {fileName}</span>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          {doc.issueDate && `Issued: ${new Date(doc.issueDate).toLocaleDateString()}`}
          {doc.expiryDate && ` | Expires: ${new Date(doc.expiryDate).toLocaleDateString()}`}
          {doc.isVerified && (
            <span className="inline-flex items-center ml-2 text-green-600">
              <FiCheckCircle className="h-3 w-3 mr-1" />
              Verified
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading organization details...</p>
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
            to="/recipients"
            className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Back to Recipients
          </Link>
        </div>
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-light py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/recipients"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6 font-medium"
        >
          <FiArrowLeft className="mr-2" />
          Back to Recipients
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                {organization.organizationInfo?.logo ? (
                  <img
                    src={getImgUrl(organization.organizationInfo.logo)}
                    alt={`${organization.organizationInfo.commonName} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // First fallback: organization type based image
                      const fallbackImg = getOrgFallbackImg(organization.organizationInfo?.organizationType);
                      if (e.target.src !== fallbackImg) {
                        e.target.src = fallbackImg;
                      } else {
                        // Final fallback: show acronym
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span class="text-3xl font-bold text-primary">${organization.organizationInfo.acronym}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {organization.organizationInfo.acronym}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">
                  {organization.organizationInfo.legalName}
                </h1>
                <p className="text-gray-600 text-lg">{organization.organizationInfo.commonName}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <FiShield className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Verified Organization</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStarRating(organization.financialInformation.transparencyRating)}
                    <span className="text-sm text-gray-600 ml-2">
                      {organization.financialInformation.transparencyRating.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDonate}
                className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FiHeart />
                <span>Donate Now</span>
              </button>
              <button className="border border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                <FiShare2 />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FiUser },
                { id: 'programs', label: 'Programs', icon: FiTarget },
                { id: 'financials', label: 'Financials', icon: FiDollarSign },
                { id: 'documents', label: 'Documents', icon: FiFileText },
                { id: 'leadership', label: 'Leadership', icon: FiUsers }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Mission & Vision</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Mission</h4>
                      <p className="text-blue-800">{organization.organizationDetails.mission}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Vision</h4>
                      <p className="text-green-800">{organization.organizationDetails.vision}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {(organization.organizationDetails?.focusAreas || []).map((area, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {area.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                    {(!organization.organizationDetails?.focusAreas || organization.organizationDetails.focusAreas.length === 0) && (
                      <span className="text-gray-500">Focus areas not specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Headquarters</p>
                          <p className="text-gray-600">
                            {organization.addressInfo.headquarters.street}<br />
                            {organization.addressInfo.headquarters.city}, {organization.addressInfo.headquarters.state}<br />
                            {organization.addressInfo.headquarters.country} {organization.addressInfo.headquarters.zipCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiPhone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-gray-600">{organization.organizationInfo.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiMail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-gray-600">{organization.organizationInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiGlobe className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Website</p>
                          <a href={organization.organizationInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {organization.organizationInfo.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Operational Regions</h3>
                  <div className="space-y-3">
                    {(organization.addressInfo?.operationalRegions || []).map((region, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{region.region}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${region.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {region.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{region.countries?.join(', ')}</p>
                      </div>
                    ))}
                    {(!organization.addressInfo?.operationalRegions || organization.addressInfo.operationalRegions.length === 0) && (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        <FiMapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Operational regions not specified</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Active Programs</h3>
                {(organization.programs || []).length > 0 ? (
                  organization.programs.map((program, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Program Image */}
                        {program.coverImage && (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getImgUrl(program.coverImage)}
                              alt={program.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = getOrgFallbackImg('community_organization');
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{program.name}</h4>
                          <p className="text-gray-600">{program.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        program.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {program.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-bold text-lg">${formatNumber(program.budget)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Beneficiaries Reached</p>
                        <p className="font-bold text-lg">{formatNumber(program.beneficiariesReached)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-bold text-sm">
                          {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiTarget className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No active programs available</p>
                  </div>
                )}
              </div>
            )}

            {/* Financials Tab */}
            {activeTab === 'financials' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Annual Budget ({organization.financialInformation.annualBudget.year})</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Total Budget</p>
                      <p className="text-2xl font-bold text-blue-900">${formatNumber(organization.financialInformation.annualBudget.totalBudget)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Program Expenses</p>
                      <p className="text-2xl font-bold text-green-900">${formatNumber(organization.financialInformation.annualBudget.programExpenses)}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-sm text-yellow-600">Administrative</p>
                      <p className="text-2xl font-bold text-yellow-900">${formatNumber(organization.financialInformation.annualBudget.administrativeExpenses)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">Program Efficiency</p>
                      <p className="text-2xl font-bold text-purple-900">{organization.financialInformation.annualBudget.programEfficiencyRatio}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Funding Sources</h3>
                  <div className="space-y-3">
                    {(organization.financialInformation?.fundingSources || []).map((source, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{source.source.replace('_', ' ').toUpperCase()}</span>
                          <span className="font-bold">{source.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">${formatNumber(source.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Legal Documentation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {renderDocumentViewer(organization.legalDocumentation.incorporationCertificate)}
                    {renderDocumentViewer(organization.legalDocumentation.taxExemptStatus)}
                    {renderDocumentViewer(organization.legalDocumentation.operatingLicense)}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Audit Reports</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(organization.legalDocumentation?.auditReports || []).map((audit, index) => (
                      <div key={index}>
                        {renderDocumentViewer({
                          type: `${audit.year} Audit Report`,
                          reportUrl: audit.reportUrl,
                          issueDate: audit.auditDate,
                          isVerified: audit.isVerified
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {organization.certifications && organization.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {organization.certifications.map((cert, index) => (
                        <div key={index}>
                          {renderDocumentViewer({
                            name: cert.name,
                            certificateUrl: cert.certificateUrl,
                            issueDate: cert.issueDate,
                            expiryDate: cert.expiryDate,
                            isVerified: cert.isActive
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Leadership Tab */}
            {activeTab === 'leadership' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Executive Leadership</h3>
                  <div className="border rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {organization.leadership?.executiveDirector?.photo ? (
                          <img
                            src={getImgUrl(organization.leadership.executiveDirector.photo)}
                            alt={organization.leadership.executiveDirector.name}
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(organization.leadership.executiveDirector.name || 'Director')}&size=64&background=059669&color=ffffff&format=png`;
                            }}
                          />
                        ) : (
                          <FiUser className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{organization.leadership.executiveDirector.name}</h4>
                        <p className="text-primary font-medium">{organization.leadership.executiveDirector.position}</p>
                        <p className="text-gray-600 mt-2">{organization.leadership.executiveDirector.bio}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-2">
                            <FiMail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{organization.leadership.executiveDirector.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiPhone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{organization.leadership.executiveDirector.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Board of Directors</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {organization.leadership?.boardOfDirectors?.length > 0 ? (
                      organization.leadership.boardOfDirectors.map((member, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                              {member.photo ? (
                                <img
                                  src={getImgUrl(member.photo)}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'Member')}&size=48&background=6b7280&color=ffffff&format=png`;
                                  }}
                                />
                              ) : (
                                <FiUser className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">{member.name}</h4>
                              <p className="text-primary text-sm font-medium">{member.position}</p>
                              <p className="text-gray-600 text-sm mt-1">{member.background}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        <FiUsers className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Board member information not available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              Donate to {organization.organizationInfo.commonName}
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
              {[100, 250, 500].map((amount) => (
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
                onClick={() => setShowDonationModal(false)}
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

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedDocument.type || selectedDocument.name}</h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-4">
                <div className="text-center">
                  <FiFileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Document Preview</p>
                  <p className="text-sm text-gray-500">
                    {selectedDocument.imageUrl || selectedDocument.reportUrl || selectedDocument.certificateUrl}
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => handleDocumentDownload(selectedDocument)}
                  className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <FiDownload />
                  Download Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientDetail;
