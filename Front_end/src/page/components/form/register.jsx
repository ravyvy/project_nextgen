import React from "react";
import Navbar from '../navbar'
import Footer from "../footer"
import {Link} from "react-router-dom"
export function Register() {
    return (

        <div>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8"> {/* ខ្ញុំបានប្តូរ bg-red-300 ទៅជា bg-white ដើម្បីអោយមើលទៅសមរម្យជាង */}
                    <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                    <form className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:ring-indigo-300 focus:border-indigo-500" // បានបន្ថែម border
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:ring-indigo-300 focus:border-indigo-500" // បានបន្ថែម border
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Password</label>
                            <input
                                type="password"
                                className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:ring-indigo-300 focus:border-indigo-500" // បានបន្ថែម border
                                placeholder="Create password"
                            />
                        </div>
                        <div className="text-sm mb-4 text-center">
                            <Link to="/account/login" className="text-indigo-600 hover:underline">Already have an account? Login</Link> {/* បានប្តូរ text-red-600 ទៅជា text-indigo-600 */}
                        </div>

                        <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                            Register
                        </button>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Register;