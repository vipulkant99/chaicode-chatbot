"use client";
import { FileText, Folder, X } from "lucide-react";
import { useEffect, useState } from "react";

function CourseDetail({
  setShowDetailsModal,
  selectedFolder,
  setSelectedFolder,
  courseForm,
  setCourseForm,
}) {
  const [percentage, setPercentage] = useState(0);

  const handleProcessCourse = async () => {
    // Add new course to list
    // const newCourse = {
    //   id: courses.length + 1,
    //   name: courseForm.name,
    //   lessons: selectedFolder.totalFiles,
    //   chunks: selectedFolder.totalFiles * 20, // Estimated
    //   chatsThisWeek: 0,
    //   lastUpdated: "Just now",
    //   category: courseForm.category,
    // };

    console.log("new course is:", courseForm);

    let body = new FormData();
    //body.append("files", courseForm.files);
    courseForm.files.forEach((file) => {
      body.append("files", file);
    });
    body.append("name", courseForm.name);
    body.append("url", courseForm.urlSlug);

    const res = await fetch("api/index-files", {
      method: "POST",
      body: body,
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));
          console.log("data stream is", data.percentage);
          setPercentage(data.percentage);
        }
      }
    }
    //setCourses([...courses, newCourse]);

    // Reset and close
    setShowDetailsModal(false);
    setSelectedFolder(null);
    setCourseForm({
      name: "",
      description: "",
      category: "Programming",
      urlSlug: "",
    });

    // In real app, this would call your processing API
    //alert("Course processing started! This may take a few minutes.");
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`dark:bg-gray-800 bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Course Setup</h3>
          <button
            onClick={() => setShowDetailsModal(false)}
            className={`p-1 rounded dark:hover:bg-gray-700 hover:bg-gray-100"
            } transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`dark:bg-gray-700 bg-green-50 p-4 rounded-lg mb-6`}>
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
                setCourseForm({ ...courseForm, name: e.target.value })
              }
              className={`w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                setCourseForm({
                  ...courseForm,
                  description: e.target.value,
                })
              }
              className={`w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                  setCourseForm({ ...courseForm, category: e.target.value })
                }
                className={`w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                  setCourseForm({ ...courseForm, urlSlug: e.target.value })
                }
                className={`w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="react-complete-course"
              />
            </div>
          </div>
        </div>

        <h3>{`Total completed: ${percentage}%`}</h3>

        <div className="flex gap-3">
          <button
            onClick={() => setShowDetailsModal(false)}
            className={`flex-1 py-3 px-4 rounded border font-medium transition-colors dark:border-gray-600 dark:hover:bg-gray-700 border-gray-300 hover:bg-gray-50`}
          >
            Back
          </button>
          <button
            onClick={handleProcessCourse}
            className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition-colors"
          >
            Process Course
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
