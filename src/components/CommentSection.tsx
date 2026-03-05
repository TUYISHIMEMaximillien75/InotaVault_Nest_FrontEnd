import { useEffect, useState } from "react";
// import { api } from "../api/api.ts";
import { getComments } from "../api/comments.api";
import { postComments } from "../api/comments.api";
import { useNavigate } from "react-router-dom";
interface Comment {
    id: string;
    name: string;
    comment: string;
    createdAt: string;
}

interface CommentsSectionProps {
    songId: string;
}

export default function CommentsSection({ songId }: CommentsSectionProps) {
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");


    const nextstep = window.location.href;


    const fetchComments = async (song_id: string) => {
        try {

            // const song_id = await songId;
            getComments(song_id).then((res: any) => {
                setComments(res.data);
            });
            //   setComments(res);
            // console.log(song_id);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await postComments(songId, newComment);
            // Update local state to show the new comment immediately
            setComments([res.data, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchComments(songId);
    }, [songId]);

    return (
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
                <h3 className="text-lg font-bold text-gray-800">
                    Comments <span className="text-gray-400 font-normal ml-2">({comments.length})</span>
                </h3>
            </div>

            {/* Input Section */}
            <form onSubmit={handleSubmit} className="p-6 bg-gray-50/50">
                <div className="flex flex-col space-y-3">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                        rows={3}
                    />
                    <div className="flex justify-end">
                        {token ? (
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="px-6 py-2 bg-red-700 text-white rounded-lg font-semibold text-sm hover:bg-red-800 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                {isSubmitting ? "Posting..." : "Post Comment"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => { localStorage.setItem("journey_to", nextstep); navigate("/login") }}
                                className="px-6 py-2 bg-red-700 text-white rounded-lg font-semibold text-sm hover:bg-red-800 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                Login to Comment
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* List Section */}
            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                {loading ? (
                    <div className="p-10 text-center text-gray-400 text-sm">Loading comments...</div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="p-6 hover:bg-gray-50/30 transition-colors">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs">
                                    {comment.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold text-gray-800">{comment.name}</h4>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-tight">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {comment.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center text-gray-400 text-sm italic">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>
        </div>
    );
}