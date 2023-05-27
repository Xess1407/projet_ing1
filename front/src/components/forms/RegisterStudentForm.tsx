import { createStore } from "solid-js/store";

type RegisterStudentFormFields = {
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

export const submit_student = async (form: RegisterStudentFormFields) => {
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


export const [studentForm, setStudentForm] = createStore<RegisterStudentFormFields>({
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