import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useAuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

function Login() {
  const { setAuthUser } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://todobackend-production-7fa7.up.railway.app/api/user/login', formData, {
        withCredentials: true,
      })

      const data = await res.data;
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem('user', JSON.stringify(data));
      setAuthUser(data);
      window.location.href = '/';
    } catch (err) {
      console.error(err.response?.data || err.message)
      toast.error(err.response?.data || err.message || 'Login failed, please try again.')
    }
  }

  return (
    <div className="max-w-md mx-5 sm:mx-auto mt-20 p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center text-violet-600">Login</h2>
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
        <Button type="submit" className="w-full bg-violet-600 text-white cursor-pointer">
          Login
        </Button>
        <h1 className='text-center'>Don't have an account? <Link className='cursor-pointer' to={'/register'}>Register</Link></h1>
      </form>
    </div>
  )
}

export default Login
