import React from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react'; // Lucide icons
import { useAuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Navbar() {
    const { authUser, setAuthUser } = useAuthContext();

    const handleLogout = async () => {
        try {
            const res = await axios.post('https://todobackend-production-7fa7.up.railway.app/api/user/logout', {}, {
                withCredentials: true,
            });

            const data = res.data;
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.removeItem('user');
            setAuthUser(null);
            window.location.href = '/login';
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error(err.response?.data || err.message || 'Logout failed, please try again.');
        }
    };


    return (
        <nav className="w-full flex items-center justify-between px-6 py-4 shadow-md bg-white">


            <div className="text-xl font-bold">
                <span className="text-violet-600">ToDo</span>
            </div>
            <div className="flex items-center gap-4">
                {authUser ? (
                    <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Button>
                ) : (
                    <Link to="/login" className="text-violet-600 hover:underline">

                        <User className="w-6 h-6" />
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
