import React from 'react';
import { User, ChevronRight } from 'lucide-react';

const Message = ({ message }) => {
  return (
    <div className="p-4">
      {/* Message Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 rounded-full p-1">
            <User size={16} />
          </div>
          <span className="font-medium">{message.sender}</span>
          <ChevronRight size={16} className="text-gray-500" />
          <span className="text-gray-600">{message.recipient}</span>
        </div>
        <div className="text-gray-500 text-sm">{message.date}</div>
      </div>

      {/* Message Content */}
      {message.type === 'audio' && (
        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            </svg>
          </div>
          <div>
            <div className="font-medium">{message.fileName}</div>
            <div className="text-gray-500 text-sm">{message.size} • MP3</div>
          </div>
        </div>
      )}

      {message.type === 'image' && (
        <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Image</span>
        </div>
      )}

      {message.type === 'forwarded' && (
        <div className="border rounded-lg p-3 bg-gray-50">
          <div className="text-gray-500 text-sm mb-2">Forwarded</div>
          <h3 className="font-bold mb-3">{message.title}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Subtests</th>
              </tr>
            </thead>
            <tbody>
              {message.tableData.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{row.date}</td>
                  <td className="py-2">{row.subDate}</td>
                  <td className="py-2">{row.subtest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Time */}
      {message.time && (
        <div className="text-right mt-2 text-gray-500 text-sm">
          {message.time}
        </div>
      )}
    </div>
  );
};

export default Message;