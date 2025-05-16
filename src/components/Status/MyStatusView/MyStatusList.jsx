import MyStatusItem from './MyStatusItem';

export default function MyStatusList({ statuses }) {
  return (
    <div className="flex flex-col divide-y">
      {statuses.map((status, i) => (
        <MyStatusItem
          key={i}
          thumbnailUrl={status.thumbnailUrl}
          timestamp={status.timestamp}
        />
      ))}
    </div>
  );
}
