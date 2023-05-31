import { createStore } from "solid-js/store";
import { setConfirmed } from "../../pages/DashboardChallenge";

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

export const submit_challenge = async (form: ChallengeFormFields) => {
    console.log(`submitting ${JSON.stringify(form)}`);
  
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
    setConfirmed(true)
};

export const submit_resource = async (form: ResourceFormFields) => {
  const res_register_resource = await fetch(`http://localhost:8080/api/resource-challenge`, {
      method: "POST",
      body: JSON.stringify({name: resourceForm.name, url: resourceForm.url, data_challenge_id: resourceForm.data_challenge_id, password: "admin"}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
  
    let status = await res_register_resource.status
    if (status != 200) {
      console.log("[ERROR] Couldn't register the challenge! Status:" + status)
      return status
    }
    setConfirmed(true)
}

export const [challengeForm, setChallengeForm] = createStore<ChallengeFormFields>({
    name: "",
    date_time_start: "",
    date_time_end: ""
});

export const [resourceForm, setResourceForm] = createStore<ResourceFormFields>({
    name: "",
    url: "",
    data_challenge_id: 1,
});