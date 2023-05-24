import { createStore } from "solid-js/store";
import { sessionUser, setSessionUser } from "../Session";

type connectFormFields = {
    email: string;
    password: string;
};

export const submit = async (form: connectFormFields) => {
    console.log(`submitting ${JSON.stringify(form)}`);

    // Try connection
    const res_register_student_user = await fetch(`http://localhost:8080/api/user/connect`, {
    method: "POST",
    body: JSON.stringify({"email": form.email,
                            "password": form.password}),
    headers: {"Content-type": "application/json; charset=UTF-8"} 
    });

    let status = await res_register_student_user.status
    if (status != 200) {
        console.log("[ERROR] Couldn't connect student ! Status:" + status)
        return false
    }


    let res = await res_register_student_user.json()
    setSessionUser({user_id: res.id, 
                    name: res.name, 
                    family_name: res.family_name, 
                    email: res.email, 
                    password: res.password, 
                    telephone_number: res.telephone_number,
                    role: res.role
                })
    return true
};


export const [form, setForm] = createStore<connectFormFields>({
    password: "",
    email: ""
});