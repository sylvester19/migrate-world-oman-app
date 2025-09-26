import React from "react";
import { Call } from "@nine-thirty-five/material-symbols-react/rounded/filled";

export default function Navbar() {
  return (
    <nav className="bg-white border-gray-300 border-b">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <img src="/logo.png" className="h-16" alt="Flowbite Logo" />
        <div className="flex items-center space-x-4">
          <Call className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
        </div>
      </div>
    </nav>
  );
}
