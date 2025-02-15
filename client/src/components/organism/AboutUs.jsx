import image from '../../assets/images/a6e5e0ad-faaf-4878-a343-13ffaa6f0a09.jpg'
const AboutUs = () => {
  return (
    <section id="about" className="bg-gray-100 py-24 px-6 lg:px-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        {/* Image Section */}
        <div data-aos="fade-right" data-aos-duration="1500" className="justify-center max-w-96 min-h-96 hidden lg:block">
          <img
            src={image}
            alt="CTRL Event"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>

        {/* Text Section */}
        <div data-aos="fade-left" data-aos-duration="1500" className="text-center md:text-left col-span-2">
          <h2 className=" text-2xl 2xmobile:text-4xl font-bold text-blue-600 mb-6" style={{ color: "rgb(37, 150, 190)"}}>About Us</h2>
          <p className="2xmobile:text-xl text-gray-700 leading-relaxed mb-8">
            At CTRL, we are committed to empowering students in coding, technology, and robotics by providing an 
            engaging and supportive learning environment. We believe in fostering innovation, collaboration, and 
            problem-solving to prepare members for success in the ever-evolving tech landscape.
          </p>
          <h3 className="text-xl 2xmobile:text-2xl font-semibold text-blue-600 mb-4" style={{ color: "rgb(37, 150, 190)"}}>
            Our Goal and Vision
          </h3>
          <p className="2xmobile:text-lg text-gray-700 leading-relaxed mb-6">
            Our mission is to inspire and equip students with the skills and confidence to excel in programming and 
            technology. Through hands-on learning, teamwork, and real-world applications, we aim to bridge the gap 
            between education and industry. Our vision is to build a strong community of tech enthusiasts who drive 
            innovation and shape the future of technology.
          </p>
          <p className="2xmobile:text-xl font-bold text-gray-800">
            Current Targeting: CTRL Events
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;