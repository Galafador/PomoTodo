import React from 'react'
import ReactDOM from 'react-dom'
import { IconClose } from '@components/icons/'
import { IconButton, TextButton } from '@components/buttons/'

const modalRoot = document.getElementById("modal-root")

function Modal({isOpen, onClose, children, title, okButtonText, okButtonOnClick, okButtonDisabled}) {
    React.useEffect(() => {
        const handleEsc = (e) => { 
            if (e.key === "Escape") {
                onClose()
            } //Close modal when pressing ESC
        }
        document.addEventListener("keydown", handleEsc)
        return () => document.removeEventListener("keydown", handleEsc)
    }, [onClose])
    if (!isOpen) return null
    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-light" onClick={e => e.stopPropagation()}>
                <div id="modal-header">
                    <div id="title">
                        <h2>{title}</h2>
                    </div>
                    <IconButton className="text-black" icon={IconClose} fill="Black" label="Close overlay" onClick={onClose}/>
                </div>
                {children}
                <div id="modal-button-container">
                    <TextButton id="modal-button" className="text-button text-lg" onClick={okButtonOnClick} text={okButtonText} isDisabled={okButtonDisabled} />
                </div>
            </div>
            
        </div>,
        modalRoot
    )
}

export default Modal