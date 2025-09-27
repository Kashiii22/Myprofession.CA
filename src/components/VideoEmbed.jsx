// components/VideoEmbed.jsx
export default function VideoEmbed({ url }) {
  if (!url) return null;
  const videoId = url.split('v=')[1];
  return (
    <div className="mt-4 aspect-w-16 aspect-h-9">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allowFullScreen
        className="w-full h-full rounded-md"
      />
    </div>
  );
}
