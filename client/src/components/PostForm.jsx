// client/src/components/PostForm.jsx
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapMenuBar from './TiptapMenuBar';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function PostForm({ postToEdit }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[200px]',
            },
        },
    });

    // If we are editing a post, populate the form fields
    useEffect(() => {
        if (postToEdit) {
            setTitle(postToEdit.title);
            // Set the editor content when it's ready
            if (editor && postToEdit.content) {
                editor.commands.setContent(postToEdit.content);
            }
            if (postToEdit.imageUrl) {
                setImagePreview(`${postToEdit.imageUrl.startsWith('/') ? 'http://localhost:5000' : ''}${postToEdit.imageUrl}`);
            }
        }
    }, [postToEdit, editor]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const htmlContent = editor.getHTML();

        if (!title.trim() || htmlContent === '<p></p>') {
            setError('Title and content are required.');
            return;
        }
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', htmlContent);
            if (image) {
                formData.append('image', image);
            }

            if (postToEdit) {
                // Update existing post
                await api.put(`/posts/${postToEdit._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                // Create new post
                await api.post('/posts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
            console.error('Error submitting post:', err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex-grow bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8 min-h-screen">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            background: `rgba(${i % 3 === 0 ? '139, 92, 246' : i % 3 === 1 ? '59, 130, 246' : '6, 182, 212'}, ${Math.random() * 0.2 + 0.05})`,
                            animationDuration: `${Math.random() * 20 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    ></div>
                ))}
            </div>

            <div className="max-w-3xl mx-auto mt-8 md:mt-16">
                <div className="relative bg-gray-900/70 backdrop-blur-lg border border-gray-700/50 rounded-3xl shadow-2xl shadow-purple-900/20 overflow-hidden transition-all duration-500 hover:shadow-purple-900/30">
                    {/* Decorative Gradient Elements */}
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-900/15 via-purple-900/5 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/15 via-blue-900/5 to-transparent"></div>

                    <div className="relative z-10 p-8 md:p-10">
                        {/* Header Section */}
                        <div className="mb-10 text-center group">
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent inline-block">
                                Craft Your Story
                            </h2>
                            <p className="text-gray-400/90 mt-3 text-lg max-w-md mx-auto">
                                Share your unique perspective with the world
                            </p>
                            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mx-auto opacity-80 group-hover:w-32 transition-all duration-500"></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Title Field */}
                            <div className="group">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300/90 mb-3 ml-1">
                                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Post Title</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="relative w-full px-5 py-4 bg-gray-800/70 border border-gray-700/50 rounded-xl text-white placeholder-gray-500/70 focus:border-purple-500/70 focus:outline-none focus:ring-2 focus:ring-purple-900/20 transition-all duration-300"
                                        placeholder="Give your post a title..."
                                    />
                                </div>
                            </div>

                            {/* Rich Text Editor */}
                            <div className="bg-gray-800/70 border border-gray-700/50 rounded-xl">
                                <TiptapMenuBar editor={editor} />
                                <EditorContent editor={editor} />
                            </div>

                            <div className="group">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-300/90 mb-3 ml-1">
                                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Featured Image (Optional)</span>
                                </label>

                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-700/50 rounded-xl p-10 text-center bg-gray-900/30 hover:border-purple-500/50 transition-all duration-500 cursor-pointer overflow-hidden">
                                        <div className="relative z-10">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-500/80 mb-4 group-hover:text-purple-400 transition-colors duration-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-400/90 group-hover:text-gray-300 transition-colors duration-300 text-lg">
                                                {image ? 'Perfect! Image selected' : 'Drag & drop or click to upload'}
                                            </p>
                                            <p className="text-sm text-gray-500/70 mt-2">Supports: JPG, PNG, GIF (Max 10MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {imagePreview && (
                                    <div className="mt-6 border border-gray-700/50 rounded-xl overflow-hidden transition-all duration-500 group">
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-80 object-cover group-hover:opacity-90 transition-opacity duration-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setImage(null);
                                                }}
                                                className="absolute top-4 right-4 bg-gray-900/80 hover:bg-red-600/90 rounded-full p-2 transition-all duration-300 shadow-lg"
                                                title="Remove image"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="p-4 bg-gray-800/50 text-center text-sm text-gray-400/80 border-t border-gray-700/50">
                                            Your stunning visual preview
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-5 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 py-4 px-6 bg-gray-800/70 hover:bg-gray-700/90 border border-gray-700/50 rounded-xl text-gray-300 hover:text-red-400 font-medium flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-red-900/20 group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Discard</span>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>

                                <button
                                    type="submit"
                                    className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-900/40 flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Publish Post
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700/30 to-indigo-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
        </div>
    );
}

export default PostForm;