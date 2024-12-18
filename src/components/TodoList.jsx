import React, { useEffect, useState } from 'react';
import { fetchTodos, deleteTodo, updateTodo } from '../api';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [selectedTodos, setSelectedTodos] = useState([]);
    const [filter, setFilter] = useState('all');

    // Fetch todos on component mount
    useEffect(() => {
        const getTodos = async () => {
            try {
                const response = await fetchTodos();
                setTodos(response.data.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                ));
            } catch (error) {
                console.error('Failed to fetch todos', error);
            }
        };
        getTodos();
    }, []);

    // Toggle todo completion
    const toggleTodoCompletion = async (id) => {
        try {
            const todoToUpdate = todos.find(todo => todo.id === id);
            const updatedTodo = { 
                ...todoToUpdate, 
                completed: !todoToUpdate.completed 
            };
            
            await updateTodo(id, updatedTodo);
            setTodos(todos.map(todo => 
                todo.id === id ? updatedTodo : todo
            ));
        } catch (error) {
            console.error('Failed to update todo', error);
        }
    };

    // Delete a single todo
    const handleDelete = async (id) => {
        try {
            await deleteTodo(id);
            setTodos(todos.filter(todo => todo.id !== id));
            setSelectedTodos(selectedTodos.filter(selectedId => selectedId !== id));
        } catch (error) {
            console.error('Failed to delete todo', error);
        }
    };

    // Toggle todo selection
    const toggleTodoSelection = (id) => {
        setSelectedTodos(prev => 
            prev.includes(id) 
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    // Select all todos
    const selectAllTodos = () => {
        setSelectedTodos(
            selectedTodos.length === filteredTodos.length 
                ? [] 
                : filteredTodos.map(todo => todo.id)
        );
    };

    // Delete selected todos
    const deleteSelectedTodos = async () => {
        try {
            await Promise.all(selectedTodos.map(id => deleteTodo(id)));
            setTodos(todos.filter(todo => !selectedTodos.includes(todo.id)));
            setSelectedTodos([]);
        } catch (error) {
            console.error('Failed to delete selected todos', error);
        }
    };

    // Filter todos
    const filteredTodos = todos.filter(todo => {
        switch (filter) {
            case 'active':
                return !todo.completed;
            case 'completed':
                return todo.completed;
            default:
                return true;
        }
    });

    return (
        <div className="container-fluid vh-100 d-flex flex-column bg-light">
            <div className="row">
                <div className="col-12 bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                    <h1 className="m-0">Todo List</h1>
                    <div>
                        <span className="badge bg-light text-dark me-2">
                            {todos.length} Total
                        </span>
                        <span className="badge bg-success me-2">
                            {todos.filter(todo => todo.completed).length} Completed
                        </span>
                    </div>
                </div>
            </div>

            <div className="row flex-grow-1 overflow-hidden">
                <div className="col-12 d-flex flex-column h-100">
                    <div className="p-3 bg-white shadow-sm">
                        <TodoForm setTodos={setTodos} />
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="btn-group" role="group">
                                <button 
                                    className={`btn btn-outline-primary ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </button>
                                <button 
                                    className={`btn btn-outline-primary ${filter === 'active' ? 'active' : ''}`}
                                    onClick={() => setFilter('active')}
                                >
                                    Active
                                </button>
                                <button 
                                    className={`btn btn-outline-primary ${filter === 'completed' ? 'active' : ''}`}
                                    onClick={() => setFilter('completed')}
                                >
                                    Completed
                                </button>
                            </div>

                            <div>
                                <button 
                                    className="btn btn-outline-danger me-2"
                                    onClick={deleteSelectedTodos}
                                    disabled={selectedTodos.length === 0}
                                >
                                    Delete Selected
                                </button>
                                <div className="form-check d-inline-block">
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input" 
                                        id="selectAll"
                                        checked={selectedTodos.length === filteredTodos.length}
                                        onChange={selectAllTodos}
                                    />
                                    <label className="form-check-label" htmlFor="selectAll">
                                        Select All
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div 
                        className="flex-grow-1 overflow-auto" 
                        style={{ maxHeight: 'calc(100vh - 250px)' }}
                    >
                        {filteredTodos.length === 0 ? (
                            <div className="text-center p-5 text-muted">
                                <h4>No todos found</h4>
                                <p>Add a new todo to get started</p>
                            </div>
                        ) : (
                            filteredTodos.map(todo => (
                                <TodoItem 
                                    key={todo.id}
                                    todo={todo}
                                    onDelete={handleDelete}
                                    onToggleComplete={toggleTodoCompletion}
                                    onSelect={toggleTodoSelection}
                                    isSelected={selectedTodos.includes(todo.id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoList;