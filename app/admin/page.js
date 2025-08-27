"use client";

import { useEffect, useState } from "react";
import Header from "./_components/header";
import Analytics from "./_components/analytics";
import CourseSection from "./_components/course";
import UploadModal from "./_components/upload";
import { Plus } from "lucide-react";
import CourseDetail from "./_components/course_detail";
import { useTheme } from "next-themes";
import { LoaderOne } from "../_components/loader";

function AdminPage() {
  const { theme, setTheme } = useTheme();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [overViewData, setOverviewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    category: "Programming",
    urlSlug: "",
  });

  useEffect(() => {
    //console.log("data is111: ");
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/get-courses");
        const data = await res.json();
        setOverviewData(() => data);
        setIsLoading(false);
        //console.log("data is11: ", overViewData);
        //data.map((course) => console.log("course is", course));
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  function changeTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }
  return (
    <div
      className={`min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-gray-50 text-gray-900`}
    >
      <Header dark={theme} setDarkMode={changeTheme} />
      {isLoading ? (
        <div
          className={`dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center bg-white border-gray-200 border-2 border-dashed rounded-lg p-12 text-center max-w-7xl mx-auto mt-8`}
        >
          <LoaderOne />
        </div>
      ) : (
        <div className="p-6 max-w-7xl mx-auto mt-8 bg-neutral-100 dark:bg-gray-800">
          <Analytics overViewData={overViewData} />
          <CourseSection overViewData={overViewData} />
        </div>
      )}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        <Plus className="w-6 h-6" />
      </button>
      {showUploadModal && (
        <UploadModal
          setShowUploadModal={setShowUploadModal}
          setShowDetailsModal={setShowDetailsModal}
          setSelectedFolder={setSelectedFolder}
          setCourseForm={setCourseForm}
          courseForm={courseForm}
        />
      )}
      {showDetailsModal && selectedFolder && (
        <CourseDetail
          courseForm={courseForm}
          selectedFolder={selectedFolder}
          setCourseForm={setCourseForm}
          setSelectedFolder={setSelectedFolder}
          setShowDetailsModal={setShowDetailsModal}
        />
      )}
    </div>
  );
}

export default AdminPage;
