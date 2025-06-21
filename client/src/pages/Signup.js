import { useState } from 'react';
import API from '../api';

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '', role: 'patient' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/signup', form);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch {
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Signup</h2>
      <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />
      <input placeholder="Password" type="password" onChange={e => setForm({...form, password: e.target.value})} />
      <select onChange={e => setForm({...form, role: e.target.value})}>
        <option value="patient">Patient</option>
        <option value="caretaker">Caretaker</option>
      </select>
      <button type="submit">Signup</button>
    </form>
  );
}
