import { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    API.get('/medications').then(res => setMeds(res.data));
  }, []);

  const takeMed = async (id) => {
    await API.put(`/medications/${id}/take`);
    const res = await API.get('/medications');
    setMeds(res.data);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {meds.map(m => (
        <div key={m.id}>
          <p><b>{m.name}</b> - {m.dosage} - {m.frequency}</p>
          <p>Taken Dates: {m.taken_dates.join(', ')}</p>
          <button onClick={() => takeMed(m.id)}>Mark as Taken</button>
        </div>
      ))}
    </div>
  );
}
