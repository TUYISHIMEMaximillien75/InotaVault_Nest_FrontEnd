import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Songs from "./pages/Song";
// import SongDetail from "./pages/SongDetail";
import UploadSong from "./pages/SongUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import SongViewer from "./pages/SongViewer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import SongList from "./authorizedPages/Home";
import DashboardLayout from "./Dashboard/DashboardLayout";
import DashboardHome from "./Dashboard/DashboardHome";
import DashboardSongs from "./Dashboard/DashboardSongs";
import DashboardReperitories from "./Dashboard/DashboardReperitories";
import CreateRepertoire from "./pages/dashboard/CreateRepertoire";
import EditRepertoire from "./pages/dashboard/EditRepertoire";
import RepertoireViewer from "./pages/RepertoireViewer";
import NotFound from "./pages/NotFound";
import Profile from "./Dashboard/Profile";

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
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="auth/verify/:user_id" element={<Verify />}></Route>
 
        {/* Authorized routes */}
 
        <Route path="/song_list" element={<SongList />}></Route>
        <Route path="/upload" element={<UploadSong />}></Route>
 
        {/* Public repertoire viewer — no auth needed */}
        <Route path="/repertoire/:id" element={<RepertoireViewer />} />
 
        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />}></Route>
          <Route path="/dashboard/songs" element={<DashboardSongs />}></Route>
          <Route path="/dashboard/upload" element={<UploadSong />}></Route>
          <Route path="/dashboard/repertoires" element={<DashboardReperitories />}></Route>
          <Route path="/dashboard/create_repertoires" element={<CreateRepertoire />}></Route>
          <Route path="/dashboard/edit_repertoire/:id" element={<EditRepertoire />}></Route>
          <Route path="/dashboard/profile" element={<Profile />}></Route>
          <Route path="*" element={<NotFound />} />
        </Route>
          <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
