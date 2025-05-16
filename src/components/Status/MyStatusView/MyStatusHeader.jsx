import { ChevronLeft } from 'lucide-react';

export default function MyStatusHeader({ onBack }) {
  return (
    <div className="flex items-center p-4 border-b bg-white shadow">
      <ChevronLeft onClick={onBack} className="mr-2 cursor-pointer" />
      <h2 className="text-lg font-semibold">My Status</h2>
    </div>
  );
}
