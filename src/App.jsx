import './App.css'
import { TodoApp } from './components/todo'
import { PomodoroApp } from './components/pomodoro'

function RootApp() {
    return (
        <div id="app">
            <PomodoroApp />
            <TodoApp />
        </div>
    )
}

export default RootApp