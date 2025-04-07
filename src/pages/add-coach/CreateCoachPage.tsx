import { useEffect, useState, useContext } from 'react';
import './CreateCoachPage.css';
import AuthContext from '../../context/AuthContext';
import { useCreateCoach } from '../../features/Coach/api/useCreateCoach';
import { fetchCoaches } from '../../features/coach-booking-calendar/api/getCoaches';

type FormValues = {
  name: string;
  email: string;
  pricePerHour: string;
  expertiseLevels: string;
};

function CreateCoachPage() {
  const { user } = useContext(AuthContext)!;
  const clubId = user?.currentActiveClubId;

  const [coaches, setCoaches] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<FormValues>({
    name: '',
    email: '',
    pricePerHour: '',
    expertiseLevels: '',
  });

  const { mutate, isPending } = useCreateCoach();

  useEffect(() => {
    if (clubId) {
      fetchCoaches(clubId).then((data) => setCoaches(data));
    }
  }, [clubId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      clubId,
      expertiseLevels: [formData.expertiseLevels], 
    };

    mutate(payload, {
      onSuccess: () => {
        alert('Coach created successfully!');
        setShowForm(false);
        setFormData({
          name: '',
          email: '',
          pricePerHour: '',
          expertiseLevels: '',
        });
        if (clubId) {
          fetchCoaches(clubId).then((data) => setCoaches(data));
        }
      },
      onError: (error: any) =>
        alert(error?.message ?? 'Something went wrong.'),
    });
  };

  return (
    <div className="create-coach-page">
      {!showForm ? (
        <>
          <h2>Coaches List</h2>
          <button className="add-button" onClick={() => setShowForm(true)}>
            Add Coach
          </button>
          <table className="coach-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Price Per Hour</th>
                <th>Expertise Level</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((coach) => (
                <tr key={coach.id}>
                  <td>{coach.name}</td>
                  <td>{coach.email}</td>
                  <td>{coach.pricePerHour}</td>
                  <td>{coach.expertiseLevels.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="coach-form">
          <h2>Create New Coach</h2>

          <label className="form-label">
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </label>

          <label className="form-label">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </label>

          <label className="form-label">
            Price Per Hour:
            <input
              type="number"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              className="form-input"
              required
            />
          </label>

          <label className="form-label">
            Expertise Level:
            <select
              name="expertiseLevels"
              value={formData.expertiseLevels}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select an expertise level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>

          <div className="button-row">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Create Coach'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreateCoachPage;
