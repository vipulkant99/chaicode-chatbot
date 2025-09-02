"use client";
import {
  toggleDetailModal,
  updateCourseForm,
  uploadCourse,
} from "@/app/_store/adminSlice";
import { FileText, Folder, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function CourseDetail() {
  const { selectedFolder, courseForm, percentage, isUploading } = useSelector(
    (state) => state.adminSlice
  );
  const dispatch = useDispatch();

  const handleProcessCourse = async () => {
    dispatch(uploadCourse());
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`dark:bg-neutral-800 bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Course Setup</h3>
          <button
            onClick={() => dispatch(toggleDetailModal(false))}
            className={`p-1 rounded dark:hover:bg-neutral-700 hover:bg-neutral-100"
            } transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`dark:bg-neutral-700 bg-green-50 p-4 rounded-lg mb-6`}>
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Folder className="w-5 h-5" />
            <span className="font-medium">
              Folder Selected: {selectedFolder.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4" />
            <span>Files Found: {selectedFolder.totalFiles} .vtt files</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Course Name
            </label>
            <input
              type="text"
              value={courseForm.name}
              onChange={(e) =>
                dispatch(updateCourseForm({ name: e.target.value }))
              }
              className={`w-full p-3 rounded border dark:bg-neutral-700 dark:border-neutral-600 bg-white border-neutral-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="React Complete Course"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description (optional)
            </label>
            <textarea
              value={courseForm.description}
              onChange={(e) =>
                dispatch(updateCourseForm({ description: e.target.value }))
              }
              className={`w-full p-3 rounded border dark:bg-neutral-700 dark:border-neutral-600 bg-white border-neutral-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              rows="3"
              placeholder="Learn React from basics to advanced concepts..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={courseForm.category}
                onChange={(e) =>
                  dispatch(updateCourseForm({ category: e.target.value }))
                }
                className={`w-full p-3 rounded border dark:bg-neutral-700 dark:border-neutral-600 bg-white border-neutral-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="Programming">Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL Slug</label>
              <input
                type="text"
                value={courseForm.urlSlug}
                onChange={(e) =>
                  dispatch(updateCourseForm({ urlSlug: e.target.value }))
                }
                className={`w-full p-3 rounded border dark:bg-neutral-700 dark:border-neutral-600 bg-white border-neutral-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="react-complete-course"
              />
            </div>
          </div>
        </div>

        <h3>{`Total completed: ${percentage}%`}</h3>

        <div className="flex gap-3">
          <button
            onClick={() => dispatch(toggleDetailModal(false))}
            className={`flex-1 py-3 px-4 rounded border font-medium transition-colors dark:border-neutral-600 dark:hover:bg-neutral-700 border-neutral-300 hover:bg-neutral-50`}
          >
            Back
          </button>
          <button
            onClick={handleProcessCourse}
            disabled={isUploading}
            className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
          >
            {isUploading ? "Processing..." : "Process Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
