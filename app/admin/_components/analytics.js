"use client";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

function Analytics({ overViewData }) {
  const [analytics, setAnalytics] = useState({
    totalCourses: 0,
    totalChunks: 0,
    storageUsed: "0 MB",
  });

  useEffect(() => {
    //console.log("data is111: ");
    const fetchCourses = async () => {
      let total_chunks = 0;
      let total_storge = 0;

      overViewData.map((data) => {
        total_chunks += data.info.points_count;
        let currentStorage =
          (data.info.points_count *
            (overViewData[0].info.config.params.vectors.size * 4)) /
          (1024 * 1024);
        total_storge += currentStorage;
      });

      if (!overViewData) return;

      //overViewData.map((data))

      setAnalytics({
        totalCourses: overViewData.length,
        totalChunks: total_chunks.toLocaleString(),
        storageUsed: `${total_storge.toFixed(2)} MB`,
      });
      try {
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [overViewData]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-500" />
        Analytics Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200 p-4 rounded-lg border flex flex-col items-center justify-center`}
        >
          <div className="text-2xl font-bold text-blue-500">
            {analytics.totalCourses}
          </div>
          <div className={`text-sm dark:text-gray-300 text-gray-600`}>
            Total Courses
          </div>
        </div>

        <div
          className={`dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200 p-4 rounded-lg border flex flex-col items-center justify-center`}
        >
          <div className="text-2xl font-bold text-purple-500">
            {analytics.totalChunks}
          </div>
          <div className={`text-sm dark:text-gray-300 text-gray-600`}>
            Total Chunks
          </div>
        </div>

        <div
          className={`dark:bg-gray-800 dark:border-gray-700 bg-white border-gray-200 p-4 rounded-lg border flex flex-col items-center justify-center`}
        >
          <div className="text-2xl font-bold text-orange-500">
            {analytics.storageUsed}
          </div>
          <div className={`text-sm dark:text-gray-300 text-gray-600`}>
            Storage Used
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
