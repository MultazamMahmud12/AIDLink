import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router";

const news = [
  {
    id: 1,
    title: "Emergency Relief Fund Launched for Flood Victims",
    description: "New initiative provides immediate assistance to communities affected by recent flooding.",
  },
  {
    id: 2,
    title: "Education Program Reaches 10,000 Children",
    description: "Our literacy program has successfully enrolled 10,000 children across rural areas.",
  },
  {
    id: 3,
    title: "Healthcare Mobile Units Expand Services",
    description: "Mobile medical units now serve 50 remote villages with essential healthcare.",
  },
  {
    id: 4,
    title: "Clean Water Project Completed in Rural Districts",
    description: "New water treatment facilities provide safe drinking water to 25,000 people.",
  },
  {
    id: 5,
    title: "Women Empowerment Workshop Series Begins",
    description: "Skill development workshops launched to support women entrepreneurs.",
  },
  {
    id: 6,
    title: "Youth Leadership Program Applications Open",
    description: "Apply now for our youth leadership development and mentorship program.",
  }
];

const News = () => {
  return (
    <div className="py-10 max-w-screen-2xl mx-auto px-4">
      <h2
        className="text-3xl font-secondary mb-6 font-bold text-center"
        style={{ color: "var(--color-text)" }}
      >
        Latest News
      </h2>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {news.map((item) => (
          <SwiperSlide key={item.id}>
           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-40">
           <Link to="/" className="block h-full">
           <h3 className="text-lg font-semibold hover:text-blue-500 mb-3 line-clamp-2"> 
             {item.title} 
           </h3>  
           <div className="w-12 h-[3px] bg-primary mb-3"></div>
           <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
           </Link>
           </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default News;
