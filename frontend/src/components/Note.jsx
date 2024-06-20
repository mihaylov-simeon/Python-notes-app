import React from "react";
import "../styles/Note.css";

function Note({ note, onDelete, onRestore, onEdit, isDeleted }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

    return (
        <div className="note-container">
            <p className="note-title">{note.title}</p>
            <p className="note-content">{note.content}</p>
            <p className="note-date">{formattedDate}</p>
            <button className="delete-button" onClick={() => onDelete(note.id)}>
                {isDeleted ? "Delete Permanently" : "Delete"}
            </button>
            <button className="edit-note" onClick={() => isDeleted ? onRestore(note.id) : onEdit(note.id)}>
                {isDeleted ? "Restore" : "Edit"}
            </button>
        </div>
    );
}

export default Note;