import React from 'react';
import { FaUser, FaCamera } from 'react-icons/fa';

function ProfilePictureStep({ initialData, onSelect }) {
  const [selectedFile, setSelectedFile] = React.useState(initialData || null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    if (selectedFile instanceof File) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onSelect(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    onSelect(null);
    const fileInput = document.getElementById('modal-file-upload');
    if (fileInput) {
      fileInput.value = null;
    }
  };

  return (
    <div className="max-h-full flex flex-col justify-center">
      <div className="flex items-center mb-6">
        <FaUser className="w-5 h-5 mr-3 text-cyan-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Upload Your Profile Picture</h2>
          <p className="text-gray-400 text-sm">A clear, friendly photo helps build trust with mentees.</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <label htmlFor="modal-file-upload" className="cursor-pointer">
          <div className="w-40 h-40 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-center p-4 relative overflow-hidden group hover:border-blue-500 transition-all">
            {!previewUrl ? (
              <div className="text-gray-500 flex flex-col items-center">
                <FaCamera className="w-10 h-10 mb-2" />
                <p className="text-xs">Click to upload</p>
              </div>
            ) : (
              <>
                <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover rounded-full" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-semibold text-sm">Change Photo</p>
                </div>
              </>
            )}
          </div>
        </label>
        <input id="modal-file-upload" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className="hidden" />
        {previewUrl && (
          <button onClick={handleRemoveImage} className="mt-4 text-xs text-red-500 hover:text-red-400 transition-colors">
            Remove Image
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfilePictureStep;
