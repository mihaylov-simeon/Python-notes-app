from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("notes/restore/<int:pk>/", views.NoteRestore.as_view(), name="restore-note"),
    path("notes/permanent-delete/<int:pk>/", views.NotePermanentDelete.as_view(), name="permanent-delete-note"),
    path("notes/<int:pk>/", views.NoteUpdate.as_view(), name="update-note"),
    path("deleted-notes/", views.DeletedNotesList.as_view(), name="deleted-notes"),
]