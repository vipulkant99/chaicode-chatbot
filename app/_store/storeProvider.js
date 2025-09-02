"use client";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "./reduxStrore";
import { Toaster } from "react-hot-toast";

function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster
          position="bottom-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: { duration: 5000 },
            error: { duration: 5000 },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "white",
              color: "black",
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}

export default Providers;
