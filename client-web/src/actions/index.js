import server from "../apis/server"
import { CREATE_LOG, FETCH_LOG, FETCH_MANDAL, FETCH_MONTH_LOG, PATCH_LOG, SIGN_IN, SIGN_OUT } from "../type"
import { getDateString, getYear, getMonthIndex, getDate } from "./getDateString"

export const signIn = (userInfo) => async (dispatch) => {
    const [userId, email, name, imagePath] = userInfo
    const { data } = await server.post("/login/google", {
        userId,
        email,
        name,
        imagePath,
    })
    localStorage.setItem("id", data[0].id)
    dispatch({ type: SIGN_IN, payload: data[0] })
}

export const signOut = () => {
    return {
        type: SIGN_OUT,
    }
}

export const fetchMandal = (mandalId) => async (dispatch) => {
    const { data } = await server.get(`/mandal?id=${mandalId}`)
    dispatch({ type: FETCH_MANDAL, payload: data })
}

export const fetchLog = (userId, mandalId) => async (dispatch) => {
    const dateString = getDateString()
    const { data } = await server.get(`/checklog?mandalId=${mandalId}&date=${dateString}`)
    if (data.length === 0) await createLog(userId, mandalId)(dispatch)
    else dispatch({ type: FETCH_LOG, payload: data[0] })
}

export const fetchMonthLog = (month) => async (dispatch) => {
    const { data } = await server.get(`/checklogs?userId=${localStorage.getItem("id")}&month=${month}`)
    dispatch({ type: FETCH_MONTH_LOG, payload: data })
}

export const createLog = (userId, mandalId) => async (dispatch) => {
    const initial_log = {
        date: getDateString(),
        year: getYear(),
        month: getMonthIndex(),
        day: getDate(),
        checks: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        userId,
        mandalId,
    }
    const { data } = await server.post("/checklogs", { ...initial_log })
    dispatch({ type: CREATE_LOG, payload: data })
}

export const patchLog = (miniMandalIndex, goalIndex, check, state) => async (dispatch) => {
    const { checks, monthLog, ...others } = state
    checks[miniMandalIndex][goalIndex] = check
    const { data } = await server.put(`/checklogs`, { ...others, checks })
    dispatch({ type: PATCH_LOG, payload: data })
}
