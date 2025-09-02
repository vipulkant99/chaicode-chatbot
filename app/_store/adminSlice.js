const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  percentage: 0,
  showUploadModal: false,
  showDetailsModal: false,
  isLoading: false,
  isUploading: false,
  selectedFolder: {},
  courses: [],
  courseError: null,
  analytics: {
    totalCourses: 0,
    totalChunks: 0,
    storageUsed: "0 MB",
  },
  courseForm: {
    files: null,
    name: "",
    description: "",
    urlSlug: "",
  },
};

export const fetchCourses = createAsyncThunk(
  "adminSlice/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/get-courses");
      const data = await res.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "unknown error");
    }
  }
);

export const uploadCourse = createAsyncThunk(
  "adminSlice/uploadCourse",
  async (_, { getState, dispatch }) => {
    const { courseForm } = getState().admin; // get courseForm from Redux
    console.log("new course is:", courseForm);
    try {
      let body = new FormData();
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

            // Dispatch a percentage update action
            dispatch(updatePercentage(data.percentage));
          }
        }
      }

      // Reset form state
      dispatch(toggleUploadModal(false));
      dispatch(setSelectedfolder(null));
      dispatch(
        updateCourseForm({
          name: "",
          description: "",
          urlSlug: "",
        })
      );

      return true;
    } catch (error) {
      return rejectWithValue(error.message || "unknown error");
    }
  }
);

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    updatePercentage: (state, action) => {
      state.percentage = action.payload;
    },
    toggleUploadModal: (state, action) => {
      state.showUploadModal = action.payload;
    },
    toggleDetailModal: (state, action) => {
      state.showDetailsModal = action.payload;
    },
    setSelectedfolder: (state, action) => {
      state.selectedFolder = action.payload;
    },
    updateCourseForm: (state, action) => {
      state.courseForm = {
        ...state.courseForm,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.courseError = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;

        let total_chunks = 0;
        let total_storge = 0;

        action.payload.map((data) => {
          total_chunks += data.info.points_count;
          let currentStorage =
            (data.info.points_count *
              (action.payload[0].info.config.params.vectors.size * 4)) /
            (1024 * 1024);
          total_storge += currentStorage;
        });

        state.analytics = {
          totalCourses: action.payload.length,
          totalChunks: total_chunks.toLocaleString(),
          storageUsed: `${total_storge.toFixed(2)} MB`,
        };

        state.courses = action.payload.map((data, index) => {
          let currentStorage =
            (data.info.points_count *
              (action.payload[0].info.config.params.vectors.size * 4)) /
            (1024 * 1024);

          return {
            id: index + 1,
            name: data.name,
            chunks: data.info.points_count.toLocaleString(),
            storageUsed: `${currentStorage.toFixed(2)} MB`,
          };
        });
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.courseError = action.payload || "Failed to fetch course";
      });

    builder
      .addCase(uploadCourse.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadCourse.fulfilled, (state) => {
        state.isUploading = false;
      })
      .addCase(uploadCourse.rejected, (state) => {
        state.isUploading = false;
      });
  },
});

export const {
  updatePercentage,
  toggleUploadModal,
  toggleDetailModal,
  setSelectedfolder,
  updateCourseForm,
} = adminSlice.actions;

export default adminSlice.reducer;
