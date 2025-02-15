import { useFormik } from "formik";
import contact from "../../assets/images/8ae7d70e-5729-46e6-9924-2a9bac677e86.jpg"
import { sendContactForm } from "../../api/endpoints/contact";
import { toast } from "react-toastify";
const ContactForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await sendContactForm(values);
        toast.success("Message sent successfully!");
        resetForm();
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error("Failed to send message. Please try again.");
      }
    },
  });

  return (
    <section id="contact" className="flex flex-col lg:flex-row gap-16 mt-20 pb-14 px-4 w-full">
      <div data-aos="fade-right" data-aos-duration="1500" className="flex-1 relative overflow-hidden rounded-3xl group">
        <div className=" absolute w-1/2 h-full bg-slate-700 bg-opacity-50 group-hover:w-0 transition-all duration-500 z-10"></div>
        <div className=" absolute w-1/2 h-full right-0 bg-slate-700 bg-opacity-50 group-hover:w-0 transition-all duration-500 z-10"></div>
        <img
          src={contact}
          alt="Contact"
          className="w-full max-h-[550px] min-h[549px] h-[550px] rounded-3xl object-cover group-hover:scale-125 transition-all duration-500"
        />

      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h2 data-aos="fade-down" data-aos-duration="1500" className="text-base font-medium text-base-color">+ CONTACT US</h2>
        <h3 data-aos="fade-left" data-aos-duration="1500" className="text-5xl font-black text-gray-900 mb-10 mt-3">
          <span className="text-base-color">Get</span> In Touch With Us
        </h3>
        <form data-aos="fade-up" data-aos-duration="1500" onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              className="p-4 border rounded-lg w-full"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="p-4 border rounded-lg w-full"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              className="p-4 border rounded-lg w-full"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="p-4 border rounded-lg w-full"
              value={formik.values.subject}
              onChange={formik.handleChange}
            />
          </div>
          <textarea
            name="message"
            placeholder="Your Message"
            className="p-4 border rounded-lg w-full h-32 mb-4"
            value={formik.values.message}
            onChange={formik.handleChange}
          />
          <button
            type="submit"
            className="bg-base-color hover:bg-blue-600  text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            Send Message
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
