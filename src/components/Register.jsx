import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Register() {
  const { setAuthUser } = useAuthContext();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/user/register', formData, {
        withCredentials: true,
      });

      const data = res.data;

      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem('user', JSON.stringify(data));
      setAuthUser(data);
      window.location.href = '/';
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data || err.message || 'Registration failed, please try again.');
    }
  };

  return (
    <div className="max-w-md mx-5 sm:mx-auto mt-20 p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center text-violet-600">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='flex flex-col gap-2'>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" className="w-full cursor-pointer bg-violet-600 text-white">
          Register
        </Button>
        <h1 className="text-center">
          Already have an account? <Link className='cursor-pointer' to="/login">Login</Link>
        </h1>
      </form>
    </div>
  );
}

export default Register;
