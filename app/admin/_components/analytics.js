"use client";
import { BarChart3 } from "lucide-react";
import { useSelector } from "react-redux";

function Analytics() {
  const { analytics } = useSelector((state) => state.adminSlice);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        Analytics Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`dark:bg-neutral-800 dark:border-neutral-700 bg-white border-neutral-200 p-4 rounded-lg border flex flex-col items-center justify-center`}
        >
          <div className="text-2xl font-bold text-blue-500">
            {analytics.totalCourses}
          </div>
          <div className={`text-sm dark:text-neutral-300 text-neutral-600`}>
            Total Courses
          </div>
        </div>

        <div
          className={`dark:bg-neutral-800 dark:border-neutral-700 bg-white border-neutral-200 p-4 rounded-lg border flex flex-col items-center justify-center`}
        >
          <div className="text-2xl font-bold text-purple-500">
            {analytics.totalChunks}
          </div>
          <div className={`text-sm dark:text-neutral-300 text-neutral-600`}>
            Total Chunks
          </div>
        </div>

        <div
          className={`dark:bg-neutral-800 dark:border-neutral-700 bg-white border-neutral-200 p-4 rounded-lg border flex flex-col items-center justify-center`}
        >
          <div className="text-2xl font-bold text-orange-500">
            {analytics.storageUsed}
          </div>
          <div className={`text-sm dark:text-neutral-300 text-neutral-600`}>
            Storage Used
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
