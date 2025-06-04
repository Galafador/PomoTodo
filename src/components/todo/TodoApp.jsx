import React from 'react'
import { TodoInput, TodoItem } from '@components/todo/'

function TodoApp() {
            const [todos, setTodos] = React.useState(() => {
                const savedTodos = localStorage.getItem("todos")
                if (savedTodos) {
                    return (JSON.parse(savedTodos))
                }
                else {
                    return ([
                        {id: 1, text: "Add new task by typing on the text box above and then tap the + icon.", checked: false},
                        {id: 2, text: "Tap this task to mark it as cleared.", checked: false},
                        {id: 3, text: "Tap the X icon to the right to delete this task.", checked: false}
                    ])
                }
            })

            // Save todos to localStorage whenever they change
            React.useEffect(() => {
                localStorage.setItem("todos", JSON.stringify(todos))
            }, [todos])

            const addTodo = (text) => {
                setTodos([
                    ...todos,
                    {id: Date.now(), text, checked: false}
                ])
            }

            const deleteTodo = (id) => {
                setTodos(todos.filter((todo) => todo.id !== id))
            }

            const toggleTodo = (id) => {
                setTodos(todos.map((todo) => todo.id === id ? {
                    ...todo,
                    checked: !todo.checked
                } : todo))
            }

            return (
                <div id="todo-app">
                        <TodoInput addItem={addTodo} />
                        <div id="todo-list">
                            {todos.map((todo) => (<TodoItem key={todo.id} todoItemText={todo.text} checked={todo.checked} onDelete={() => deleteTodo(todo.id)} onToggle={() => toggleTodo(todo.id)}/>))}
                        </div>
                </div>
            )
        }

export default TodoApp