"use client";

import { useEffect, useState } from "react";
import Header from "./_components/header";
import Analytics from "./_components/analytics";
import CourseSection from "./_components/course";
import UploadModal from "./_components/upload";
import { Plus } from "lucide-react";
import CourseDetail from "./_components/course_detail";
import { LoaderOne } from "../_components/loader";
import { useDispatch, useSelector } from "react-redux";
import { toggleUploadModal, uploadCourse } from "../_store/adminSlice";

function AdminPage() {
  const dispatch = useDispatch();
  const { isLoading, showUploadModal, showDetailsModal, selectedFolder } =
    useSelector((state) => state.adminSlice);

  useEffect(() => {
    dispatch(uploadCourse());
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 dark:bg-neutral-950 dark:text-white bg-neutral-50 text-neutral-950`}
    >
      <Header />
      {isLoading ? (
        <div
          className={`dark:bg-neutral-950 dark:border-neutral-800 flex items-center justify-center bg-white border-neutral-200 border-2 border-dashed rounded-lg p-12 text-center max-w-7xl mx-auto mt-8`}
        >
          <LoaderOne />
        </div>
      ) : (
        <div className="p-6 max-w-7xl mx-auto mt-8 bg-neutral-100 dark:bg-neutral-900">
          <Analytics />
          <CourseSection />
        </div>
      )}
      <button
        onClick={() => dispatch(toggleUploadModal(true))}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        <Plus className="w-6 h-6" />
      </button>
      {showUploadModal && <UploadModal />}
      {showDetailsModal && selectedFolder && <CourseDetail />}
    </div>
  );
}

export default AdminPage;
