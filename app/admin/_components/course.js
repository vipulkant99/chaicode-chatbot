"use client";
import { BarChart3, BookOpen, ExternalLink, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CourseSection() {
  const { courses } = useSelector((state) => state.adminSlice);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-green-500" />
        Your Courses ({courses.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses &&
          courses.map((course) => (
            <div
              key={course.id}
              className={`dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 bg-white border-neutral-200 hover:bg-neutral-50 border rounded-lg p-6 transition-all duration-200 hover:shadow-lg`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{course.name}</h3>
                </div>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className={`p-1 rounded dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-red-400 hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="dark:text-neutral-300 text-neutral-600">
                    Chunks:
                  </span>
                  <span className="font-medium">{course.chunks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="dark:text-neutral-300 text-neutral-600">
                    Storage Used:
                  </span>
                  <span className="font-medium text-green-500">
                    {course.storageUsed}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Chat Link
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-700`}
                >
                  <BarChart3 className="w-3 h-3" />
                  Analytics
                </button>
              </div>
            </div>
          ))}
      </div>

      {courses.length === 0 && (
        <div
          className={`dark:bg-neutral-800 dark:border-neutral-700 bg-white border-neutral-200 border-2 border-dashed rounded-lg p-12 text-center`}
        >
          <BookOpen
            className={`w-12 h-12 mx-auto mb-4 dark:text-neutral-600text-neutral-400`}
          />
          <h3 className="text-lg font-medium mb-2">No courses yet</h3>
          <p className={`dark:text-neutral-400 text-neutral-600 mb-4`}>
            Get started by uploading your first course
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Upload Course
          </button>
        </div>
      )}
    </div>
  );
}

export default CourseSection;
