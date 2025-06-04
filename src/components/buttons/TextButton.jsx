import React from 'react'

const TextButton = React.memo(function TextButton({id, text, onClick, className="text-button", isDisabled}) {
    return (
        <button id={id} className={className} onClick={onClick} disabled={isDisabled} >{text}</button>
    )
})

export default TextButton