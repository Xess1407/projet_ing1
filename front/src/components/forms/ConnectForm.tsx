import { createStore } from "solid-js/store";

type connectFormFields = {
    email: string;
    password: string;
};

export const submit = async (form: connectFormFields) => {
    console.log(`submitting ${JSON.stringify(form)}`);

    // Fetch the Student & User parts
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
    return true
};


export const [form, setForm] = createStore<connectFormFields>({
    password: "",
    email: "",
});

export const update_form_field = (fieldName: string) => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    setForm({[fieldName]: inputElement.value });
};
