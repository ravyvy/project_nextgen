import React from 'react'
import { PhoneOutlined, EnvironmentOutlined , TeamOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { TimePicker } from "antd";
const Footer = () => {
    return (
        <div className="bg-slate-900 pt-5">
            <div className="max-w-[1300px] mx-auto flex justify-between items-start h-[250px] px-4">

                {/* LEFT SECTION */}
                <div>
                    <h1 className="text-gray-400 text-md mb-4 flex items-center gap-2">
                        <PhoneOutlined style={{ fontSize: "24px", color: "green", transform: "rotate(90deg)" }} />
                        010 445 201 / 089 786 502
                    </h1>

                    <h1 className="text-gray-400 text-md flex items-start gap-2 leading-6">
                        <EnvironmentOutlined style={{ fontSize: "24px", color: "green" }} />
                        ទីតាំង: ខាងក្រោយពេទ្យលោកសង្ឈ ផ្លូវ​ 146 ផ្ទះលេខ229A
                        សង្កាត់ទឹកល្អក 2 រាជធានីភ្នុំពេញ​ Cambodia
                    </h1>

                    <h1 className="text-red-500 text-md mt-6 text-center">
                        © 2025 Mastertech KH. All rights reserved
                    </h1>
                </div>

                {/* RIGHT SECTION */}
                <div>
                    <Link to={"/team"}>
                        <h1 className="text-gray-400 text-xl">
                         <TeamOutlined style={{  fontSize: "24px", color: "green" }} />  Our Team
                        </h1>
                        </Link>

                </div>
            </div>
        </div>
    );
};

export default Footer;
