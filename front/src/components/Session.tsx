type SessionUser = {
    user_id?: number,
    name: string,
    family_name: string,
    email: string,
    password: string,
    telephone_number?: number,
    role: string,
}

export function setSessionUser(s: SessionUser) {
    for (const [key, value] of Object.entries(s)) {
        window.localStorage.setItem(key, String(value))
    }
}

export function clearSessionUser() {
    window.localStorage.removeItem("user_id")
    window.localStorage.removeItem("name")
    window.localStorage.removeItem("family_name")
    window.localStorage.removeItem("email")
    window.localStorage.removeItem("password")
    window.localStorage.removeItem("telephone_number")
    window.localStorage.removeItem("role")
}

export function getSessionUser(): SessionUser | null {
    let user_id = window.localStorage.getItem("user_id")
    let name = window.localStorage.getItem("name")
    let family_name = window.localStorage.getItem("family_name")
    let email = window.localStorage.getItem("email")
    let password = window.localStorage.getItem("password")
    let telephone_number = window.localStorage.getItem("telephone_number")
    let role = window.localStorage.getItem("role")

    if (user_id === null || name === null || family_name === null || email === null || password === null || telephone_number === null || role === null) 
        return null

    return {user_id: Number(user_id),
        name: name, 
        family_name: family_name, 
        email: email, 
        password: password, 
        telephone_number: Number(telephone_number),
        role: role
    }
}

export const isConnected = (): boolean => {
    return window.localStorage.getItem("user_id") !== null
}

export const isAdmin = (): boolean => {
    return isConnected() && window.localStorage.getItem("role") == "admin"
}