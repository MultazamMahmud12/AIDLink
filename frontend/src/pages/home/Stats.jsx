const Stats = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Stats */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
              More than 35 lakhs tk is raised
            </h3>
            <p className="text-lg text-gray-text">
              every week on AIDLink.*
            </p>
          </div>
          
          {/* Description */}
          <div>
            <p className="text-lg text-gray-text leading-relaxed">
              Get started in just a few minutes – with helpful new tools, 
              it's easier than ever to pick the perfect title, write a 
              compelling story, and share it with the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
