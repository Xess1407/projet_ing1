import { createStore } from "solid-js/store";

type SessionUser = {
    user_id?: number,
    name: string,
    family_name: string,
    email: string,
    password: string,
    telephone_number?: number,
    role: string,
}

export const [sessionUser, setSessionUser] = createStore<SessionUser>({user_id: undefined, name: "", family_name:"", email: "", password:"", telephone_number: undefined, role:""});