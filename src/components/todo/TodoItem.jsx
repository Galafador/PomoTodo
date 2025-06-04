import { IconClose, IconCheck } from '@components/icons/'
import { IconButton } from '@components/buttons/'

//to do list item component//
function TodoItem({todoItemText, onDelete, checked, onToggle}) {
    return (
        <div className={`todo-item ${checked ? "background-lightgray" : ""}`}>
            <div 
                className="label-container"
                role="checkbox"
                aria-checked={checked}
                tabIndex="0"
                onClick={onToggle}
                onKeyDown={(e) => (e.key ===" " || e.key === "Enter") && onToggle()}
            >
                <div className={`checkbox ${checked ? "checked" : ""}`}>
                    {checked ? <IconCheck opacity="1" fill="white"/> : <IconCheck opacity="0" fill="black"/>}
                </div>
                <div className="checkbox-label" style={checked ? {textDecorationLine:"line-through"} : {}}>
                    {todoItemText}
                </div>
            </div>
            <div id="delete-button">
                <IconButton icon={IconClose} className="text-black" label="Delete task" onClick={onDelete}/>
            </div>
        </div>
    )
}

export default TodoItem