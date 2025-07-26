import { Link } from 'react-router';
import foodImg from '../../assets/food.jpg';
import handsImg from '../../assets/hands.jpg';
import healthImg from '../../assets/HealthCause.jpg';
import oldPeopleImg from '../../assets/Oldpeople.jpg';
import crisisImg from '../../assets/crisis.jpeg';
import emergencyImg from '../../assets/emergency.jpg';

const Banner = () => {
  const categories = [
    {
      id: 1,
      name: 'Food',
      image: foodImg,
      position: 'top-left',
      style: 'top-32 left-24'
    },
    {
      id: 2,
      name: 'Health',
      image: healthImg,
      position: 'top-right',
      style: 'top-20 right-32'
    },
    {
      id: 3,
      name: 'Crisis',
      image: crisisImg,
      position: 'bottom-left',
      style: 'bottom-32 left-16'
    },
    {
      id: 4,
      name: 'Elderly Care',
      image: oldPeopleImg,
      position: 'middle-left',
      style: 'top-1/2 left-8 transform -translate-y-1/2'
    },
    {
      id: 5,
      name: 'Community',
      image: handsImg,
      position: 'bottom-right',
      style: 'bottom-20 right-16'
    },
    {
      id: 6,
      name: 'Emergency',
      image: emergencyImg,
      position: 'middle-right',
      style: 'top-1/2 right-8 transform -translate-y-1/2'
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-bg-light via-white to-gray-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Floating category circles */}
      {categories.map((category, index) => (
        <div
          key={category.id}
          className={`absolute hidden lg:block ${category.style}`}
          style={{
            animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
            animationDelay: `${index * 0.3}s`
          }}
        >
          <div className="relative group cursor-pointer">
            {/* Green ring */}
            <div className="w-32 h-32 rounded-full border-4 border-primary p-2 bg-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              {/* Image container */}
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Category label */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-text shadow-md">
                {category.name}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight">
            Successful
            <br />
            <span className="text-gray-800">fundraisers</span>
            <br />
            <span className="text-gray-700">start here</span>
          </h1>

          {/* CTA Button */}
          <Link
            to="/events"
            className="inline-flex items-center bg-primary-dark hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            
            Donate Now
          </Link>
        </div>
      </div>

      {/* Note: Floating animation is defined in App.css */}
    </section>
  );
};

export default Banner;
