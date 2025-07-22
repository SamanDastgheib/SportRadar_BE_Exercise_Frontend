import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/eventResults')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(setEvents)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger mt-4">Failed to load events.</div>;

  // Define a dark blue color for reuse
  const darkBlue = '#0a1931';

  return (
    <div className="container-fluid mt-5 pt-4 d-flex justify-content-center">
      <div className="card shadow-lg border-0 w-100" style={{maxWidth: '1100px', borderRadius: '18px', background: '#fff', padding: '2rem 1.5rem'}}>
        <h2 className="mb-4 fw-bold" style={{color: '#e30613'}}>Events</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0" style={{minWidth: '700px', fontSize: '1.08rem', borderRadius: '12px', overflow: 'hidden'}}>
            <thead style={{backgroundColor: darkBlue, color: '#fff'}}>
              <tr style={{fontWeight: 600, fontSize: '1.1rem'}}>
                <th>Day</th>
                <th>Date</th>
                <th>Time</th>
                <th>Sport</th>
                <th>Team 1</th>
                <th>Team 2</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} style={{verticalAlign: 'middle'}}>
                  <td>{event.day}</td>
                  <td>{event.date}</td>
                  <td>{event.time}</td>
                  <td><span className="badge d-inline-block text-center" style={{backgroundColor: '#e30613', color: '#fff', fontWeight: 500, minWidth: '80px', width: '100px', borderRadius: '12px', fontSize: '1rem'}}>{event.sport}</span></td>
                  <td><span className="fw-semibold" style={{color: darkBlue}}>{event.team1}</span></td>
                  <td><span className="fw-semibold" style={{color: darkBlue}}>{event.team2}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddEvent() {
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    event_date: '',
    event_time: '',
    sport_id: '',
    team1_id: '',
    team2_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/sports')
      .then(res => res.json())
      .then(setSports)
      .catch(() => setSports([]));
    fetch('http://localhost:8000/teams')
      .then(res => res.json())
      .then(setTeams)
      .catch(() => setTeams([]));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.event_date || !form.event_time || !form.sport_id || !form.team1_id || !form.team2_id) {
      setError('All fields are required.');
      return;
    }
    if (form.team1_id === form.team2_id) {
      setError('Team 1 and Team 2 must be different.');
      return;
    }
    setLoading(true);
    try {
      // 1. Create event
      const eventRes = await fetch('http://localhost:8000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
        body: JSON.stringify({
          event_date: form.event_date,
          event_time: form.event_time,
          sport_id: Number(form.sport_id)
        })
      });
      if (!eventRes.ok) throw new Error('Failed to create event');
      const eventData = await eventRes.json();
      // 2. Add teams to event
      const eventTeamRes = await fetch('http://localhost:8000/eventTeam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
        body: JSON.stringify({
          event_id: eventData.id,
          team1_id: Number(form.team1_id),
          team2_id: Number(form.team2_id)
        })
      });
      if (!eventTeamRes.ok) throw new Error('Failed to assign teams to event');
      setSuccess('Event and teams added successfully!');
      setForm({ event_date: '', event_time: '', sport_id: '', team1_id: '', team2_id: '' });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <h2 className="fw-bold mb-4" style={{color: '#e30613'}}>Add Event</h2>
      <form className="card shadow p-4 mx-auto" style={{maxWidth: 600, borderRadius: 16, background: '#fff'}} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Event Date</label>
          <input type="date" className="form-control" name="event_date" value={form.event_date} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Event Time</label>
          <input type="time" className="form-control" name="event_time" value={form.event_time} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Sport</label>
          <select className="form-select" name="sport_id" value={form.sport_id} onChange={handleChange} required>
            <option value="">Select sport</option>
            {sports.map(s => <option key={s.id} value={s.id}>{s.name || s.sport || s.id}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Team 1</label>
          <select className="form-select" name="team1_id" value={form.team1_id} onChange={handleChange} required>
            <option value="">Select team 1</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name || t.team || t.id}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label fw-semibold">Team 2</label>
          <select className="form-select" name="team2_id" value={form.team2_id} onChange={handleChange} required>
            <option value="">Select team 2</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name || t.team || t.id}</option>)}
          </select>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button type="submit" className="btn btn-danger w-100 fw-bold" disabled={loading} style={{backgroundColor: '#e30613', border: 'none', fontSize: '1.1rem'}}>
          {loading ? 'Submitting...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
}

function App() {
  // Define a dark blue color for reuse
  const darkBlue = '#0a1931';
  return (
    <Router>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{background: `linear-gradient(90deg, ${darkBlue} 0%, #222 100%)`, borderBottom: '3px solid #e30613', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{color: '#fff', fontSize: '1.7rem', letterSpacing: '1px'}}>
              <span style={{color: '#e30613', fontWeight: 'bold', fontSize: '2rem', marginRight: '0.3rem'}}>●</span>SportRadar
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/events" style={{color: '#fff', fontWeight: '500', fontSize: '1.1rem'}}>Events</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-event" style={{color: '#fff', fontWeight: '500', fontSize: '1.1rem'}}>Add Event</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main style={{paddingTop: '80px', minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #f7f7f7 100%)'}}>
        <Routes>
          <Route path="/events" element={<Events />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/" element={<div className="container mt-5 pt-4"><h2 className="fw-bold" style={{color: '#e30613'}}>Welcome to SportRadar!</h2></div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
