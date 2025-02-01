import image from '../../assets/images/a6e5e0ad-faaf-4878-a343-13ffaa6f0a09.jpg'
const AboutUs = () => {
  return (
    <section id="about" className="bg-gray-100 py-24 px-6 lg:px-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
        {/* Image Section */}
        <div data-aos="fade-right" data-aos-duration="1500" className="justify-center max-w-96 min-h-96 hidden lg:block">
          <img
            src={image}
            alt="Sports Event"
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>

        {/* Text Section */}
        <div data-aos="fade-left" data-aos-duration="1500" className="text-center md:text-left col-span-2">
          <h2 className=" text-2xl 2xmobile:text-4xl font-bold text-blue-600 mb-6">About Us</h2>
          <p className="2xmobile:text-xl text-gray-700 leading-relaxed mb-8">
            At Sweet Spot, we are passionate about bringing sports lovers together through unforgettable events.
            We focus on delivering exceptional experiences with seamless organization and vibrant atmospheres that
            leave lasting memories.
          </p>
          <h3 className="text-xl 2xmobile:text-2xl font-semibold text-blue-600 mb-4">
            Our Goal and Vision
          </h3>
          <p className="2xmobile:text-lg text-gray-700 leading-relaxed mb-6">
            Our mission is to encourage both youth and adults to actively engage in sports, nurturing their hobbies
            in a competitive yet supportive environment.
            We believe that sports have the power to bring communities together and foster a healthy, active lifestyle.
            Our current focus is on organizing Padel events, aiming to promote this exciting and growing sport to a wider
            audience.
          </p>
          <p className="2xmobile:text-xl font-bold text-gray-800">
            Current Targeting: Padel Events
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;