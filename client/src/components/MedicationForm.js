import React, { useState } from 'react';
import axios from 'axios';

const MedicationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    photo: null,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token'); // make sure token is saved after login
    if (!token) {
      return setMessage('Please log in first.');
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('dosage', formData.dosage);
    data.append('frequency', formData.frequency);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      await axios.post('http://localhost:5000/medications', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Medication added successfully.');
      setFormData({ name: '', dosage: '', frequency: '', photo: null });
    } catch (err) {
      setMessage('Failed to add medication.');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Add Medication</h2>
      <input
        type="text"
        name="name"
        placeholder="Medication Name"
        value={formData.name}
        onChange={handleChange}
        required
      /><br />
      <input
        type="text"
        name="dosage"
        placeholder="Dosage (e.g. 200mg)"
        value={formData.dosage}
        onChange={handleChange}
        required
      /><br />
      <input
        type="text"
        name="frequency"
        placeholder="Frequency (e.g. Once a day)"
        value={formData.frequency}
        onChange={handleChange}
        required
      /><br />
      <input
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleFileChange}
      /><br />
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default MedicationForm;
