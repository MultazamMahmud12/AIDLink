const Event = require('./event.model');

const sampleEvents = [
  {
    title: "Feni Flood Crisis",
    description: "Severe flooding in Feni district causing widespread displacement and damage to homes, crops, and infrastructure.",
    category: "natural_disaster",
    isOngoing: true,
    estimatedAffectedPeople: 250000,
    severity: "critical",
    location: "Feni District, Bangladesh",
    startDate: new Date("2024-08-15"),
    coverImage: {
      url: "https://res.cloudinary.com/dqxcgemok/image/upload/v1754848445/rohingya-crisis_nc90ww.jpg",
      publicId: "sample_feni_flood",
      originalName: "feni-flood.jpg",
      uploadedAt: new Date()
    },
    urgencyLevel: "high",
    fundingGoal: 500000,
    currentFunding: 125000,
    images: [
      {
        url: "https://res.cloudinary.com/demo/image/upload/v1234567890/sample1.jpg",
        publicId: "sample_feni_1",
        originalName: "feni-damage-1.jpg",
        uploadedAt: new Date(),
        caption: "Flooded homes in Feni district"
      }
    ]
  },
  {
    title: "Buriganga Water Pollution Crisis",
    description: "Severe water pollution in Buriganga River affecting millions of people's access to clean water and threatening aquatic life.",
    category: "environmental",
    isOngoing: true,
    estimatedAffectedPeople: 2000000,
    severity: "critical",
    location: "Dhaka, Bangladesh",
    startDate: new Date("2020-01-01"),
    coverImage: {
      url: "https://res.cloudinary.com/dqxcgemok/image/upload/v1754848445/buriganga-pollution_uqr86j.jpg",
      publicId: "sample_buriganga",
      originalName: "buriganga-pollution.jpg",
      uploadedAt: new Date()
    },
    urgencyLevel: "high",
    fundingGoal: 1000000,
    currentFunding: 350000,
    images: []
  },
  {
    title: "Cyclone Mocha Emergency",
    description: "Devastating cyclone causing massive destruction along the coastal areas, leaving thousands homeless.",
    category: "natural_disaster",
    isOngoing: false,
    estimatedAffectedPeople: 500000,
    severity: "severe",
    location: "Cox's Bazar, Bangladesh",
    startDate: new Date("2023-05-14"),
    endDate: new Date("2023-05-16"),
    coverImage: {
      url: "https://res.cloudinary.com/dqxcgemok/image/upload/v1754848445/cyclone-mocha_oe4rkp.jpg",
      publicId: "sample_cyclone_mocha",
      originalName: "cyclone-mocha.jpg",
      uploadedAt: new Date()
    },
    urgencyLevel: "medium",
    fundingGoal: 750000,
    currentFunding: 680000,
    images: []
  },
  {
    title: "Rohingya Refugee Crisis",
    description: "Ongoing humanitarian crisis with hundreds of thousands of refugees requiring food, shelter, and medical assistance.",
    category: "humanitarian",
    isOngoing: true,
    estimatedAffectedPeople: 900000,
    severity: "critical",
    location: "Cox's Bazar, Bangladesh",
    startDate: new Date("2017-08-25"),
    coverImage: {
      url: "https://res.cloudinary.com/dqxcgemok/image/upload/v1754848445/rohingya-crisis_nc90ww.jpg",
      publicId: "sample_rohingya",
      originalName: "rohingya-crisis.jpg",
      uploadedAt: new Date()
    },
    urgencyLevel: "high",
    fundingGoal: 2000000,
    currentFunding: 1200000,
    images: []
  },
  {
    title: "Sylhet Flash Floods",
    description: "Unprecedented flash flooding affecting millions in Sylhet division, destroying crops and displacing families.",
    category: "natural_disaster",
    isOngoing: false,
    estimatedAffectedPeople: 3000000,
    severity: "severe",
    location: "Sylhet Division, Bangladesh",
    startDate: new Date("2022-06-15"),
    endDate: new Date("2022-07-30"),
    coverImage: {
      url: "https://res.cloudinary.com/dqxcgemok/image/upload/v1754848445/sylhet-floods_rmuhz4.jpg",
      publicId: "sample_sylhet_floods",
      originalName: "sylhet-floods.jpg",
      uploadedAt: new Date()
    },
    urgencyLevel: "medium",
    fundingGoal: 800000,
    currentFunding: 750000,
    images: []
  },
  {
    title: "Old Dhaka Fire Incident",
    description: "Major fire outbreak in old Dhaka affecting hundreds of families and destroying historical buildings.",
    category: "fire_emergency",
    isOngoing: false,
    estimatedAffectedPeople: 15000,
    severity: "moderate",
    location: "Old Dhaka, Bangladesh",
    startDate: new Date("2024-02-10"),
    endDate: new Date("2024-02-12"),
    coverImage: {
      url: "https://res.cloudinary.com/dqxcgemok/image/upload/v1754848445/dhaka-fire_yn0pcq.jpg",
      publicId: "sample_dhaka_fire",
      originalName: "dhaka-fire.jpg",
      uploadedAt: new Date()
    },
    urgencyLevel: "low",
    fundingGoal: 200000,
    currentFunding: 180000,
    images: []
  }
];

const seedEvents = async () => {
  try {
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert sample events
    const events = await Event.insertMany(sampleEvents);
    console.log(`Inserted ${events.length} sample events`);
    
    return events;
  } catch (error) {
    console.error('Error seeding events:', error);
    throw error;
  }
};

module.exports = { seedEvents, sampleEvents };
