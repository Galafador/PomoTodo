function DisplayTimer({ counter }) {
            //format time first to mm:ss before display
            function formatTime(sec) {
                const m = Math.floor(sec / 60).toString().padStart(2, "0")
                const s = (sec % 60).toString().padStart(2, "0")
                return `${m}:${s}`
            }
            return (
                <div id="counter">
                    {formatTime(counter)}
                </div>
            )
        }
        
export default DisplayTimer