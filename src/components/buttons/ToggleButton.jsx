import React from 'react'

//ToggleButton Component
const ToggleButton = React.memo(function ToggleButton({id, text, onClick, activeMode}) {
    const isActive = id === activeMode;
    return (
        <button id={id} className={`toggle-button${isActive ? " on" : ""}`} onClick={onClick}>{text}</button>
    )
})

export default ToggleButton