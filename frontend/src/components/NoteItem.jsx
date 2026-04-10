import { useState } from "react";
import { updateNote, deleteNote } from '../services/api'

function NoteItem({ note, onDelete, onUpdate }) {
    const [editing, setEditing] = useState(false)
    const [content, setContent] = useState(note.content)
    const [loading, setLoading] = useState(false)

    const handleUpdate = async () => {
        if (!content.trim()) return
        setLoading(true)
        try {
            const res = await updateNote(note.id, { content })
            onUpdate(res.data)
            setEditing(false)
        } catch (err) {
            alert('failed to  update note')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('delete this note')) return
        try {
            await deleteNote(note.id)
            onDelete(note.id)
        } catch (err) {
            alert('failed to delete note')
        }
    }

    return (
        <div className="border border-gray-100 rounded p-3 bg-gray-50">
            {editing ? (
                // Edit mode — show textarea
                <div className="space-y-2">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={2}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="text-xs text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                // View mode — show note content
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700">{note.content}</p>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => setEditing(true)}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
            {/* Show when note was created */}
            <p className="text-xs text-gray-400 mt-1">
                {note.created_at ? new Date(note.created_at).toLocaleDateString() : ''}
            </p>
        </div>
    )
}

export default NoteItem