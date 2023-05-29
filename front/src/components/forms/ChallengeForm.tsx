import { createStore } from "solid-js/store";

type ChallengeFormFields = {
    name: string;
    date_time_start: string;
    date_time_end: string;
};

type ResourceFormFields = {
    name: string;
    url: string;
    data_challenge_id: number;
};

export const submit_challenge = async (form: ChallengeFormFields, resourceForm: ResourceFormFields) => {
    console.log(`submitting ${JSON.stringify(form)} and ${JSON.stringify(resourceForm)}`);
  
    // Fetch challenge
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

    let register_challenge = await res_register_challenge.json()
    let challenge_id = register_challenge.id

    const res_register_resource = await fetch(`http://localhost:8080/api/resource-challenge`, {
      method: "POST",
      body: JSON.stringify({name: resourceForm.name, url: resourceForm.url, data_challenge_id: challenge_id, password: "admin"}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
  
    status = await res_register_resource.status
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

export const [resourceForm, setResourceForm] = createStore<ResourceFormFields>({
    name: "",
    url: "",
    data_challenge_id: 0,
});