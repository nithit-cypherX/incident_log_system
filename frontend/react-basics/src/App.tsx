// import { useState } from 'react'
import "./App.css";
import LoginPage from "./pages/LoginPage";
import NewIncidentPage from "./pages/NewIncidentPage";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* <LoginPage /> */}
        <NewIncidentPage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
