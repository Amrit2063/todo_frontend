import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select';
import { toast } from 'react-toastify';

function Todos() {
    const [task, setTask] = useState('');
    const [todos, setTodos] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editCompleted, setEditCompleted] = useState(false);

    const fetchTodos = async () => {
        try {
            const res = await axios.get('https://todobackend-production-7fa7.up.railway.app/api/todo', { withCredentials: true });
            setTodos(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error(err.response?.data || err.message || 'Failed to fetch todos.');
        }
    };

    const handleAdd = async () => {
        if (!task.trim()) return;
        try {
            const res = await axios.post('https://todobackend-production-7fa7.up.railway.app/api/todo', { title: task }, { withCredentials: true });
            setTodos(prev => [...prev, res.data]);
            setTask('');
            toast.success('Task added successfully!');
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error(err.response?.data || err.message || 'Failed to add task.');
        }
    };

    const openEditModal = (todo) => {
        setEditId(todo._id);
        setEditTitle(todo.title);
        setEditCompleted(todo.isCompleted || false);
        setEditModalOpen(true);
    };

    const handleEdit = async () => {
        try {
            await axios.put(
                `https://todobackend-production-7fa7.up.railway.app/api/todo/${editId}`,
                { title: editTitle, isCompleted: editCompleted },
                { withCredentials: true }
            );
            setEditModalOpen(false);
            fetchTodos();
            toast.success('Task updated successfully!');
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error(err.response?.data || err.message || 'Failed to update task.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://todobackend-production-7fa7.up.railway.app/api/todo/${id}`, { withCredentials: true });
            fetchTodos();
            toast.success('Task deleted successfully!');
        } catch (err) {
            console.error(err.response?.data || err.message);
            toast.error(err.response?.data || err.message || 'Failed to delete task.');
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="relative">
            <div className="max-w-xl mx-auto mt-10 p-4">
                <div className="flex gap-2">
                    <Input
                        className="focus:ring-2 focus:ring-violet-600"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Enter a task"
                    />
                    <Button className="bg-violet-600 text-white cursor-pointer" onClick={handleAdd}>
                        Add Task
                    </Button>
                </div>
                {todos.length === 0 ? (
                    <div className="mt-6 text-center text-gray-500">
                        No tasks available. Please add a task.
                    </div>
                ) : (
                    <div className="mt-6 space-y-2">
                        {todos.map((todo) => (
                            <div key={todo._id} className="flex justify-between items-center border p-3 rounded-lg">
                                <span className={todo.isCompleted ? "line-through text-gray-500" : ""}>
                                    {todo.title}
                                </span>
                                <div className="flex gap-3">
                                    <Pencil className="cursor-pointer hover:text-blue-600" onClick={() => openEditModal(todo)} />
                                    <Trash2 className="cursor-pointer hover:text-red-600" onClick={() => handleDelete(todo._id)} />
                                </div>
                            </div>
                        ))}
                    </div>
                )
                }


            </div>

            {editModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                        <div className="space-y-4">
                            <div className='flex gap-2'>
                                <Label className='mr-4'>Title</Label>
                                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            </div>
                            <div className='flex gap-2'>
                                <Label className='mr-2'>Status</Label>
                                <Select value={editCompleted.toString()} onValueChange={(val) => setEditCompleted(val === 'true')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">Completed</SelectItem>
                                        <SelectItem value="false">Not Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2 justify-center flex-row-reverse mt-22">
                                <Button className="bg-violet-600 text-white cursor-pointer" onClick={handleEdit}>
                                    Save Changes
                                </Button>
                                <Button variant="outline" className="cursor-pointer" onClick={() => setEditModalOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Todos;