// components/ContentRenderer.jsx
import FileAttachment from "./FileAttachment";
import VideoEmbed from "./VideoEmbed";

export default function ContentRenderer({ content }) {
  return (
    <div className="prose prose-gray max-w-full">
      {content.body && content.body.map((block, i) => (
        <p key={i}>{block.children.map(c => c.text).join('')}</p>
      ))}
      {content.attachments && content.attachments.length > 0 && <FileAttachment files={content.attachments} />}
      {content.youtubeUrl && <VideoEmbed url={content.youtubeUrl} />}
    </div>
  );
}
