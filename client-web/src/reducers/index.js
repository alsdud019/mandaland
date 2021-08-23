import { combineReducers } from "redux"
import userReducers from "./userReducers"
import mandalReducers from "./mandalReducers"
import logReducers from "./logReducers"
import mandalartsReducers from "./mandalartsReducers"

export default combineReducers({
    user: userReducers,
    mandal: mandalReducers,
    log: logReducers,
    mandalarts: mandalartsReducers,
})
