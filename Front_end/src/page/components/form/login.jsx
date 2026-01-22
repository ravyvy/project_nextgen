import React from "react";
import Navbar from '../navbar'
import Footer from "../footer"
import {Link} from "react-router-dom"
export function Login() {
  return (
   
   <div>
    <Navbar/>
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              // បានបន្ថែម border ទៅលើ input
              className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:ring-indigo-300 focus:border-indigo-500" 
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              // បានបន្ថែម border ទៅលើ input
              className="mt-1 w-full p-2 rounded-md border border-gray-300 focus:ring-indigo-300 focus:border-indigo-500"
              placeholder="Your password"
            />
          </div>
          <div className="text-sm mb-4 text-center">
            {/* បានប្តូរ text-red-600 ទៅជា text-indigo-600 ឲ្យស៊ីនឹងប៊ូតុង */}
            <Link to="/account/register" className="text-indigo-600 hover:underline">Create an account</Link>
          </div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
            Login
          </button>
        </form>
      </div>
    </div>
    <Footer/>
   </div>
  );
}

export default Login;