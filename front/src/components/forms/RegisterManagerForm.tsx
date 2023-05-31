import { createStore } from "solid-js/store";
import { setConfirmedUser } from "../../pages/DashboardUser";

type RegisterManagerFormFields = {
    name: string;
    family_name: string;
    email: string;
    password: string;
    telephone_number: string;
    role: string;
    company: string;
    activation_date: Date;
    deactivation_date: Date;
};

export const submit_manager = async (form: RegisterManagerFormFields) => {
  console.log(`submitting ${JSON.stringify(form)}`);

  // Fetch the Manager & User parts
  const res_register_manager_user = await fetch(`http://localhost:8080/api/manager/full`, {
    method: "POST",
    body: JSON.stringify(form),
    headers: {"Content-type": "application/json; charset=UTF-8"} 
  });

  let status = await res_register_manager_user.status
  if (status != 200) {
    console.log("[ERROR] Couldn't register the manager! Status:" + status)
    return status
  }
  setConfirmedUser(true)
};


export const [managerForm, setManagerForm] = createStore<RegisterManagerFormFields>({
  name: "",
  family_name: "",
  password: "",
  email: "",
  telephone_number: "",
  role:"manager",
  company: "",
  activation_date: new Date(),
  deactivation_date: new Date()
});