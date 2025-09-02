import {
  setSelectedfolder,
  toggleDetailModal,
  toggleUploadModal,
  updateCourseForm,
} from "@/app/_store/adminSlice";
import { Folder, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function UploadModal() {
  const { courseForm } = useSelector((state) => state.adminSlice);
  const dispatch = useDispatch();

  const handleFolderSelect = async (event) => {
    const files = Array.from(event.target.files);
    const folderName =
      files[0]?.webkitRelativePath?.split("/")[0] || "Unknown Course";
    const vttFiles = files.filter((file) => file.name.endsWith(".vtt"));

    dispatch(
      setSelectedfolder({
        name: folderName,
        files: vttFiles,
        totalFiles: vttFiles.length,
      })
    );

    dispatch(
      updateCourseForm({
        ...courseForm,
        files: vttFiles,
        name: folderName
          .replace(/[_-]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        urlSlug: folderName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      })
    );

    dispatch(toggleUploadModal(false));
    dispatch(toggleDetailModal(true));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className={`dark:bg-neutral-800 bg-white rounded-lg max-w-lg w-full p-6`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Upload Course</h3>
          <button
            onClick={() => dispatch(toggleUploadModal(false))}
            className={`p-1 rounded dark:hover:bg-neutral-700 hover:bg-neutral-100 transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-4  dark:border-neutral-600 dark:bg-neutral-700 border-neutral-300 bg-neutral-50`}
        >
          <Folder
            className={`w-12 h-12 mx-auto mb-4 dark:text-neutral-400 text-neutral-500`}
          />
          <p className="font-medium mb-2">Drop Course Folder</p>
          <p className={`text-sm mb-4 dark:text-neutral-400 text-neutral-600`}>
            Drag & drop your course folder with .vtt files
          </p>

          <input
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFolderSelect}
            className="hidden"
            id="folderInput"
          />
          <label
            htmlFor="folderInput"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer transition-colors"
          >
            Browse Folder
          </label>
        </div>

        <p
          className={`text-xs dark:text-neutral-400 text-neutral-500 text-center`}
        >
          Supports nested folders with .vtt subtitle files
        </p>
      </div>
    </div>
  );
}

export default UploadModal;
