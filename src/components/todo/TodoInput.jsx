import React from 'react'
import { IconPlus } from '@components/icons/'
import { IconButton } from '@components/buttons/'

function TodoInput({ addItem }) {
    const [inputValue, setInputValue] = React.useState("")
    const addTodo = () => {
        if (inputValue.trim() === "") return
        addItem(inputValue)
        setInputValue("")
    }
    return (
        <div id="input-task">
            <input
                name="todo-input"
                type="text"
                className="todo-input"
                placeholder="Add a new task"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
            <IconButton icon={IconPlus} label="Add task" className="background-dark" onClick={addTodo}/>
        </div>
    )
}

export default TodoInput