import Banner from './Banner';
import Stats from './Stats';
import News from './News';

const Home = () => {
  return (
    <div>
      <Banner />
      <Stats />
      <News />
      {/* Additional home page sections can be added here */}
    </div>
  );
};

export default Home;
