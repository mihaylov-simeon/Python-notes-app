import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME_KEY } from "../constants"
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
  const [notes, setNotes] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [showDeletedNotes, setShowDeletedNotes] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    if (storedUsername) {
      setUsername(storedUsername);
    }
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const getDeletedNotes = () => {
    api
      .get("/api/deleted-notes/")
      .then((res) => res.data)
      .then((data) => {
        setDeletedNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .put(`/api/notes/delete/${id}/`, {})
      .then((res) => {
        if (res.status === 200) {
          console.log("Note marked as deleted successfully!");
          getNotes();
          getDeletedNotes();
        } else {
          alert("Failed to delete note.");
        }
      })
      .catch((error) => alert(error));
  };

  const permanentlyDeleteNote = (id) => {
    api
      .delete(`/api/notes/permanent-delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          console.log("Note permanently deleted successfully!");
          getDeletedNotes();
        } else {
          alert("Failed to permanently delete note.");
        }
      })
      .catch((error) => alert(error));
  };

  const restoreNote = (id) => {
    api
      .put(`/api/notes/restore/${id}/`, {})
      .then((res) => {
        if (res.status === 200) {
          console.log("Note restored successfully!");
          getNotes();
          getDeletedNotes();
        } else {
          alert("Failed to restore note.");
        }
      })
      .catch((error) => alert(error));
  };

  const createOrUpdateNote = (e) => {
    e.preventDefault();
    if (editId) {
      // Update existing note
      api
        .put(`/api/notes/${editId}/`, { content, title })
        .then((res) => {
          if (res.status === 200) {
            setContent("");
            setTitle("");
            setEditId(null);
          } else {
            alert("Failed to update note.");
          }
          getNotes();
        })
        .catch((err) => alert(err));
    } else {
      // Create new note
      api
        .post("/api/notes/", { content, title })
        .then((res) => {
          if (res.status === 201) {
            setContent("");
            setTitle("");
          } else {
            alert("Failed to create note.");
          }
          getNotes();
        })
        .catch((err) => alert(err));
    }
  };

  const handleEdit = (id) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setEditId(id);
    }
  };

  const handleDeletedNotes = () => {
    getDeletedNotes();
    setShowDeletedNotes((prevShowDeletedNotes) => !prevShowDeletedNotes); // Toggle visibility
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USERNAME_KEY);
    navigate("/login");
  };

  console.log("Rendering with username:", username);
  return (
    <div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <div className="username">
        {username && <p>Hello, <span>{username}</span>!</p>}
      </div>
      <form className='home-form' onSubmit={createOrUpdateNote}>
        <h2>{editId ? "Edit Note" : "Create a Note"}</h2>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <input type="submit" value={editId ? "Update" : "Submit"}></input>
      </form>
      <div className="deleted-container-btn">
        <button className="deleted-notes-button" onClick={handleDeletedNotes}>
          {showDeletedNotes ? "Hide Deleted Notes" : "Show Deleted Notes"}
        </button>
      </div>
      <div>
      
        <h2 className="notes-heading">Here are your notes:</h2>
        {notes.length === 0 ? (
          <p className="no-notes">No notes found. Start creating notes!</p>
        ) : (
          notes.map((note) => (
            <Note
              note={note}
              onDelete={deleteNote}
              onEdit={handleEdit}
              key={note.id}
            />
          ))
        )}
      </div>
      {showDeletedNotes && deletedNotes.length > 0 && (
        <div>
          <h2 className="deleted-notes-heading">Here are your deleted notes:</h2>
          {deletedNotes.map((note) => (
            <Note
              note={note}
              onDelete={permanentlyDeleteNote}
              onRestore={restoreNote}
              key={note.id}
              isDeleted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;