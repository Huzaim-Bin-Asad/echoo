import { MoreVertical } from 'lucide-react';

export default function MyStatusItem({ thumbnailUrl, timestamp }) {
  return (
    <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <img src={thumbnailUrl} alt="Status Thumbnail" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="text-sm text-gray-700">Yesterday, {timestamp}</p>
        </div>
      </div>
      <MoreVertical className="text-gray-500" />
    </div>
  );
}
    