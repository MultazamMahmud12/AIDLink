// Import event images
import feniFlood from '../assets/events/feni-flood.jpg';
import burigangaPollution from '../assets/events/buriganga-pollution.jpg';
import cycloneMocha from '../assets/events/cyclone-mocha.jpg';
import rohingyaCrisis from '../assets/events/rohingya-crisis.jpg';
import sylhetFloods from '../assets/events/sylhet-floods.jpg';
import dhakaFire from '../assets/events/dhaka-fire.jpg';

// Import fallback images from general assets
import handsImg from '../assets/hands.jpg';
import healthImg from '../assets/HealthCause.jpg';
import oldPeopleImg from '../assets/Oldpeople.jpg';
import foodImg from '../assets/food.jpg';
import crisisImg from '../assets/crisis.jpeg';
import emergencyImg from '../assets/emergency.jpg';

// Utility function to get image URL for events
const getImgUrl = (imageName) => {
  const imageMap = {
    'feni-flood.jpg': feniFlood,
    'buriganga-pollution.jpg': burigangaPollution,
    'cyclone-mocha.jpg': cycloneMocha,
    'rohingya-crisis.jpg': rohingyaCrisis,
    'sylhet-floods.jpg': sylhetFloods,
    'dhaka-fire.jpg': dhakaFire,
    'rangpur-drought.jpg': crisisImg,
    'cht-landslide.jpg': emergencyImg,
    'coastal-erosion.jpg': crisisImg,
    'slum-health.jpg': healthImg,
    'sundarbans-spill.jpg': emergencyImg,
    'cold-wave.jpg': oldPeopleImg,
    'factory-fire.jpg': emergencyImg,
    'education-crisis.jpg': foodImg,
    'arsenic-crisis.jpg': healthImg,
    'bridge-collapse.jpg': emergencyImg,
    'elderly-care.jpg': oldPeopleImg,
    'street-children.jpg': handsImg,
    'disability-support.jpg': oldPeopleImg,
    'mental-health.jpg': healthImg
  };
  
  // Return the mapped image or a default image
  return imageMap[imageName] || handsImg;
};

export default getImgUrl;
