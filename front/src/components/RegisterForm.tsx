import { createStore } from "solid-js/store";

type RegisterFormFields = {
    name: string;
    family_name: string;
    email: string;
    password: string;
    telephone_number: string;
    role: string;
    school_level: string;
    school: string;
    city: string;
};

export const submit = async (form: RegisterFormFields) => {
  console.log(`submitting ${JSON.stringify(form)}`);

  // Fetch the User part 
  const res_register_user = await fetch(`http://localhost:8080/api/user`, {
    method: "POST",
    body: JSON.stringify({"name": form.name,
                          "family_name": form.family_name,
                          "email": form.email,
                          "password": form.password,
                          "telephone_number": form.telephone_number,
                          "role": form.role}),
    headers: {"Content-type": "application/json; charset=UTF-8"} 
  });

  let status = await res_register_user.status
  if (status != 200) {
    console.log("[ERROR] Couldn't register the user! Status:" + status)
    return status
  }

  // Get back user_id
  const res_get_id = await fetch(`http://localhost:8080/api/user/connect`, {
    method: "POST",
    body: JSON.stringify({"email": form.email, "password": form.password }),
    headers: {"Content-type": "application/json; charset=UTF-8"} 
  });
  
  let res = await res_get_id.json()
  const user_id = res.id

  // Fetch the Student part
  const res_register_student = await fetch(`http://localhost:8080/api/student`, {
    method: "POST",
    body: JSON.stringify({"user_id": user_id,
                          "school_level": form.school_level,
                          "school": form.school,
                          "city": form.city,
                          "password": form.password}),
    headers: {"Content-type": "application/json; charset=UTF-8"} 
  });

    status = await res_register_student.status
    if (status != 200) 
        console.log("[ERROR] Couldn't register the student! Status:" + status)

    return status
};


export const [form, setForm] = createStore<RegisterFormFields>({
  name: "",
  family_name: "",
  password: "",
  email: "",
  telephone_number: "",
  role:"student",
  school: "",
  school_level: "L1",
  city: "",
});

export const update_form_field = (fieldName: string) => (event: Event) => {
  const inputElement = event.currentTarget as HTMLInputElement;
  setForm({[fieldName]: inputElement.value });
};
