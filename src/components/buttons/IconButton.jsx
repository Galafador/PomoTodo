import React from 'react'

//IconButton Component
// eslint-disable-next-line no-unused-vars
const IconButton = React.memo(function IconButton({icon: Icon, label, onClick, className}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={`icon-button ${className ? className : ""}`}
        >
            <Icon />
        </button>
    )
})

export default IconButton