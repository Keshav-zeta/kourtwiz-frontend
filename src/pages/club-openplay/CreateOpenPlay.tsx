import { useState, useEffect, useContext } from "react";
import { useCreateOpenPlay } from "../../features/open-play-sessions/api/useCreateOpenPlay";
import "./CreateOpenPlay.css";
import { useGetCourts } from "../../features/bookings/api/useGetCourts";
import AuthContext from "../../context/AuthContext";

function CreateOpenPlay() {
  const { user } = useContext(AuthContext) || {};
  const clubId = user?.userClubRole?.[0]?.clubId ?? "";

  const [formData, setFormData] = useState({
    clubId: clubId,
    courtName: "",
    courtId: "",
    startTime: "",
    durationMinutes: "",
    skillLevel: "",
    maxPlayers: "",
    registeredPlayers: "",
  });

  const mutation = useCreateOpenPlay();
  const { data: courtsData = [] } = useGetCourts(clubId);

  useEffect(() => {
    if (formData.courtName && courtsData?.length) {
      const matchedCourt = courtsData.find(
        (court) => court.name.toLowerCase() === formData.courtName.toLowerCase()
      );
      setFormData((prev) => ({
        ...prev,
        courtId: matchedCourt ? matchedCourt.id : "",
        clubId: clubId,
      }));
    }
  }, [formData.courtName, courtsData, clubId]);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!formData.courtId) {
      alert("Invalid court name. Please select a valid court.");
      return;
    }
  
    if (!formData.startTime || !formData.durationMinutes || !formData.skillLevel || !formData.maxPlayers) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const payload = {
      clubId: formData.clubId,
      courtId: formData.courtId,
      startTime: formData.startTime,
      durationMinutes: Number(formData.durationMinutes),
      skillLevel: formData.skillLevel,
      maxPlayers: Number(formData.maxPlayers),
      registeredPlayers: [],
    };
  
    mutation.mutate(payload, {
      onSuccess: () => {
        alert("Session created successfully!");
        setFormData({
          clubId: clubId,
          courtName: "",
          courtId: "",
          startTime: "",
          durationMinutes: "",
          skillLevel: "",
          maxPlayers: "",
          registeredPlayers: "",
        });
      },
      onError: (error) => alert(error.message),
    });
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="openplay-form">
      <label className="form-label">
        Court Name:
        <select
          name="courtName"
          value={formData.courtName}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select a court</option>
          {courtsData?.map((court) => (
            <option key={court.id} value={court.name}>
              {court.name}
            </option>
          ))}
  </select>
      </label>
      <label className="form-label">
        Start Time:
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>
      <label className="form-label">
        Duration (Minutes):
        <input
          type="number"
          name="durationMinutes"
          value={formData.durationMinutes}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>
      <label className="form-label">
        Skill Level:
        <select
          name="skillLevel"
          value={formData.skillLevel}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Select skill level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
     </select>
      </label>
      <label className="form-label">
        Max Players:
        <input
          type="number"
          name="maxPlayers"
          value={formData.maxPlayers}
          onChange={handleChange}
          className="form-input"
          required
        />
      </label>
      <button type="submit" className="submit-button">
        Create Session
      </button>
    </form>
  );
}

export default CreateOpenPlay;
