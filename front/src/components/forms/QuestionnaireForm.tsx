import { createStore } from "solid-js/store";
import { setConfirmed } from "../../pages/DashboardQuestionnaire";

type QuestionnaireFormFields = {
    data_project_id: number;
    name: string;
    date_time_start: string;
    date_time_end: string;
};

type QuestionFormFields = {
    questionnaire_id: number;
    name: string;
};

export const submit_questionnaire = async (form: QuestionnaireFormFields, user_id: number, password: string) => {
    console.log(`submitting ${JSON.stringify(form)}`);
  
    // Fetch challenge
    const res_register_questionnaire = await fetch(`http://localhost:8080/api/questionnaire`, {
      method: "POST",
      body: JSON.stringify({data_project_id: form.data_project_id, name: form.name, date_time_start: form.date_time_start, date_time_end: form.date_time_end, user_id: user_id, password: password}),
      headers: {"Content-type": "application/json; charset=UTF-8"} 
    });
  
    let status = await res_register_questionnaire.status
    if (status != 200) {
      console.log("[ERROR] Couldn't register the questionnaire! Status:" + status)
      return status
    }
    setConfirmed(true)
};

export const submit_question = async (form: QuestionFormFields, user_id: number, password: string) => {
    console.log(`submitting ${JSON.stringify(form)}`);

    const res_register_question = await fetch(`http://localhost:8080/api/question`, {
        method: "POST",
        body: JSON.stringify({questionnaire_id: form.questionnaire_id, name: form.name, user_id: user_id, password: password}),
        headers: {"Content-type": "application/json; charset=UTF-8"} 
      });
    
      let status = await res_register_question.status
      if (status != 200) {
        console.log("[ERROR] Couldn't register the question! Status:" + status)
        return status
      }
      setConfirmed(true)
}

export const [questionnaireForm, setQuestionnaireForm] = createStore<QuestionnaireFormFields>({
    data_project_id: 1,
    name: "",
    date_time_start: "",
    date_time_end: ""
});

export const [questionForm, setQuestionForm] = createStore<QuestionFormFields>({
    questionnaire_id: 1,
    name: "",
});