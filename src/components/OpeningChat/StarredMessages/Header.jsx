import React from 'react';
import { ChevronLeft, EllipsisVertical, Search } from 'lucide-react';

const Header = ({ goBack }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
      <div className="flex items-center space-x-4">
        <button onClick={goBack} className="text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Starred Messages</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Search size={20} className="text-gray-600" />
        <EllipsisVertical size={20} className="text-gray-600" />
      </div>
    </div>
  );
};

export default Header;