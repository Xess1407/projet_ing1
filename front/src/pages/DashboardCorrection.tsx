import { Component, createEffect, createSignal, For, onMount, Show } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import InputCustom from "../components/generals/InputCustom";
import ButtonCustom from "../components/generals/ButtonCustom";
import { questionnaireForm, questionForm, setQuestionnaireForm, setQuestionForm, submit_questionnaire, submit_question } from "../components/forms/QuestionnaireForm";
import { getSessionUser } from "../components/Session";
import { submit_answer, update_rank } from "../components/forms/AnswerForm";

const [questionnaires, setQuestionnaires] = createSignal<any>([])

const getQuestionnairesQuestionsAnswers = async () => {
    const res_questionnaire = await fetch(`http://localhost:8080/api/questionnaire`, {
        method: "GET",
    });

    let status = await res_questionnaire.status;
    if (status !== 200) {
        console.log("[ERROR] Couldn't get questionnaires! Status:" + status);
        return;
    }

    let ques = await res_questionnaire.json();

    // Récupérer les questions pour chaque questionnaire
    for (const questionnaire of ques) {
        const questions = await getQuestionsAnswers(questionnaire.id);
        questionnaire.questions = questions;
    }

    setQuestionnaires(ques);
};


const getQuestionsAnswers = async (questionnaireId: any) => {
    const res_questions = await fetch(`http://localhost:8080/api/question/${questionnaireId}`, {
        method: "GET",
    });

    let status = await res_questions.status;
    if (status !== 200) {
        console.log(`[ERROR] Couldn't get questions for questionnaire ${questionnaireId}! Status: ${status}`);
        return;
    }

    let questions = await res_questions.json();

    // Récupérer les réponses pour chaque question
    for (const question of questions) {
        const answers = await getAnswers(question.id);
        question.answers = answers;
    }

    return questions;
};


const getAnswers = async (questionId: any) => {
    const res_answers = await fetch(`http://localhost:8080/api/answer/${questionId}`, {
        method: "GET",
    });

    let status = await res_answers.status;
    if (status !== 200) {
        console.log(`[ERROR] Couldn't get answers for question ${questionId}! Status: ${status}`);
        return;
    }

    let answers = await res_answers.json();

    let answersToCorrect = [];

    for(const answer of answers) {
        if(answer.score == null) {
            answersToCorrect.push(answer);
        }
    }

    return answersToCorrect;
};

const handleRadioChange = (e: any, question: any, score: number, team_id: number) => {
    const isChecked = e.target.checked;

    const answer = {
        questionId: question.id,
        score: isChecked ? score : null,
    };
};

const handleSubmitCorrection = async (questionnaire_id: number, question_id: number) => {
    const questionnaire = questionnaires().find((q: any) => q.id === questionnaire_id);
    for (const question of questionnaire.questions) {
        if (question.id === question_id) {
            for(const answer of question.answers) {
                const team_id = answer.team_id;
                const radio_name = `question_${question.id}_team_${team_id}`;
                const radio_elements = document.getElementsByName(radio_name);

                for (let radio_element of radio_elements) {
                    let radio_element_i = radio_element as HTMLInputElement;
                    if (radio_element_i.checked) {
                        const selectedScore = parseInt(radio_element_i.value);

                        await submit_answer(answer.id, question_id, team_id, answer.content, selectedScore);
                        await update_rank(questionnaire.data_project_id, team_id, selectedScore);

                        break;
                    }
                }
            }
        }
    }

    // On recharge les réponses pour éliminer les réponses corrigées
    await getQuestionnairesQuestionsAnswers();
}

const DashboardCorrection: Component = () => {
    onMount(async () => {
        await getQuestionnairesQuestionsAnswers()
    })

    return (
        <Flex w="80%" h="80vh" jc="space-evenly">
            <Flex bgc="#444444" br="10px" w="100%" h="100%" direction="row" jc="center" ai="center">
                <For each={questionnaires()}>
                    {(questionnaire: any) => (
                        <Show when={questionnaire.questions != undefined && questionnaire.questions.length > 0}>
                            <Flex jc="center" fw="wrap" w="35%" h="90%" pt="1%" pb="1%" bgc="#222222" ovy="scroll" br="10px" c="#FFFFFF" ta="center" ff="Roboto">
                                <h3>Questionnaire {questionnaire.id}</h3>
                                <For each={questionnaire.questions}>
                                    {(question: any, index: () => number) => (
                                        <Flex ff="Roboto" jc="center">
                                            <div>
                                                <h4>Question n°{index() + 1} : {question.name}</h4>
                                                <Show when={question.answers != undefined && question.answers.length == 0}>
                                                    No answers yet!
                                                </Show>
                                                <Show when={question.answers != undefined && question.answers.length > 0}>
                                                        <For each={question.answers}>
                                                            {(answer: any) => (
                                                                <div>
                                                                    <p>Team {answer.team_id}:</p>
                                                                    <p>{answer.content}</p>
                                                                    <Flex direction="row" jc="center">
                                                                        <For each={Array.from({ length: 5 }, (_, index) => index)}>
                                                                            {(score: number) => (
                                                                                <label>
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`question_${question.id}_team_${answer.team_id}`}
                                                                                        value={score}
                                                                                        onChange={(e: Event) => handleRadioChange(e, question, score, answer.team_id)}
                                                                                        checked={score === 0}
                                                                                    />
                                                                                    {score}
                                                                                </label>
                                                                            )}
                                                                        </For>
                                                                    </Flex>
                                                                </div>
                                                            )}
                                                        </For>
                                                        <ButtonCustom onclick={() => handleSubmitCorrection(questionnaire.id, question.id)} text={`Soumettre correction question ${index() + 1} du questionnaire ${questionnaire.id}`}></ButtonCustom>
                                                </Show>
                                            </div>
                                        </Flex>
                                    )}
                                </For>
                            </Flex>
                        </Show>
                    )}
                </For>
            </Flex>
        </Flex>
    );
}

export default DashboardCorrection