import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="text-center">
        
        <h1 className="text-9xl font-extrabold text-red-500 drop-shadow-lg">
          404
        </h1>

        <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>

        <p className="mt-2 text-gray-300">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
