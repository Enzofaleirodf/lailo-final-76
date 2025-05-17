
import React from 'react';
import { Home, Search, Heart, Building2, Bell, User } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-14 h-full bg-white border-r flex flex-col items-center py-6 fixed left-0 top-0 z-10">
      <div className="mb-8">
        <div className="w-6 h-6 bg-black"></div>
      </div>
      <div className="flex flex-col items-center gap-8">
        <button className="text-gray-600 hover:text-black">
          <Home size={20} />
        </button>
        <button className="text-gray-600 hover:text-black">
          <Search size={20} />
        </button>
        <button className="text-gray-600 hover:text-black">
          <Heart size={20} />
        </button>
        <button className="text-gray-600 hover:text-black">
          <Building2 size={20} />
        </button>
      </div>
      <div className="mt-auto flex flex-col items-center gap-8">
        <button className="text-gray-600 hover:text-black">
          <Bell size={20} />
        </button>
        <button className="text-gray-600 hover:text-black">
          <User size={20} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
