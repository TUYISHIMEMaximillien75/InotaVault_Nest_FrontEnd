import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api.ts";
import logo from "../assets/logo.png";
import icon from "../assets/icon.png"
import { Link } from "react-router-dom";

interface Song {
  id: string;
  name: string;
  pdf_sheet?: string;
  video_file?: string;
  audio_file?: string;
  external_link?: string;
  view_count: number;
}

export default function Songs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2); // total pages from API
  const [limit] = useState(2); // items per page
  const [filter, setFilter] = useState('all');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, number>>({});

  const navigate = useNavigate();

  const fetchSongs = async (pageNumber: number, filter: string) => {
    setLoading(true);
    try {
      const newfilter = await filter;
      const res = await api.get(`/songs/allsong?category=${newfilter}&page=${pageNumber}&limit=${limit}`);
      setSongs(res.data.paginatedSong);

      console.log(res.data);

      // Assume API returns total count for pagination
      const totalItems = res.data.total;
      setTotalPages(Math.ceil(totalItems / limit));
    } catch (error) {
      console.error("Failed to load songs", error);
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeEmbedUrl = (url: string): string | null => {
    try {
      const parsed = new URL(url);

      // https://www.youtube.com/watch?v=VIDEO_ID
      if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v");
        return videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : null;
      }

      // https://youtu.be/VIDEO_ID
      if (parsed.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed${parsed.pathname}`;
      }

      return null;
    } catch {
      return null;
    }
  };

  const getLikes = async (songId: string): Promise<number> => {
    try {
      const res = await api.get(`/likes?song_id=${songId}`);
      return Number(res.data); //  API returns "plain number"
    } catch (error) {
      console.error("Failed to get likes", error);
      return 0;
    }
  };

  const getComments = async (songId: string) => {
    try {
      const res = await api.get(`/comments/allCommentsNumber?song_id=${songId}`);
      return Number(res.data); //  API returns "plain number"
    } catch (error) {
      console.error("Failed to get comments", error);
      return 0;
    }
  };

  useEffect(() => {
    fetchSongs(page, filter);
  }, [page]);

  useEffect(() => {
  const fetchLikesForSongs = async () => {
    const likesMap: Record<string, number> = {};

    await Promise.all(
      songs.map(async (song) => {
        likesMap[song.id] = await getLikes(song.id);
      })
    );

    setLikes(likesMap);
  };

  if (songs.length > 0) {
    fetchLikesForSongs();
  }
}, [songs]);

useEffect(()=>{
  const fetchCommentsForSongs = async () => {
    // it is returning an array of comments
    const commentsMap: Record<string, number> = {};

    await Promise.all(
      songs.map(async (song) => {
        commentsMap[song.id] = await getComments(song.id);
      })
    );

    setComments(commentsMap);
  };

  if (songs.length > 0) {
    fetchCommentsForSongs();
  }
}, [songs]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-red-700 border-t-transparent border-solid rounded-full animate-spin"></div>

          {/* Animated text */}
          <div className="flex space-x-1">
            <span className="animate-ping">.</span>
            <span className="animate-ping animation-delay-200">.</span>
            <span className="animate-ping animation-delay-400">.</span>
          </div>

          <p className="text-gray-600 text-lg font-medium">Loading songs</p>
          <img src={icon} className=" animate-bounce max-w-20" alt="" />
        </div>
      </div>

    );
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center bg-gray-50 shadow-xl rounded-lg px-4 py-2 hover:shadow-2xl transition-all duration-300">
          <img src={logo} alt="Logo" className="h-12 w-auto mr-2" />
          <span className="text-xl font-bold text-gray-800"></span>
        </Link>

        {/* Filter Button */}
        <div className="flex gap-2 items-center bg-gray-50 border border-red-950/25 text-white font-semibold rounded-lg px-4 py-2 transition-colors duration-300 shadow-md hover:shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-950"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0114 13v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5a1 1 0 01-.293-.293L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <select name="filter" id="filter"
            onChange={
              (e) => {
                setFilter(e.target.value)
              }
            }
            className=" text-red-950 focus:outline-none ">
            {/* <option>{filter}</option> */}
            <option value="ALL">All</option>
            <option value="IGISABISHO">IGISABISHO</option>
            <option value="TUBABARIRE">TUBABARIRE</option>
            <option value="GUHAZWA">Guhazwa</option>
          </select>

          <button onClick={() => {
            fetchSongs(page, filter)
          }}
            className="bg-red-600/75 py-2 px-4 rounded-sm shadow-red-950/25"
          >Find</button>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 px-6 py-10 ">

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3   pt-10 pb-10 px-4 rounded-lg">
          {songs.map((song) => (
            <div
              key={song.id}
              onClick={() => navigate(`/songs/${song.id}`)}
              className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            >
              {/* PREVIEW */}
              <div className="h-48 bg-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
                {song.video_file ? (
                  <video
                    src={song.video_file}
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : song.external_link && getYoutubeEmbedUrl(song.external_link) ? (
                  <iframe
                    src={getYoutubeEmbedUrl(song.external_link)!}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : song.pdf_sheet ? (
                  <div className="text-center text-gray-600">
                    📄
                    <p className="text-sm mt-1">Sheet Music</p>
                  </div>
                ) : song.audio_file ? (
                  <div className="text-center text-gray-600">
                    🎧
                    <p className="text-sm mt-1">Audio</p>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No preview available</div>
                )}
              </div>


              {/* INFO */}
              {/* {getLikes(song.id)} */}
              <div className="p-4">
                <h2 className="font-semibold text-lg">{song.name}</h2>
              </div>

              <div className="details-count flex flex-row mb-4">
                <span className="more_song_details text-sm text-gray-500 mb-2 px-4">Views: {song.view_count}</span>
                <span className="more_song_details text-sm text-gray-500 mb-2 px-4">Likes: {likes[song.id] ?? 0}</span>
                <span className="more_song_details text-sm text-gray-500 mb-2 px-4">Comments: {comments[song.id] ?? 0}</span>
              </div>
            </div>
          ))}
        </div>


        {/* Pagination Controls */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            className={`px-4 py-2 rounded text-white ${page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-700 hover:bg-red-600"}`}
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">{page} / {totalPages}</span>
          <button
            className={`px-4 py-2 rounded text-white ${page === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-red-700 hover:bg-red-600"}`}
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
