import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  chat: [],
  message: "",
  courses: [],
  currentCourse: "",
  loadingChat: false,
  showModal: true,
  courseStatus: "idle", //| "loading" | "success" | "failed",
  courseError: null,
  chatError: null,
};

const chatSlice = createSlice({
  name: "userChat",
  initialState: initialState,
  reducers: {
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    toggleModal: (state, action) => {
      state.showModal = action.payload;
    },
    addUserMessage: (state, action) => {
      state.chat.push({
        role: action.payload.role,
        content: action.payload.content,
      });
    },
    updateLastMessage: (state, action) => {
      if (
        state.chat.length > 0 &&
        state.chat[state.chat.length - 1].role === "assistant"
      ) {
        state.chat[state.chat.length - 1].content = action.payload.content;
      } else {
        state.chat.push({
          role: action.payload.role,
          content: action.payload.content,
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.courseStatus = "loading";
        state.courseError = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courseStatus = "success";
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.courseStatus = "failed";
        state.courseError = action.payload || "Failed to fetch course";
      });

    builder
      .addCase(sendMessages.pending, (state) => {
        state.loadingChat = true;
        state.chatError = null;
      })
      .addCase(sendMessages.fulfilled, (state, action) => {
        state.loadingChat = false;
        state.chatError = null;
      })
      .addCase(sendMessages.rejected, (state, action) => {
        state.loadingChat = false;
        state.chatError = action.payload || "Failed to send message";
      });
  },
});

export const fetchCourses = createAsyncThunk(
  "userChat/fetchCourse",
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

export const sendMessages = createAsyncThunk(
  "userChat/sendMessage",
  async (
    { message, currentCourse, aiMessageBufferRef },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      if (!message.trim()) return;

      if (!currentCourse.trim()) {
        toast.error("Please Select one course to start chatting with bot.");
        return;
      }

      dispatch({
        type: "userChat/addUserMessage",
        payload: { role: "user", content: message },
      });
      dispatch({
        type: "userChat/addUserMessage",
        payload: { role: "assistant", content: "" },
      });
      aiMessageBufferRef.current = "";
      dispatch({
        type: "userChat/setMessage",
        payload: "",
      });

      console.log("my chat is11: ");
      const { chat } = getState().userChat;
      console.log("my chat is22: ", chat);

      const res = await fetch("/api/user-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: message,
          currentCourse: currentCourse,
          chatHistory: chat,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch chat response");

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
            aiMessageBufferRef.current += data.content;

            dispatch({
              type: "userChat/updateLastMessage",
              payload: {
                role: "assistant",
                content: aiMessageBufferRef.current,
              },
            });
          }
        }
      }
      return aiMessageBufferRef.current;
    } catch (error) {
      return rejectWithValue(error.message || "unknown error");
    }
  }
);

export const {
  setCurrentCourse,
  setMessage,
  toggleModal,
  addUserMessage,
  updateLastMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
