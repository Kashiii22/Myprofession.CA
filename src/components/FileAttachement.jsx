// components/FileAttachment.jsx
export default function FileAttachment({ files }) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-gray-700">Attachments</h3>
      <ul className="list-disc list-inside">
        {files.map((file, idx) => (
          <li key={idx}>
            <a href={file.asset.url} target="_blank" className="text-blue-600 hover:underline">
              {file.asset.originalFilename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
