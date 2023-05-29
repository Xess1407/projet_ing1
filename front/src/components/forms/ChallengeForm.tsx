import { createStore } from "solid-js/store";

type ChallengeFormFields = {
    name: string;
    date_time_start: string;
    date_time_end: string;
};

export const submit_challenge = async (form: ChallengeFormFields) => {
    console.log(`submitting ${JSON.stringify(form)}`);
  
    // Fetch the Student & User parts
    const res_register_challenge = await fetch(`http://localhost:8080/api/challenge`, {
      method: "POST",
      body: JSON.stringify({name: form.name, date_time_start: form.date_time_start, date_time_end: form.date_time_end, password: "admin"}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
  
    let status = await res_register_challenge.status
    if (status != 200) {
      console.log("[ERROR] Couldn't register the challenge! Status:" + status)
      return status
    }
  };

export const [challengeForm, setChallengeForm] = createStore<ChallengeFormFields>({
    name: "",
    date_time_start: "",
    date_time_end: ""
  });