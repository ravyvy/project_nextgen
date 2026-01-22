
import Navbar from '../navbar';
import Footer from '../footer';
import { LinkedinOutlined, FacebookOutlined } from '@ant-design/icons';

const teamMembers = [
  {
    id: 1,
    name: "Mr. Ravy",
    role: "Full Stack Developer",
    img: "src/assets/img/vy.jpg",
    linkedin: "#",
    facebook: "#",
  },
  {
    id: 2,
    name: "Mr. Daravid",
    role: "Business Development Manager",
    img: "src/assets/img/vid.png",
    linkedin: "#",
    facebook: "#",
  },
  {
    id: 3,
    name: "Mr. SeavChean",
    role: "Digital Marketing Manager",
    img: "src/assets/img/chean.png",
    linkedin: "#",
    facebook: "#",
  },
  {
    id: 4,
    name: "Mr. Visal",
    role: "UI/UX Designer",
    img: "https://img.freepik.com/free-photo/portrait-young-handsome-man-jean-shirt-smiling-with-crossed-arms_176420-12083.jpg?semt=ais_se_enriched&w=740&q=80",
    linkedin: "#",
    facebook: "#",
  },
];

const Team = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="py-12 bg-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-center">Our Team</h1>
        <p className="text-gray-600 mb-10 max-w-xl text-center mx-auto">
          Meet the amazing people behind our company. They make everything possible.
        </p>

        {/* Updated grid: 4 columns on large screens */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map(member => (
            <div
              key={member.id}
              className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h2 className="font-semibold text-lg">{member.name}</h2>
                <p className="text-gray-500 text-sm mb-3">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedinOutlined className="text-gray-700 hover:text-blue-600 text-xl" />
                  </a>
                  <a href={member.facebook} target="_blank" rel="noopener noreferrer">
                    <FacebookOutlined className="text-gray-700 hover:text-blue-500 text-xl" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Team;
