import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Customize Chakra UI theme
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;