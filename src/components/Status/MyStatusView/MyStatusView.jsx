import MyStatusHeader from './MyStatusHeader';
import MyStatusList from './MyStatusList';
import { ImagePlus } from 'lucide-react';

export default function MyStatusView({ statuses, onBack, onAddNew }) {
  return (
    <div className="relative h-full bg-gray-100">
      <MyStatusHeader onBack={onBack} />
      <MyStatusList statuses={statuses} />
      
      <button
        onClick={onAddNew}
        className="absolute bottom-6 right-6 bg-white p-3 rounded-full shadow-md"
      >
        <ImagePlus className="text-black" />
      </button>
    </div>
  );
}
