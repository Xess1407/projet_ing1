import { createStore } from "solid-js/store";
import { getSessionUser } from "../Session";

export const submit_answer = async (id: number, question_id: number, team_id: number, content: string, score: number) => {
    console.log(`submitting ${JSON.stringify({id: id, question_id: question_id, team_id: team_id, content: content, score: score})}`);
  
    // Fetch challenge
    const res_modify_answer = await fetch(`http://localhost:8080/api/answer`, {
      method: "POST",
      body: JSON.stringify({id: id, question_id: question_id, team_id: team_id, content: content, score: score, user_id: getSessionUser()?.user_id, password: getSessionUser()?.password}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
  
    let status = await res_modify_answer.status
    if (status != 200) {
      console.log("[ERROR] Couldn't modify the answer! Status:" + status)
      return status
    }
};

export const update_rank = async (data_project_id: number, team_id: number, score: number) => {
    // On récupère le score global actuel de l'équipe pour ce data project
    const res_rank = await fetch(`http://localhost:8080/api/rank/get`, {
        method: "POST",
        body: JSON.stringify({data_project_id: data_project_id, team_id: team_id}),
        headers: {"Content-type": "application/json; charset=UTF-8"} 
    });

    let status = await res_rank.status;
    if (status !== 200) {
        console.log("[ERROR] Couldn't get the rank! Status:" + status)
        return;
    }

    let rank = await res_rank.json();

    let newScore = rank.score + score;

    const res_update_rank = await fetch(`http://localhost:8080/api/rank`, {
      method: "POST",
      body: JSON.stringify({id: rank.id, data_project_id: data_project_id, team_id: team_id, score: newScore}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
  
    let update_status = await res_update_rank.status
    if (update_status != 200) {
      console.log("[ERROR] Couldn't modify the rank! Status:" + update_status)
      return update_status
    }
}