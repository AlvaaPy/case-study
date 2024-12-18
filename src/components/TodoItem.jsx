import React from 'react';

const TodoItem = ({ todo, onDelete, onToggleComplete, onSelect, isSelected }) => {
    return (
        <div 
            className={`todo-item d-flex align-items-center p-3 border-bottom ${todo.completed ? 'bg-light text-muted' : ''}`}
        >
            <div className="form-check me-3">
                <input 
                    type="checkbox" 
                    className="form-check-input" 
                    checked={isSelected}
                    onChange={() => onSelect(todo.id)}
                />
            </div>
            <div 
                className="flex-grow-1" 
                onClick={() => onToggleComplete(todo.id)}
                style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    cursor: 'pointer'
                }}
            >
                <h5 className="m-0">{todo.title}</h5>
                <small className="text-muted">
                    {new Date(todo.createdAt).toLocaleString()}
                </small>
            </div>
            <button 
                className="btn btn-danger btn-sm" 
                onClick={() => onDelete(todo.id)}
            >
                <i className="bi bi-trash"></i>
            </button>
        </div>
    );
};

export default TodoItem;