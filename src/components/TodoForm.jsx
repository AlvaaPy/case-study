import React, { useState } from 'react';
import { addTodo } from '../api';

const TodoForm = ({ setTodos }) => {
    const [title, setTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsAdding(true);
        try {
            const newTodo = { 
                title: title.trim(), 
                completed: false,
                createdAt: new Date().toISOString()
            };
            const response = await addTodo(newTodo);
            setTodos(prevTodos => [...prevTodos, response.data]);
            setTitle('');
        } catch (error) {
            console.error('Failed to add todo', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="d-flex mb-3 shadow-sm"
        >
            <input 
                type="text" 
                className="form-control form-control-lg me-2" 
                placeholder="What needs to be done?" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                disabled={isAdding}
            />
            <button 
                className="btn btn-primary btn-lg" 
                type="submit" 
                disabled={isAdding || !title.trim()}
            >
                {isAdding ? 'Adding...' : 'Add'}
            </button>
        </form>
    );
};

export default TodoForm;