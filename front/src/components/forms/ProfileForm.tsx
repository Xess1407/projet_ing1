import { createStore } from "solid-js/store";
import { getSessionUser } from "../Session";

type ProfileFormFields = {
    user_id?: number;
    name?: string;
    family_name?: string;
    email?: string;
    password?: string;
    telephone_number?: number;
    role?: string;
    school_level?: string;
    school?: string;
    city?: string;
};

export const get_student_profile = async () => {
    let user;
    // Fetch the Student
    const res_student_profile = await fetch(`http://localhost:8080/api/student/get`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {"Content-type": "application/json; charset=UTF-8"} 
    });

    let status = await res_student_profile.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get student information! Status:" + status)
        return
    }
    let res = await res_student_profile.json()
    setForm({school: res.school, school_level: res.school_level, city: res.city})
}


export const submit = async (form: ProfileFormFields) => {
  console.log(`submitting ${JSON.stringify(form)}`);

  // Fetch the Student & User parts
  const res_register_student_user = await fetch(`http://localhost:8080/api/student/full`, {
    method: "POST",
    body: JSON.stringify(form),
    headers: {"Content-type": "application/json; charset=UTF-8"} 
  });

  let status = await res_register_student_user.status
  if (status != 200) {
    console.log("[ERROR] Couldn't register the student! Status:" + status)
    return status
  }
};


export const [form, setForm] = createStore<ProfileFormFields>({
    user_id: getSessionUser()?.user_id,
    name: getSessionUser()?.name,
    family_name: getSessionUser()?.family_name,
    password: "",
    email: getSessionUser()?.email,
    telephone_number: getSessionUser()?.telephone_number,
    role: getSessionUser()?.role,
    school: "",
    school_level: "L1",
    city: "",
});


