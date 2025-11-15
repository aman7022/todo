import { useState, useEffect } from "react";
import axios from 'axios';

function Todo() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [editId, setEditId] = useState(null);
    const [refresh, setRefresh] = useState(true);

    // ✅ Correct API URL (your backend IP + port)
    const API = "http://65.2.142.243:5000/todos";

    // Fetch all todos
    const fetchTodos = async () => {
        try {
            const res = await axios.get(API);
            setTodos(res.data);
        } catch (error) {
            console.error("Error fetching todos:", error.message);
        }
    };

    // Add or edit todo
    const addOrEditTodo = async () => {
        try {
            if (editId) {
                await axios.put(`${API}/${editId}`, { text });
            } else {
                await axios.post(API, { text });
            }
            setText('');
            setEditId(null);
            fetchTodos();
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Error adding/updating todo:", error.message);
        }
    };

    // Delete todo
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API}/${id}`);
            fetchTodos();
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Error deleting todo:", error.message);
        }
    };

    // Set edit mode
    const editTodo = (todo) => {
        setText(todo.text);
        setEditId(todo._id);
        setRefresh(prev => !prev);
    };

    // Load todos on refresh change
    useEffect(() => {
        fetchTodos();
    }, [refresh]);

    return (
        <div className="todo-container">
            <h1>Todo List</h1>

            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter todo"
            />

            <button onClick={addOrEditTodo}>
                {editId ? 'Update' : 'Add'}
            </button>

            <ul>
                {todos.map((todo) => (
                    <li key={todo._id}>
                        {todo.text}
                        <div>
                            <button onClick={() => editTodo(todo)}>Edit</button>
                            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todo;
