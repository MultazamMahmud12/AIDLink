import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiMapPin, 
  FiFileText, 
  FiDollarSign, 
  FiAward, 
  FiUsers, 
  FiCalendar,
  FiPhone,
  FiMail,
  FiGlobe,
  FiUpload,
  FiX,
  FiPlus,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiSave
} from 'react-icons/fi';

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    // Organization Info
    organizationInfo: {
      legalName: '',
      commonName: '',
      acronym: '',
      organizationType: '',
      registrationNumber: '',
      taxId: '',
      establishedDate: '',
      website: '',
      email: '',
      phone: '',
      password: '',
      logo: null
    },
    // Address Info
    addressInfo: {
      headquarters: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      operationalRegions: [],
      fieldOffices: []
    },
    // Legal Documentation
    legalDocumentation: {
      incorporationCertificate: {
        documentNumber: '',
        issueDate: '',
        issuingAuthority: '',
        imageUrl: null
      },
      taxExemptStatus: {
        status: '',
        documentNumber: '',
        issueDate: '',
        issuingAuthority: '',
        imageUrl: null
      },
      operatingLicense: {
        licenseNumber: '',
        issueDate: '',
        expiryDate: '',
        issuingAuthority: '',
        imageUrl: null
      },
      auditReports: []
    },
    // Organization Details
    organizationDetails: {
      mission: '',
      vision: '',
      focusAreas: [],
      targetBeneficiaries: [],
      operationalCapacity: {
        staffCount: '',
        volunteersCount: '',
        emergencyResponseTeams: '',
        logisticalCapacity: '',
        mobilizationTime: ''
      }
    },
    // Financial Information
    financialInformation: {
      annualBudget: {
        year: new Date().getFullYear(),
        totalBudget: '',
        programExpenses: '',
        administrativeExpenses: '',
        fundraisingExpenses: '',
        programEfficiencyRatio: ''
      },
      fundingSources: []
    },
    // Leadership
    leadership: {
      executiveDirector: {
        name: '',
        position: '',
        email: '',
        phone: '',
        bio: '',
        linkedIn: '',
        photo: null
      }
    },
    // Programs
    programs: [],
    // Contact Persons
    contactPersons: [],
    // Event Registrations
    eventRegistrations: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch available events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/events.json');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.filter(event => event.isOngoing)); // Only show ongoing events
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const steps = [
    { id: 1, title: 'Organization Info', icon: FiUser },
    { id: 2, title: 'Address & Locations', icon: FiMapPin },
    { id: 3, title: 'Legal Documents', icon: FiFileText },
    { id: 4, title: 'Organization Details', icon: FiUsers },
    { id: 5, title: 'Financial Info', icon: FiDollarSign },
    { id: 6, title: 'Leadership', icon: FiAward },
    { id: 7, title: 'Programs & Contact', icon: FiUser },
    { id: 8, title: 'Crisis Registration', icon: FiCalendar }
  ];

  const organizationTypes = [
    { value: 'international_ngo', label: 'International NGO' },
    { value: 'child_welfare_ngo', label: 'Child Welfare NGO' },
    { value: 'disaster_relief', label: 'Disaster Relief Organization' },
    { value: 'healthcare_ngo', label: 'Healthcare NGO' },
    { value: 'education_ngo', label: 'Education NGO' },
    { value: 'environmental_ngo', label: 'Environmental NGO' },
    { value: 'human_rights_ngo', label: 'Human Rights Organization' }
  ];

  const serviceOptions = [
    'emergency_shelter', 'food_distribution', 'medical_assistance', 'water_purification',
    'child_safe_spaces', 'psychological_support', 'family_reunification', 'education_in_emergencies',
    'shelter_construction', 'education_programs', 'livelihood_support', 'early_warning_systems',
    'evacuation_support', 'post_disaster_relief'
  ];

  const handleInputChange = (section, field, value, subField = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (subField) {
        newData[section][field][subField] = value;
      } else {
        newData[section][field] = value;
      }
      return newData;
    });
  };

  const handleArrayAdd = (section, field, newItem) => {
    setFormData(prev => {
      if (section === '') {
        // Handle root level arrays like eventRegistrations, contactPersons, programs
        return {
          ...prev,
          [field]: [...(prev[field] || []), newItem]
        };
      } else {
        // Handle nested arrays
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: [...(prev[section][field] || []), newItem]
          }
        };
      }
    });
  };

  const handleArrayRemove = (section, field, index) => {
    setFormData(prev => {
      if (section === '') {
        // Handle root level arrays like eventRegistrations, contactPersons, programs
        return {
          ...prev,
          [field]: (prev[field] || []).filter((_, i) => i !== index)
        };
      } else {
        // Handle nested arrays
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: (prev[section][field] || []).filter((_, i) => i !== index)
          }
        };
      }
    });
  };

  const handleFileUpload = (section, field, file, subField = null) => {
    // Create a preview URL for the file
    const fileUrl = URL.createObjectURL(file);
    const fileData = {
      file: file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      previewUrl: fileUrl
    };
    
    if (subField) {
      handleInputChange(section, field, fileData, subField);
    } else {
      handleInputChange(section, field, fileData);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.organizationInfo.legalName) newErrors.legalName = 'Legal name is required';
        if (!formData.organizationInfo.commonName) newErrors.commonName = 'Common name is required';
        if (!formData.organizationInfo.email) newErrors.email = 'Email is required';
        if (!formData.organizationInfo.password) newErrors.password = 'Password is required';
        if (formData.organizationInfo.password && formData.organizationInfo.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        break;
      case 2:
        if (!formData.addressInfo.headquarters.city) newErrors.city = 'City is required';
        if (!formData.addressInfo.headquarters.country) newErrors.country = 'Country is required';
        break;
      // Add more validation as needed
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Generate a unique ID
      const organizationId = `NGO${Date.now().toString().slice(-6)}`;
      
      const registrationData = {
        _id: organizationId,
        ...formData,
        registrationStatus: {
          platformRegistrationDate: new Date().toISOString().split('T')[0],
          verificationStatus: 'pending',
          approvalStatus: 'pending',
          isActive: false,
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      };

      // In a real app, you would send this to your backend
      console.log('Registration Data:', registrationData);
      
      alert('Registration submitted successfully! You will receive an email confirmation shortly.');
      
      // Reset form
      setCurrentStep(1);
      setFormData({
        organizationInfo: {
          legalName: '',
          commonName: '',
          acronym: '',
          organizationType: '',
          registrationNumber: '',
          taxId: '',
          establishedDate: '',
          website: '',
          email: '',
          phone: '',
          password: '',
          logo: null
        },
        addressInfo: {
          headquarters: { street: '', city: '', state: '', zipCode: '', country: '' },
          operationalRegions: [],
          fieldOffices: []
        },
        legalDocumentation: {
          incorporationCertificate: { documentNumber: '', issueDate: '', issuingAuthority: '', imageUrl: null },
          taxExemptStatus: { status: '', documentNumber: '', issueDate: '', issuingAuthority: '', imageUrl: null },
          operatingLicense: { licenseNumber: '', issueDate: '', expiryDate: '', issuingAuthority: '', imageUrl: null },
          auditReports: []
        },
        organizationDetails: {
          mission: '',
          vision: '',
          focusAreas: [],
          targetBeneficiaries: [],
          operationalCapacity: { staffCount: '', volunteersCount: '', emergencyResponseTeams: '', logisticalCapacity: '', mobilizationTime: '' }
        },
        financialInformation: {
          annualBudget: { year: new Date().getFullYear(), totalBudget: '', programExpenses: '', administrativeExpenses: '', fundraisingExpenses: '', programEfficiencyRatio: '' },
          fundingSources: []
        },
        leadership: {
          executiveDirector: { name: '', position: '', email: '', phone: '', bio: '', linkedIn: '', photo: null }
        },
        programs: [],
        contactPersons: [],
        eventRegistrations: []
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Organization Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Name *
                </label>
                <input
                  type="text"
                  value={formData.organizationInfo.legalName}
                  onChange={(e) => handleInputChange('organizationInfo', 'legalName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter legal name"
                />
                {errors.legalName && <p className="text-red-500 text-sm mt-1">{errors.legalName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Common Name *
                </label>
                <input
                  type="text"
                  value={formData.organizationInfo.commonName}
                  onChange={(e) => handleInputChange('organizationInfo', 'commonName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter common name"
                />
                {errors.commonName && <p className="text-red-500 text-sm mt-1">{errors.commonName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acronym
                </label>
                <input
                  type="text"
                  value={formData.organizationInfo.acronym}
                  onChange={(e) => handleInputChange('organizationInfo', 'acronym', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., GRF"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type
                </label>
                <select
                  value={formData.organizationInfo.organizationType}
                  onChange={(e) => handleInputChange('organizationInfo', 'organizationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select organization type</option>
                  {organizationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={formData.organizationInfo.registrationNumber}
                  onChange={(e) => handleInputChange('organizationInfo', 'registrationNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Official registration number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID
                </label>
                <input
                  type="text"
                  value={formData.organizationInfo.taxId}
                  onChange={(e) => handleInputChange('organizationInfo', 'taxId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tax identification number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Date
                </label>
                <input
                  type="date"
                  value={formData.organizationInfo.establishedDate}
                  onChange={(e) => handleInputChange('organizationInfo', 'establishedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.organizationInfo.website}
                  onChange={(e) => handleInputChange('organizationInfo', 'website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.org"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.organizationInfo.email}
                  onChange={(e) => handleInputChange('organizationInfo', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="contact@organization.org"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.organizationInfo.phone}
                  onChange={(e) => handleInputChange('organizationInfo', 'phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+1-555-0100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.organizationInfo.password}
                  onChange={(e) => handleInputChange('organizationInfo', 'password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter a secure password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.organizationInfo.logo ? (
                  <div className="space-y-3">
                    {formData.organizationInfo.logo.fileType?.startsWith('image/') ? (
                      <img 
                        src={formData.organizationInfo.logo.previewUrl} 
                        alt="Logo preview" 
                        className="max-h-32 mx-auto rounded"
                      />
                    ) : (
                      <div className="flex items-center justify-center">
                        <FiFileText className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <p className="text-sm text-gray-600">
                      {formData.organizationInfo.logo.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(formData.organizationInfo.logo.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => handleInputChange('organizationInfo', 'logo', null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files[0] && handleFileUpload('organizationInfo', 'logo', e.target.files[0])}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer text-primary hover:text-primary-dark block mt-2">
                  {formData.organizationInfo.logo ? 'Change File' : 'Choose File'}
                </label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Address & Locations</h3>
            
            <div>
              <h4 className="text-lg font-medium mb-3">Headquarters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.addressInfo.headquarters.street}
                    onChange={(e) => handleInputChange('addressInfo', 'headquarters', e.target.value, 'street')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.addressInfo.headquarters.city}
                    onChange={(e) => handleInputChange('addressInfo', 'headquarters', e.target.value, 'city')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="New York"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input
                    type="text"
                    value={formData.addressInfo.headquarters.state}
                    onChange={(e) => handleInputChange('addressInfo', 'headquarters', e.target.value, 'state')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                  <input
                    type="text"
                    value={formData.addressInfo.headquarters.zipCode}
                    onChange={(e) => handleInputChange('addressInfo', 'headquarters', e.target.value, 'zipCode')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    value={formData.addressInfo.headquarters.country}
                    onChange={(e) => handleInputChange('addressInfo', 'headquarters', e.target.value, 'country')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="USA"
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Legal Documentation</h3>
            
            {/* Incorporation Certificate */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3">Incorporation Certificate</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Number</label>
                  <input
                    type="text"
                    value={formData.legalDocumentation.incorporationCertificate.documentNumber}
                    onChange={(e) => handleInputChange('legalDocumentation', 'incorporationCertificate', e.target.value, 'documentNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Certificate number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                  <input
                    type="date"
                    value={formData.legalDocumentation.incorporationCertificate.issueDate}
                    onChange={(e) => handleInputChange('legalDocumentation', 'incorporationCertificate', e.target.value, 'issueDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Authority</label>
                  <input
                    type="text"
                    value={formData.legalDocumentation.incorporationCertificate.issuingAuthority}
                    onChange={(e) => handleInputChange('legalDocumentation', 'incorporationCertificate', e.target.value, 'issuingAuthority')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Government authority"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Upload</label>
                  {formData.legalDocumentation.incorporationCertificate.imageUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FiFileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {formData.legalDocumentation.incorporationCertificate.imageUrl.fileName}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleInputChange('legalDocumentation', 'incorporationCertificate', null, 'imageUrl')}
                          className="text-red-500 hover:text-red-700 ml-auto"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleFileUpload('legalDocumentation', 'incorporationCertificate', e.target.files[0], 'imageUrl')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Tax Exempt Status */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3">Tax Exempt Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.legalDocumentation.taxExemptStatus.status}
                    onChange={(e) => handleInputChange('legalDocumentation', 'taxExemptStatus', e.target.value, 'status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="501c3">501(c)(3)</option>
                    <option value="charity">Registered Charity</option>
                    <option value="ngo">NGO Registration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Number</label>
                  <input
                    type="text"
                    value={formData.legalDocumentation.taxExemptStatus.documentNumber}
                    onChange={(e) => handleInputChange('legalDocumentation', 'taxExemptStatus', e.target.value, 'documentNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tax exemption number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                  <input
                    type="date"
                    value={formData.legalDocumentation.taxExemptStatus.issueDate}
                    onChange={(e) => handleInputChange('legalDocumentation', 'taxExemptStatus', e.target.value, 'issueDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Upload</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleFileUpload('legalDocumentation', 'taxExemptStatus', e.target.files[0], 'imageUrl')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Operating License */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3">Operating License</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <input
                    type="text"
                    value={formData.legalDocumentation.operatingLicense.licenseNumber}
                    onChange={(e) => handleInputChange('legalDocumentation', 'operatingLicense', e.target.value, 'licenseNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="License number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                  <input
                    type="date"
                    value={formData.legalDocumentation.operatingLicense.issueDate}
                    onChange={(e) => handleInputChange('legalDocumentation', 'operatingLicense', e.target.value, 'issueDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.legalDocumentation.operatingLicense.expiryDate}
                    onChange={(e) => handleInputChange('legalDocumentation', 'operatingLicense', e.target.value, 'expiryDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Upload</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files[0] && handleFileUpload('legalDocumentation', 'operatingLicense', e.target.files[0], 'imageUrl')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Organization Details</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement *</label>
                <textarea
                  value={formData.organizationDetails.mission}
                  onChange={(e) => handleInputChange('organizationDetails', 'mission', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe your organization's mission..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vision Statement</label>
                <textarea
                  value={formData.organizationDetails.vision}
                  onChange={(e) => handleInputChange('organizationDetails', 'vision', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe your organization's vision..."
                />
              </div>
            </div>

            {/* Operational Capacity */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3">Operational Capacity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff Count</label>
                  <input
                    type="number"
                    value={formData.organizationDetails.operationalCapacity.staffCount}
                    onChange={(e) => handleInputChange('organizationDetails', 'operationalCapacity', e.target.value, 'staffCount')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Number of staff members"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volunteers Count</label>
                  <input
                    type="number"
                    value={formData.organizationDetails.operationalCapacity.volunteersCount}
                    onChange={(e) => handleInputChange('organizationDetails', 'operationalCapacity', e.target.value, 'volunteersCount')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Number of volunteers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Response Teams</label>
                  <input
                    type="number"
                    value={formData.organizationDetails.operationalCapacity.emergencyResponseTeams}
                    onChange={(e) => handleInputChange('organizationDetails', 'operationalCapacity', e.target.value, 'emergencyResponseTeams')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Number of response teams"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobilization Time</label>
                  <select
                    value={formData.organizationDetails.operationalCapacity.mobilizationTime}
                    onChange={(e) => handleInputChange('organizationDetails', 'operationalCapacity', e.target.value, 'mobilizationTime')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select mobilization time</option>
                    <option value="12_hours">12 Hours</option>
                    <option value="24_hours">24 Hours</option>
                    <option value="48_hours">48 Hours</option>
                    <option value="72_hours">72 Hours</option>
                    <option value="1_week">1 Week</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Financial Information</h3>
            
            {/* Annual Budget */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3">Annual Budget</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Year</label>
                  <input
                    type="number"
                    value={formData.financialInformation.annualBudget.year}
                    onChange={(e) => handleInputChange('financialInformation', 'annualBudget', parseInt(e.target.value), 'year')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget ($)</label>
                  <input
                    type="number"
                    value={formData.financialInformation.annualBudget.totalBudget}
                    onChange={(e) => handleInputChange('financialInformation', 'annualBudget', parseInt(e.target.value), 'totalBudget')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Total annual budget"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Expenses ($)</label>
                  <input
                    type="number"
                    value={formData.financialInformation.annualBudget.programExpenses}
                    onChange={(e) => handleInputChange('financialInformation', 'annualBudget', parseInt(e.target.value), 'programExpenses')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Amount spent on programs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Administrative Expenses ($)</label>
                  <input
                    type="number"
                    value={formData.financialInformation.annualBudget.administrativeExpenses}
                    onChange={(e) => handleInputChange('financialInformation', 'annualBudget', parseInt(e.target.value), 'administrativeExpenses')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Administrative costs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fundraising Expenses ($)</label>
                  <input
                    type="number"
                    value={formData.financialInformation.annualBudget.fundraisingExpenses}
                    onChange={(e) => handleInputChange('financialInformation', 'annualBudget', parseInt(e.target.value), 'fundraisingExpenses')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Fundraising costs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Program Efficiency Ratio (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    max="100"
                    value={formData.financialInformation.annualBudget.programEfficiencyRatio}
                    onChange={(e) => handleInputChange('financialInformation', 'annualBudget', parseFloat(e.target.value), 'programEfficiencyRatio')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Percentage of budget for programs"
                  />
                </div>
              </div>
            </div>

            {/* Funding Sources */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3">Funding Sources</h4>
              <div className="space-y-4">
                {formData.financialInformation.fundingSources.map((source, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 border rounded">
                    <input
                      type="text"
                      value={source.source}
                      onChange={(e) => {
                        const updatedSources = [...formData.financialInformation.fundingSources];
                        updatedSources[index].source = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          financialInformation: {
                            ...prev.financialInformation,
                            fundingSources: updatedSources
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Funding source"
                    />
                    <input
                      type="number"
                      value={source.percentage}
                      onChange={(e) => {
                        const updatedSources = [...formData.financialInformation.fundingSources];
                        updatedSources[index].percentage = parseInt(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          financialInformation: {
                            ...prev.financialInformation,
                            fundingSources: updatedSources
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Percentage"
                    />
                    <input
                      type="number"
                      value={source.amount}
                      onChange={(e) => {
                        const updatedSources = [...formData.financialInformation.fundingSources];
                        updatedSources[index].amount = parseInt(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          financialInformation: {
                            ...prev.financialInformation,
                            fundingSources: updatedSources
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Amount ($)"
                    />
                    <button
                      onClick={() => handleArrayRemove('financialInformation', 'fundingSources', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleArrayAdd('financialInformation', 'fundingSources', { source: '', percentage: '', amount: '' })}
                  className="flex items-center gap-2 text-primary hover:text-primary-dark"
                >
                  <FiPlus className="h-4 w-4" />
                  Add Funding Source
                </button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Leadership Information</h3>
            
            {/* Executive Director */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3">Executive Director</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.leadership.executiveDirector.name}
                    onChange={(e) => handleInputChange('leadership', 'executiveDirector', e.target.value, 'name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={formData.leadership.executiveDirector.position}
                    onChange={(e) => handleInputChange('leadership', 'executiveDirector', e.target.value, 'position')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Executive Director"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.leadership.executiveDirector.email}
                    onChange={(e) => handleInputChange('leadership', 'executiveDirector', e.target.value, 'email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="director@organization.org"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.leadership.executiveDirector.phone}
                    onChange={(e) => handleInputChange('leadership', 'executiveDirector', e.target.value, 'phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+1-555-0100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.leadership.executiveDirector.linkedIn}
                    onChange={(e) => handleInputChange('leadership', 'executiveDirector', e.target.value, 'linkedIn')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload('leadership', 'executiveDirector', e.target.files[0], 'photo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
                  <textarea
                    value={formData.leadership.executiveDirector.bio}
                    onChange={(e) => handleInputChange('leadership', 'executiveDirector', e.target.value, 'bio')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Brief biography and experience..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Persons */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3">Contact Persons</h4>
              <div className="space-y-4">
                {formData.contactPersons.map((contact, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3 border rounded">
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => {
                        const updatedContacts = [...formData.contactPersons];
                        updatedContacts[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, contactPersons: updatedContacts }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Full name"
                    />
                    <input
                      type="text"
                      value={contact.position}
                      onChange={(e) => {
                        const updatedContacts = [...formData.contactPersons];
                        updatedContacts[index].position = e.target.value;
                        setFormData(prev => ({ ...prev, contactPersons: updatedContacts }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Position"
                    />
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => {
                        const updatedContacts = [...formData.contactPersons];
                        updatedContacts[index].email = e.target.value;
                        setFormData(prev => ({ ...prev, contactPersons: updatedContacts }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => {
                        const updatedContacts = [...formData.contactPersons];
                        updatedContacts[index].phone = e.target.value;
                        setFormData(prev => ({ ...prev, contactPersons: updatedContacts }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Phone"
                    />
                    <button
                      onClick={() => handleArrayRemove('', 'contactPersons', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleArrayAdd('', 'contactPersons', { name: '', position: '', email: '', phone: '', role: 'contact' })}
                  className="flex items-center gap-2 text-primary hover:text-primary-dark"
                >
                  <FiPlus className="h-4 w-4" />
                  Add Contact Person
                </button>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Programs & Additional Info</h3>
            
            {/* Programs */}
            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3">Current Programs</h4>
              <div className="space-y-4">
                {formData.programs.map((program, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={program.name}
                        onChange={(e) => {
                          const updatedPrograms = [...formData.programs];
                          updatedPrograms[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, programs: updatedPrograms }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Program name"
                      />
                      <select
                        value={program.category}
                        onChange={(e) => {
                          const updatedPrograms = [...formData.programs];
                          updatedPrograms[index].category = e.target.value;
                          setFormData(prev => ({ ...prev, programs: updatedPrograms }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        <option value="disaster_relief">Disaster Relief</option>
                        <option value="child_protection">Child Protection</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                        <option value="community_development">Community Development</option>
                      </select>
                      <input
                        type="number"
                        value={program.budget}
                        onChange={(e) => {
                          const updatedPrograms = [...formData.programs];
                          updatedPrograms[index].budget = parseInt(e.target.value);
                          setFormData(prev => ({ ...prev, programs: updatedPrograms }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Budget ($)"
                      />
                      <input
                        type="number"
                        value={program.beneficiariesReached}
                        onChange={(e) => {
                          const updatedPrograms = [...formData.programs];
                          updatedPrograms[index].beneficiariesReached = parseInt(e.target.value);
                          setFormData(prev => ({ ...prev, programs: updatedPrograms }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="People reached"
                      />
                    </div>
                    <textarea
                      value={program.description}
                      onChange={(e) => {
                        const updatedPrograms = [...formData.programs];
                        updatedPrograms[index].description = e.target.value;
                        setFormData(prev => ({ ...prev, programs: updatedPrograms }));
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Program description..."
                    />
                    <button
                      onClick={() => handleArrayRemove('', 'programs', index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Program
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleArrayAdd('', 'programs', { 
                    programId: `PROG${Date.now()}`,
                    name: '', 
                    description: '', 
                    category: '', 
                    budget: '', 
                    beneficiariesReached: '',
                    status: 'active'
                  })}
                  className="flex items-center gap-2 text-primary hover:text-primary-dark"
                >
                  <FiPlus className="h-4 w-4" />
                  Add Program
                </button>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Crisis Registration</h3>
            <p className="text-gray-600 mb-6">
              Select the ongoing crises you want to register for and provide details about your organization's response capabilities.
            </p>
            
            {events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No ongoing crises available for registration at this time.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map(event => {
                  const isRegistered = formData.eventRegistrations?.some(reg => reg.eventId === event._id) || false;
                  
                  return (
                    <div key={event._id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FiMapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiUsers className="h-4 w-4" />
                              {event.estimatedAffectedPeople?.toLocaleString()} affected
                            </span>
                          </div>
                        </div>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isRegistered}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newRegistration = {
                                  eventId: event._id,
                                  eventTitle: event.title,
                                  registrationDate: new Date().toISOString().split('T')[0],
                                  status: 'active',
                                  role: 'supporting_organization',
                                  servicesOffered: [],
                                  estimatedBudgetAllocated: '',
                                  expectedBeneficiaries: '',
                                  responseTime: '48_hours',
                                  notes: ''
                                };
                                handleArrayAdd('', 'eventRegistrations', newRegistration);
                              } else {
                                const index = formData.eventRegistrations?.findIndex(reg => reg.eventId === event._id) ?? -1;
                                if (index !== -1) {
                                  handleArrayRemove('', 'eventRegistrations', index);
                                }
                              }
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {isRegistered ? 'Registered' : 'Register'}
                          </span>
                        </label>
                      </div>
                      
                      {isRegistered && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role in Response
                              </label>
                              <select
                                value={formData.eventRegistrations?.find(reg => reg.eventId === event._id)?.role || ''}
                                onChange={(e) => {
                                  const updatedRegistrations = formData.eventRegistrations?.map(reg => 
                                    reg.eventId === event._id ? { ...reg, role: e.target.value } : reg
                                  ) || [];
                                  setFormData(prev => ({ ...prev, eventRegistrations: updatedRegistrations }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="primary_responder">Primary Responder</option>
                                <option value="supporting_organization">Supporting Organization</option>
                                <option value="child_protection_specialist">Child Protection Specialist</option>
                                <option value="emergency_responder">Emergency Responder</option>
                                <option value="logistics_coordinator">Logistics Coordinator</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Response Time
                              </label>
                              <select
                                value={formData.eventRegistrations?.find(reg => reg.eventId === event._id)?.responseTime || ''}
                                onChange={(e) => {
                                  const updatedRegistrations = formData.eventRegistrations?.map(reg => 
                                    reg.eventId === event._id ? { ...reg, responseTime: e.target.value } : reg
                                  ) || [];
                                  setFormData(prev => ({ ...prev, eventRegistrations: updatedRegistrations }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="12_hours">12 Hours</option>
                                <option value="24_hours">24 Hours</option>
                                <option value="48_hours">48 Hours</option>
                                <option value="72_hours">72 Hours</option>
                                <option value="1_week">1 Week</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estimated Budget Allocated ($)
                              </label>
                              <input
                                type="number"
                                value={formData.eventRegistrations?.find(reg => reg.eventId === event._id)?.estimatedBudgetAllocated || ''}
                                onChange={(e) => {
                                  const updatedRegistrations = formData.eventRegistrations?.map(reg => 
                                    reg.eventId === event._id ? { ...reg, estimatedBudgetAllocated: parseInt(e.target.value) || 0 } : reg
                                  ) || [];
                                  setFormData(prev => ({ ...prev, eventRegistrations: updatedRegistrations }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter budget amount"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expected Beneficiaries
                              </label>
                              <input
                                type="number"
                                value={formData.eventRegistrations?.find(reg => reg.eventId === event._id)?.expectedBeneficiaries || ''}
                                onChange={(e) => {
                                  const updatedRegistrations = formData.eventRegistrations?.map(reg => 
                                    reg.eventId === event._id ? { ...reg, expectedBeneficiaries: parseInt(e.target.value) || 0 } : reg
                                  ) || [];
                                  setFormData(prev => ({ ...prev, eventRegistrations: updatedRegistrations }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Number of people to be helped"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Services Offered
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {serviceOptions.map(service => {
                                const currentRegistration = formData.eventRegistrations?.find(reg => reg.eventId === event._id);
                                const isServiceSelected = currentRegistration?.servicesOffered?.includes(service);
                                
                                return (
                                  <label key={service} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={isServiceSelected || false}
                                      onChange={(e) => {
                                        const updatedRegistrations = formData.eventRegistrations?.map(reg => {
                                          if (reg.eventId === event._id) {
                                            const services = reg.servicesOffered || [];
                                            if (e.target.checked) {
                                              return { ...reg, servicesOffered: [...services, service] };
                                            } else {
                                              return { ...reg, servicesOffered: services.filter(s => s !== service) };
                                            }
                                          }
                                          return reg;
                                        }) || [];
                                        setFormData(prev => ({ ...prev, eventRegistrations: updatedRegistrations }));
                                      }}
                                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                      {service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Additional Notes
                            </label>
                            <textarea
                              value={formData.eventRegistrations.find(reg => reg.eventId === event._id)?.notes || ''}
                              onChange={(e) => {
                                const updatedRegistrations = formData.eventRegistrations.map(reg => 
                                  reg.eventId === event._id ? { ...reg, notes: e.target.value } : reg
                                );
                                setFormData(prev => ({ ...prev, eventRegistrations: updatedRegistrations }));
                              }}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Provide additional details about your response plan..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Step content coming soon...</p>
            <p className="text-sm text-gray-400 mt-2">This step is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Registration</h1>
          <p className="text-gray-600">Join our platform to help communities in need</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-primary bg-primary text-white' :
                    isCompleted ? 'border-green-500 bg-green-500 text-white' :
                    'border-gray-300 bg-white text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <FiCheck className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map(step => (
              <div key={step.id} className="text-xs text-center" style={{ width: '120px' }}>
                <span className={currentStep === step.id ? 'text-primary font-medium' : 'text-gray-500'}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowLeft className="h-4 w-4" />
            Previous
          </button>
          
          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4" />
                  Submit Registration
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium"
            >
              Next
              <FiArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
