import React from 'react'

//StartButton Component
const StartButton = React.memo(function StartButton({isPaused, onClick, id}) {
    return (
        <button id={id} className={`start-button${isPaused ? "" : " paused"}`} onClick={onClick}>
            {isPaused ? "START" : "PAUSE"}
        </button>
    )
})

export default StartButton