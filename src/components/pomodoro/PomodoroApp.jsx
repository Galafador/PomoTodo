import React from 'react'
import { DisplayTimer } from '@components/pomodoro/'
import { IconSkip, IconSetting } from '@components/icons/'
import { IconButton, ToggleButton, StartButton } from '@components/buttons/'
import { Modal } from '@components/modal/'

//Pomodoro App component
        function PomodoroApp() {
            //initialize preferences
            const STORAGE_KEY = "PomodoroPreferences"
            const MINUTE = 60

            // Set initial state to localStorage if possible, if not use defaultPreferences
            const defaultPreferences = {
                session_length: 25*MINUTE,
                short_break_length: 5*MINUTE,
                long_break_length: 30*MINUTE,
                SESSION_UNTIL_LONG_BREAK: 4,
            };
            const [pomodoroPreferences, setPomodoroPreferences] = React.useState(() => {
                const localData = localStorage.getItem(STORAGE_KEY)
                if (localData) {
                    try {
                        return JSON.parse(localData)
                    }
                    catch {
                        console.log("Invalid data in localStorage")
                        return defaultPreferences
                    }
                }
                console.log("No data in localStorage")
                return defaultPreferences
            })

            //initialize state for settings
            const[settings, setSettings] = React.useState({
                session_length: pomodoroPreferences.session_length,
                short_break_length: pomodoroPreferences.short_break_length,
                long_break_length: pomodoroPreferences.long_break_length,
                SESSION_UNTIL_LONG_BREAK: pomodoroPreferences.SESSION_UNTIL_LONG_BREAK
            })

            // Save preferences to localStorage when they change
            React.useEffect(() => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(pomodoroPreferences))
            }, [pomodoroPreferences])
            
            // timer State object as a single source of truth
            const [timer, setTimer] = React.useState ({
                mode: "work", // "work" || "short_break" || "long_break"
                sessionCount: 1,
                totalSessions: pomodoroPreferences.SESSION_UNTIL_LONG_BREAK,
                counter: pomodoroPreferences.session_length,
                on_pause: true
            })

            // effect to change counter when pomodoroPreferences change
            React.useEffect(() => {
                if(pomodoroPreferences) {
                    setTimer( prev => ({
                        ...prev,
                        mode: "work",
                        totalSessions: pomodoroPreferences.SESSION_UNTIL_LONG_BREAK,
                        counter: pomodoroPreferences.session_length
                    }))
                }
            }, [pomodoroPreferences])
            
            // defining useTransition to make timer less-urgent and keep the buttons more snappy
            // eslint-disable-next-line no-unused-vars
            const [isPending, startTransition] = React.useTransition(); 

             // Effect for timer ticking logic
            React.useEffect(() => {
                if (timer.on_pause) return
                //set interval to tick down each second
                const interval = setInterval(() => {
                    startTransition(() => {
                        setTimer(prev => {
                            if (prev.counter > 0) {
                                return {
                                    ...prev,
                                    counter: prev.counter - 1};
                                }
                            else {
                                return prev;
                            }
                        });
                    })
                }, 1000);
                
                //Cleanup when component unmounts
                return () => clearInterval(interval);
            }, [timer.on_pause])

            // Effect for updating the progress bar variable
            React.useEffect(() => {
                const root = document.documentElement;
                let percent = 0;
                if (timer.mode === "work") {
                    percent = 100 * (pomodoroPreferences.session_length - timer.counter) / pomodoroPreferences.session_length;
                } else if (timer.mode === "short_break") {
                    percent = 100 * (pomodoroPreferences.short_break_length - timer.counter) / pomodoroPreferences.short_break_length;
                } else if (timer.mode === "long_break") {
                    percent = 100 * (pomodoroPreferences.long_break_length - timer.counter) / pomodoroPreferences.long_break_length;
                }
                root.style.setProperty("--indicator-fill-width", `${percent}%`);
            }, [timer.counter, 
                timer.mode, 
                pomodoroPreferences.session_length, 
                pomodoroPreferences.short_break_length, 
                pomodoroPreferences.long_break_length
                ]);

            // Effect for changing modes when timer.counter hits 0
            React.useEffect(() => {
                if (timer.counter !== 0) return;
                if (timer.mode === "work") {
                    //Change mode work to short_break or work to long_break
                    if (timer.sessionCount < pomodoroPreferences.SESSION_UNTIL_LONG_BREAK) {
                        // After a work session, change mode to short_break
                        setTimer(prev => ({
                            ...prev,
                            mode: "short_break",
                            counter: pomodoroPreferences.short_break_length,
                            on_pause: true,
                        }))
                    } else {
                        // After final session, change mode to long_break
                        setTimer(prev => ({
                            ...prev,
                            mode: "long_break",
                            counter: pomodoroPreferences.long_break_length,
                            on_pause: true,
                        }))
                    }
                // change mode short_break to work
                } else if (timer.mode === "short_break") {
                    setTimer(prev => ({
                        ...prev,
                        mode: "work",
                        counter: pomodoroPreferences.session_length,
                        on_pause: true,
                        sessionCount: prev.sessionCount + 1
                    }));
                // change mode long_break to work
                } else if (timer.mode === "long_break") {
                    setTimer( prev => ({
                        ...prev,
                        mode: "work",
                        counter: pomodoroPreferences.session_length,
                        on_pause: true,
                        sessionCount: 1,
                    }))
                }
            }, [
                timer.counter,
                timer.mode,
                timer.sessionCount,
                pomodoroPreferences.short_break_length,
                pomodoroPreferences.long_break_length,
                pomodoroPreferences.session_length,
                pomodoroPreferences.SESSION_UNTIL_LONG_BREAK
            ]); //use effect only when these values change

            //Effect to change colors according to mode
            React.useEffect(() => {
                const body = document.querySelector("body");
                const indicator = document.getElementById("indicator-fill")
                if (timer.mode === "work") {
                    indicator.style.background = `linear-gradient(90deg, #314A52 0%, #ACBDC5 100%)`
                    body.style.background = `radial-gradient(200% 100% at 50% 0%, #FFF 0%, #BEBC85 36.06%, #5181AF 77.4%, #2C40A2 100%)`;
                } else if (timer.mode === "short_break") {
                    indicator.style.background = `linear-gradient(90deg, #653233 0%, #C5ACBB 100%)`
                    body.style.background = `radial-gradient(200% 100% at 50% 100%, #FFDABA 0%, #BE8585 36.06%, #6D51AF 77.4%, #382CA2 100%)`;
                } else if (timer.mode === "long_break") {
                    indicator.style.background = `linear-gradient(90deg, #313352 0%, #A6ACCF 100%)`
                    body.style.background = `radial-gradient(200% 100% at 50% 0%, #6C98C2 0%, #3F6991 44%, #223074 77%, #151221 100%)`;
                }
            }, [timer.mode]);

            //start or pause the timer
            const startPauseToggle = React.useCallback(() => {
                setTimer(prev => ({
                    ...prev,
                    on_pause: !prev.on_pause
                }))
            }, [])

            //manually switch to work mode
            const workToggle = React.useCallback (() => {
                setTimer(prev => ({
                    ...prev,
                    mode: "work",
                    counter: pomodoroPreferences.session_length,
                    on_pause: true,
                }))
            }, [pomodoroPreferences])

            //manually switch to short_break mode
            const shortBreakToggle = React.useCallback (() => {
                setTimer(prev => ({
                    ...prev,
                    mode: "short_break",
                    counter: pomodoroPreferences.short_break_length,
                    on_pause: true,
                }))
            }, [pomodoroPreferences])
            
            //manually switch to long_break mode
            const longBreakToggle = React.useCallback (() => {
                setTimer(prev => ({
                    ...prev,
                    mode: "long_break",
                    counter: pomodoroPreferences.long_break_length,
                    on_pause: true,
                }))
            }, [pomodoroPreferences])

            //skip the timer to 0
            const skipToggle = React.useCallback (() => {
                setTimer(prev => ({
                    ...prev,
                    counter: 0
                }))
            }, [])

            // Modal state
            const [isModalOpen, setModalOpen] = React.useState(false)

            // Function to validate input 
            const validate = (e) => {
                let value = e.target.value;
                if (!/^\d+$/.test(value) || value === "" || value < 1)  { //Check if value is not a number, or empty string, or less than 1
                    alert("Please input a number greater than or equal to 1")
                    return false;
                } else {
                    return true;
                }
            }

            //export Pomodoro
            return (
                <div id="pomodoro">
                    <div id="header">
                        <div id="title-button-container">
                            <div id="title-text">
                                <h1>{timer.mode === "work" ? "Focus" : timer.mode === "short_break" ? "Break" : "Good work!"}</h1>
                            </div>
                            <IconButton icon={IconSetting} label="Setting" onClick={() => setModalOpen(true)}/>
                        </div>
                        <div id="indicators-container">
                            <div id="indicator-fill"></div>
                            <div id="indicator-left"></div>
                        </div>
                    </div>

                    <div id="pomodoro-timer">
                        <div id="top-buttons-container">
                            <ToggleButton id="work" onClick={workToggle} text="Pomodoro" activeMode={timer.mode} />
                            <ToggleButton id="short_break" onClick={shortBreakToggle} text="Short Break" activeMode={timer.mode} />
                            <ToggleButton id="long_break" onClick={longBreakToggle} text="Long Break" activeMode={timer.mode} />
                            
                        </div>
                        <div id="timer-display">
                            <DisplayTimer counter={timer.counter} />
                        </div>
                        <div id="bottom-buttons-container">
                            <div id="left"> 
                            </div>
                            <StartButton isPaused={timer.on_pause} id="start-pause-btn" onClick={startPauseToggle} />
                            <div id="right">
                                <IconButton icon={IconSkip} label="Skip timer" onClick={skipToggle}/>
                            </div>
                        </div>
                    </div>
                    
                    <Modal isOpen={isModalOpen} 
                        onClose={() => setModalOpen(false)} 
                        title="Setting" 
                        okButtonText="Save" 
                        okButtonOnClick={() => {setPomodoroPreferences(settings); setModalOpen(false)}}
                        okButtonDisabled={settings.session_length < 1 ? true : false}>
                        <div id="settings-container">
                            <div id="timer-setting">
                                <h4>Time (minutes)</h4>
                                <div id="timer-setting-items-container">
                                    <div className="timer-setting-items">
                                        <p>Pomodoro</p>
                                        <input 
                                            type="number" 
                                            name="pomodoro-length-setting" 
                                            id="pomodoro-length-setting"
                                            min="1"
                                            placeholder={settings.session_length / 60}
                                            onChange={e => validate(e) ? setSettings(s => ({...s, session_length: Number(e.target.value * 60)})) : e.target.value = ""}
                                        />
                                    </div>
                                    <div className="timer-setting-items">
                                        <p>Short Break</p>
                                        <input 
                                            type="number" 
                                            name="short-break-length-setting"
                                            id="short-break-length-setting"
                                            placeholder={settings.short_break_length / 60}
                                            min="1"
                                            onChange={e => validate(e) ? setSettings(s => ({...s, short_break_length: Number(e.target.value * 60)})) : e.target.value = ""}
                                        />
                                        </div>
                                    <div className="timer-setting-items">
                                        <p>Long Break</p>
                                        <input 
                                            type="number" 
                                            name="long-break-length-setting"
                                            id="long-break-length-setting"
                                            placeholder={settings.long_break_length / 60}
                                            min="1"
                                            onChange={e => validate(e) ? setSettings(s => ({...s, long_break_length: Number(e.target.value * 60)})) : e.target.value = ""}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div id="long-break-interval-setting">
                                <h4>Long Break Interval</h4>
                                <input 
                                    type="number" 
                                    name="long-break-interval-setting"
                                    id="long-break-interval-setting"
                                    placeholder={settings.SESSION_UNTIL_LONG_BREAK}
                                    min="1"
                                    onChange={e => validate(e) ? setSettings(s => ({...s, SESSION_UNTIL_LONG_BREAK: Number(e.target.value)})) : e.target.value = ""}
                                    />
                            </div>
                        </div>
                    </Modal>
                </div>
                
            )
        }

export default PomodoroApp