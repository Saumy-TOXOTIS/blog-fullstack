// client/src/components/TiptapMenuBar.jsx
import React from 'react';

const TiptapMenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const menuItems = [
        { type: 'bold', icon: '𝐁' },
        { type: 'italic', icon: '𝑰' },
        { type: 'strike', icon: 'S' },
        { type: 'code', icon: 'ᐸ/>' },
        { type: 'heading', level: 1, icon: 'H₁' },
        { type: 'heading', level: 2, icon: 'H₂' },
        { type: 'bulletList', icon: '•' },
        { type: 'orderedList', icon: '1.' },
        { type: 'codeBlock', icon: '🗎' },
        { type: 'blockquote', icon: '“' },
        { type: 'horizontalRule', icon: '―' },
        { type: 'undo', icon: '↶' },
        { type: 'redo', icon: '↷' },
    ];

    const getAction = (item) => {
        switch (item.type) {
            case 'heading':
                return () => editor.chain().focus().toggleHeading({ level: item.level }).run();
            case 'bulletList':
                return () => editor.chain().focus().toggleBulletList().run();
            case 'orderedList':
                return () => editor.chain().focus().toggleOrderedList().run();
            case 'codeBlock':
                return () => editor.chain().focus().toggleCodeBlock().run();
            case 'blockquote':
                return () => editor.chain().focus().toggleBlockquote().run();
            case 'horizontalRule':
                return () => editor.chain().focus().setHorizontalRule().run();
            case 'undo':
                return () => editor.chain().focus().undo().run();
            case 'redo':
                return () => editor.chain().focus().redo().run();
            default:
                return () => editor.chain().focus().toggleMark(item.type).run();
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-900/50 border border-gray-700/50 rounded-t-xl">
            {menuItems.map((item, index) => (
                <button
                    key={index}
                    onClick={getAction(item)}
                    disabled={item.type === 'undo' ? !editor.can().undo() : item.type === 'redo' ? !editor.can().redo() : false}
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200
            ${editor.isActive(item.type, item.level ? { level: item.level } : {}) ? 'bg-purple-600 text-white' : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/80'}
            disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                    {item.icon}
                </button>
            ))}
        </div>
    );
};

export default TiptapMenuBar;