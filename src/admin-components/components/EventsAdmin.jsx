import React, { useState, useEffect, useRef } from "react";
import { Calendar, Plus, Trash2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { getEvents, postEvent, deleteEvent } from "../../services/event.service";
import { uploadFileToS3, ToHref } from "../../services/file.service";

const MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024;




export default function EventsAdmin() {
  const imageInputRef = useRef(null);
  const agendaInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [eventTitle, setEventTitle] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventGuestsStr, setEventGuestsStr] = useState("");
  const [eventHostsStr, setEventHostsStr] = useState("");
  const [eventAgendaFile, setEventAgendaFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      if (Array.isArray(data) && data.length > 0) {
        for (const item of data) {
          const link = await ToHref(item.event_agenda, "summit-agenda.pdf");
          item.event_agenda = link;
        }
      }
      setItems(data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventTitle || !eventVenue) return;
    setSubmitting(true);
    setMessage(null);

    const guestsArr = eventGuestsStr.split(",").map((g) => g.trim()).filter(Boolean);
    const hostsArr = eventHostsStr.split(",").map((h) => h.trim()).filter(Boolean);

    if (!eventAgendaFile) {
      setMessage({ type: "error", text: "Please select an agenda PDF." });
      setSubmitting(false);
      return;
    }

    if (!imageFile) {
      setMessage({ type: "error", text: "Please select an event banner image." });
      setSubmitting(false);
      return;
    }

    try {
      const [agendaUpload, imageUpload] = await Promise.all([
        uploadFileToS3(eventAgendaFile),
        uploadFileToS3(imageFile),
      ]);

      await postEvent({
        event_title: eventTitle,
        event_venue: eventVenue,
        event_adress: eventAddress,
        event_date: eventDate || new Date().toISOString().split("T")[0],
        event_guests: guestsArr,
        event_description: eventDescription,
        event_hosts: hostsArr,
        event_agenda: agendaUpload.fileKey,
        image: imageUpload.fileKey,
      });
      setMessage({ type: "success", text: "Event created successfully!" });
      setEventTitle("");
      setEventVenue("");
      setEventAddress("");
      setEventDate("");
      setEventDescription("");
      setEventGuestsStr("");
      setEventHostsStr("");
      setEventAgendaFile(null);
      setImageFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      if (agendaInputRef.current) {
        agendaInputRef.current.value = "";
      }
      await loadData();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to create event." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      setItems((prev) => prev.filter((item) => (item.id || item._id) !== id));
      setMessage({ type: "success", text: "Event deleted." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete event." });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-headline-md text-2xl font-bold text-primary flex items-center gap-2">
            <Calendar size={24} className="text-accent" /> Events & Summits Management
          </h2>
          <p className="text-xs text-on-surface-variant">Create and organize policy summits, conferences, and virtual webinars.</p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-xs font-semibold flex items-center gap-2 ${message.type === "success"
            ? "bg-green-500/10 text-green-700 border border-green-500/20"
            : "bg-red-500/10 text-red-700 border border-red-500/20"
            }`}
        >
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Add New Form */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Plus size={18} className="text-accent" /> Add Event
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. Pakistan Digital Asset Policy Summit 2026"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Venue *</label>
            <input
              type="text"
              required
              value={eventVenue}
              onChange={(e) => setEventVenue(e.target.value)}
              placeholder="e.g. Serena Hotel, Islamabad"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Address</label>
            <input
              type="text"
              value={eventAddress}
              onChange={(e) => setEventAddress(e.target.value)}
              placeholder="e.g. Khayaban-e-Suhrawardy, G-5/1, Islamabad"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Event Banner Image *</label>
            <input
              type="file"
              accept="image/*"
              required
              ref={imageInputRef}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setImageFile(null);
                  return;
                }

                try {
                  setImageFile(file);
                } catch (error) {
                  console.error(error);
                  setImageFile(null);
                  setMessage({ type: "error", text: "Failed to process the selected image." });
                }
              }}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
            <p className="mt-1 text-[11px] text-on-surface-variant">
              Selected image will be uploaded to S3 before saving the event.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Guests / Keynote Speakers (comma-separated)</label>
            <input
              type="text"
              value={eventGuestsStr}
              onChange={(e) => setEventGuestsStr(e.target.value)}
              placeholder="Governor SBP, Chairman SECP, Tech Lead"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Hosts / Organizers (comma-separated)</label>
            <input
              type="text"
              value={eventHostsStr}
              onChange={(e) => setEventHostsStr(e.target.value)}
              placeholder="Token Times Editorial Board, PVARA Committee"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Agenda PDF *</label>
            <input
              type="file"
              accept="application/pdf"
              required
              ref={agendaInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setEventAgendaFile(null);
                  return;
                }

                if (file.size > MAX_PDF_SIZE_BYTES) {
                  setEventAgendaFile(null);
                  if (agendaInputRef.current) {
                    agendaInputRef.current.value = "";
                  }
                  setMessage({ type: "error", text: "Agenda PDF must be 5MB or smaller." });
                  return;
                }

                setEventAgendaFile(file);
              }}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
            <p className="mt-1 text-[11px] text-on-surface-variant">
              Select a PDF up to 5MB. It will be uploaded to S3 before saving the event.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Event Description</label>
            <textarea
              rows={3}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Comprehensive summary of event topics, keynote speeches, and roundtable sessions..."
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-primary text-on-primary font-label-caps text-xs font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Create Event"}
          </button>
        </div>
      </form>

      {/* Events List */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <FileText size={18} className="text-accent" /> Organized Events ({items.length})
        </h3>

        {loading ? (
          <p className="text-xs text-on-surface-variant py-4">Loading events...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4">No events added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-caps uppercase">
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Venue</th>
                  <th className="py-2.5 px-3">Event Date</th>
                  <th className="py-2.5 px-3">Agenda</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-surface-container-low/50">
                    <td className="py-3 px-3 font-semibold text-on-surface max-w-xs truncate">
                      {item.event_title}
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant">{item.event_venue}</td>
                    <td className="py-3 px-3 text-on-surface-variant font-data-tabular">{item.event_date || "N/A"}</td>
                    <td className="py-3 px-3 text-on-surface-variant truncate max-w-[120px]">
                      {item.event_agenda ? (
                        <a href={item.event_agenda} target="_blank" rel="noreferrer" className="text-accent underline">
                          Agenda
                        </a>
                      ) : (
                        "None"
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id || item._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
