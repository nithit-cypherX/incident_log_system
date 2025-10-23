// import React from 'react';
import {FaExclamationTriangle } from "react-icons/fa";

// We define props to make the header reusable
type HeaderProps = {
  title: string;
  showCancel?: boolean; // The '?' makes it optional
};

const Header = ({ title, showCancel = false }: HeaderProps) => {
  return (
    <header className="bg-[#1A1D20] text-[#F8F9FA] p-4 border-b border-[#495057] flex items-center justify-between">
      <div className="flex items-center">
        {/* Simple placeholder logo */}
        <div className="h-11 w-11 rounded-full bg-red-800 flex items-center justify-center mr-3">
         <FaExclamationTriangle size={30} className="text-red-300" />
        </div>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      {/* Conditionally render the Cancel button */}
      {showCancel && (
        <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6  rounded-md transition-colors ">
          Cancel
        </button>
      )}
    </header>
  );
};

export default Header;