import {  useRef } from "react";
// import hietlogo from "/hietlogo.png";
import { FaYoutube, FaWhatsapp, FaLinkedin, FaInstagram, FaEnvelope, FaArrowUp } from 'react-icons/fa';

const Contact = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 sm:pt-28 md:pt-32 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 opacity-80 animate-gradient-x" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_70%)] animate-pulse" />
      
      <div className="relative z-0 text-center mb-12 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text mb-6 animate-bounce hover:text-fuchsia-500 pt-4">
          Connect With Us
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12 text-lg text-white">
          <a href="https://wa.me/9560472926" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-green-600/20 px-4 py-2 rounded-full hover:bg-green-600/40 transition-all duration-300 group">
            <span className="bg-green-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
              <FaWhatsapp size={20} />
            </span>
            <span className="font-medium group-hover:text-green-300">WhatsApp</span>
          </a>
          <a href="tel:+919560472926" className="flex items-center gap-3 bg-blue-600/20 px-4 py-2 rounded-full hover:bg-blue-600/40 transition-all duration-300 group">
            <span className="bg-blue-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
              <FaWhatsapp size={20} /> {/* You might want a phone icon here instead */}
            </span>
            <span className="font-medium group-hover:text-blue-300">Phone</span>
          </a>
          <a href="mailto:ag0567688@gmail.com" className="flex items-center gap-3 bg-red-600/20 px-4 py-2 rounded-full hover:bg-red-600/40 transition-all duration-300 group">
            <span className="bg-red-500 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
              <FaEnvelope size={20} />
            </span>
            <span className="font-medium group-hover:text-red-300">Email</span>
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="relative z-0 w-full max-w-lg sm:max-w-xl md:max-w-2xl px-4">
        <div ref={formRef} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mb-6 text-center hover:text-teal-600">
            Drop Us a Message
          </h2>
          <form action="https://getform.io/f/azywrdkb" method="POST" encType="multipart/form-data" className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-gray-200 font-semibold mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-4 bg-white/5 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-gray-500 transition-all duration-300 hover:bg-white/10"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-200 font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full p-4 bg-white/5 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-gray-500 transition-all duration-300 hover:bg-white/10"
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-gray-200 font-semibold mb-2">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                pattern="[6-9][0-9]{9}"
                className="w-full p-4 bg-white/5 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-gray-500 transition-all duration-300 hover:bg-white/10"
                placeholder="Your Mobile Number"
                required
              />
              <small className="text-gray-400">Format: 9876543210</small>
            </div>
            <div>
              <label htmlFor="branch" className="block text-gray-200 font-semibold mb-2">Branch</label>
              <select
                id="branch"
                name="branch"
                className="w-full p-4 bg-white/5 text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-300 hover:bg-white/10"
                required
              >
                <option value="select">Select Your Branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EE">EE</option>
                <option value="ME">ME</option>
                <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
            <div>
              <label htmlFor="id" className="block text-gray-200 font-semibold mb-2">Upload Id Card</label>
              <input
                type="file"
                id="id"
                name="id"
                className="w-full p-4 bg-white/5 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-gray-500 transition-all duration-300 hover:bg-white/10"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-200 font-semibold mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                className="w-full p-4 bg-white/5 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-gray-500 transition-all duration-300 hover:bg-white/10"
                placeholder="Your Message"
                rows="5"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold p-4 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 relative overflow-hidden group cursor-pointer"
            >
              <span className="relative z-0">Send Message</span>
              <span className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_40%)] scale-0 group-hover:scale-150 transition-transform duration-500 origin-center" />
            </button>
          </form>
        </div>
      </div>

      {/* Google Maps Iframe */}
      <div className="relative z-0 w-full max-w-lg sm:max-w-xl md:max-w-4xl mt-12 px-4">
        <h2 className="font-bold text-white hover:text-purple-500 cursor-pointer text-2xl hover:underline hover:font-serif text-center hover:underline-offset-1">Address</h2>
        <p className="font-semibold text-gray-300 hover:text-green-500 cursor-grab text-xl text-center">
          Plot No. 766, 26th KM Milestone, NH-9,
          <br />
          Ghaziabad, Uttar Pradesh – 201015
        </p>
        <h2 className="text-white font-bold text-4xl underline hover:text-pink-500 transition-all duration-300 animate__animated animate__fadeInUp animate__delay-1s pb-9 text-center">Reach to Us</h2>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 animate-fade-in">
          <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text mb-4 text-center">
            Find Us Here
          </h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.545251972305!2d77.49128877566565!3d28.673331882226368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf2c4cac27f99%3A0xd9961659aee6d5b2!2sHi-Tech%20Institute%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1739723721387!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "1.5rem" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="shadow-lg hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      </div>

      
    </div>
  );
};

export default Contact;