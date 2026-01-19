import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Songs from "./pages/Song";
// import SongDetail from "./pages/SongDetail";
import UploadSong from "./pages/SongUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import SongViewer from "./pages/SongViewer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/songs" element={<Songs />} />
        {/* <Route path="/songs/:id" element={<SongDetail />} /> */}
        <Route path="/songs/:id" element={<SongViewer />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadSong />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
