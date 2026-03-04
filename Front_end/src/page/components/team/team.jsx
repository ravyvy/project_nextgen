import React from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import { LinkedinOutlined, FacebookOutlined, TeamOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter transition-all duration-300">
      <Navbar />

      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 lg:px-10 py-12">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <Breadcrumb
            className="mb-4 text-xs uppercase font-bold tracking-widest justify-center"
            items={[
              { title: <Link to="/">Home</Link> },
              { title: <span className="text-emerald-600 font-bold">Our Team</span> },
            ]}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md text-emerald-600 border border-slate-100 mb-2 rotate-3 hover:rotate-0 transition-transform duration-300">
              <TeamOutlined style={{ fontSize: '32px' }} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight font-outfit uppercase leading-tight">
              Meet The <span className="text-emerald-500 text-glow">Experts</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto italic">
              "The visionary minds behind the next generation of computing performance and design innovation."
            </p>
          </div>
        </div>

        {/* Updated grid: 4 columns on large screens */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {teamMembers.map(member => (
            <div
              key={member.id}
              className="group relative"
            >
              {/* Card Decoration */}
              <div className="absolute inset-x-0 -bottom-4 h-full bg-slate-200/50 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative bg-white rounded-[3rem] overflow-hidden premium-shadow border border-slate-100 transition-all duration-500 hover:-translate-y-4 group-active:scale-95 flex flex-col h-full">
                {/* Image Wrapper */}
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-100 group-hover:bg-emerald-600 transition-colors duration-700"></div>
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-60 mix-blend-multiply"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=600&auto=format&fit=crop";
                    }}
                  />

                  {/* Overlay Socials */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-500">
                    <a href={member.linkedin} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-90">
                      <LinkedinOutlined style={{ fontSize: '20px' }} />
                    </a>
                    <a href={member.facebook} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-90">
                      <FacebookOutlined style={{ fontSize: '20px' }} />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 text-center flex-grow flex flex-col">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ThunderboltOutlined className="text-emerald-500 text-[10px]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry Leader</span>
                  </div>
                  <h2 className="font-black text-slate-900 text-2xl font-outfit uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{member.name}</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2 italic">{member.role}</p>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full border border-emerald-500/10 group-hover:scale-[3] transition-transform duration-1000"></div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
