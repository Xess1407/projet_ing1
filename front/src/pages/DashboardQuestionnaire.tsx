import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import InputCustom from "../components/generals/InputCustom";
import ButtonCustom from "../components/generals/ButtonCustom";
import { questionnaireForm, questionForm, setQuestionnaireForm, setQuestionForm, submit_questionnaire, submit_question } from "../components/forms/QuestionnaireForm";
import { getSessionUser } from "../components/Session";

export const [confimed, setConfirmed] = createSignal(false)

const [questionnaires, setQuestionnaires] = createSignal<any>([])
const [totalQuestionnaires, setTotalQuestionnaires] = createSignal<any>(0)

const [projects, setProjects] = createSignal<any>([])

const [addQuestionnaire, setAddQuestionnaire] = createSignal(false)
const [removeQuestionnaire, setRemoveQuestionnaire] = createSignal(false)
const [addQuestion, setAddQuestion] = createSignal(false)
const [removeQuestion, setRemoveQuestion] = createSignal(false)
const [questionnaireToRemove, setQuestionnaireToRemove] = createSignal<any>([], { equals: false })

const [question, setQuestion] = createSignal<any>([])
const [questionToRemove, setQuestionToRemove] = createSignal<any>([], { equals: false })

const [searchValue, setSearchValue] = createSignal<string>("")
function searching(ele: string): boolean { return ele.toLowerCase().includes(searchValue().toLowerCase()) }

const getDataProjects = async () => {
    const res_project = await fetch(`http://localhost:8080/api/project`, {
        method: "GET",
    });

    let status = await res_project.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get projects! Status:" + status)
        return
    }
    let proj = await res_project.json()
    setProjects(proj)
}

const getQuestionnaires = async () => {
    const res_questionnaire = await fetch(`http://localhost:8080/api/questionnaire`, {
        method: "GET",
    });

    let status = await res_questionnaire.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get questionnaires! Status:" + status)
        return
    }
    let ques = await res_questionnaire.json()
    setQuestionnaires(ques)
    setTotalQuestionnaires(questionnaires().length)
}

const getQuestion = async () => {
    const res_question = await fetch(`http://localhost:8080/api/question`, {
        method: "GET",
    });

    let status = await res_question.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get questions! Status:" + status)
        return
    }
    let ques = await res_question.json()
    setQuestion(ques)
}

const addToQuestionnaireToRemove = () => {
    let questionnaire = questionnaires().find((qu:any) => { return qu.name == searchValue()})
    if (questionnaire === undefined) {
        console.log("Non trouvé");
        /** Afficher erreur */
        return
    }

    let data = questionnaireToRemove()
    data.push(questionnaire)
    setQuestionnaireToRemove(data)
}

const addToQuestionToRemove = () => {
    let question_s = question().find((qu:any) => { return qu.name == searchValue()})
    if (question_s === undefined) {
        console.log("Non trouvé");
        /** Afficher erreur */
        return
    }

    let data = questionToRemove()
    data.push(question_s)
    setQuestionToRemove(data)
}

const handle_show = (code: number) => {
    let [a,b, c, d] = [!addQuestionnaire(), !removeQuestionnaire(), !addQuestion(), !removeQuestion()]
    setAddQuestionnaire(false)
    setRemoveQuestionnaire(false)
    setAddQuestion(false)
    setRemoveQuestion(false)
    setConfirmed(false)
    switch (code){
        case 1: if (a) setAddQuestionnaire(true); else setAddQuestionnaire(false); break;
        case 2: if (b) setRemoveQuestionnaire(true); else setRemoveQuestionnaire(false); break;
        case 3: if (c) setAddQuestion(true); else setAddQuestion(false); break;
        case 4: if (d) setRemoveQuestion(true); else setRemoveQuestion(false); break;
    }
}

const handle_submit_delete_questionnaire = async (event: Event) => {
    event.preventDefault();
    for(const element of questionnaireToRemove()) {
        let res_delete_questionnaire = await fetch(`http://localhost:8080/api/questionnaire`, {
        method: "DELETE",
        body: JSON.stringify({id: element.id, user_id: getSessionUser()?.user_id, password: getSessionUser()?.password}),
        headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_delete_questionnaire.status
        if (status != 200) {
            console.log("[ERROR] Couldn't delete the questionnaire! Status:" + status)
            return status
        }
    };
    setQuestionnaireToRemove([]);
    await getQuestionnaires()
    setConfirmed(true)
}

const handle_submit_delete_question = async (event: Event) => {
    event.preventDefault();
    for(const element of questionToRemove()) {
        let res_delete_question = await fetch(`http://localhost:8080/api/question`, {
        method: "DELETE",
        body: JSON.stringify({id: element.id, user_id: getSessionUser()?.user_id, password: getSessionUser()?.password}),
        headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_delete_question.status
        if (status != 200) {
            console.log("[ERROR] Couldn't delete the question! Status:" + status)
            return status
        }
    };
    setQuestionToRemove([]);
    await getQuestion()
    setConfirmed(true)
}

const handle_submit_questionnaire = async (event: Event): Promise<void> => {
    event.preventDefault();
    await submit_questionnaire(questionnaireForm, getSessionUser()?.user_id!, getSessionUser()?.password!)
    await getQuestionnaires()
}

const handle_submit_question = async (event: Event): Promise<void> => {
    event.preventDefault();
    await submit_question(questionForm, getSessionUser()?.user_id!, getSessionUser()?.password!)
    await getQuestion()
}

const handle_change_questionnaire = (e:any) => {
    let data = {questionnaire_id: Number(e.currentTarget.value)}
    setQuestionForm(data)
}

const handle_change_project = (e:any) => {
    let data = {data_project_id: Number(e.currentTarget.value)}
    setQuestionnaireForm(data)
}
    
const DashboardQuestionnaire: Component = () => {
        onMount( async () => {
            await getDataProjects()
            await getQuestionnaires()
            await getQuestion()
        })
    
        return (
            <Flex w="80%" jc="space-evenly">
                <Flex bgc="#444444" br="10px" w="40%" h="50%" direction="row" jc="space-evenly" ai="center">
                    <Box w="35%" h="50%" bgc="#222222" br="10px" c="#FFFFFF" ta="center" ff="Roboto">
                        <h3>Total questionnaires</h3>
                        <p>{totalQuestionnaires()}</p>
                    </Box>
                    <Flex direction="column" w="60%" h="100%" jc="space-evenly" ai="center">
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Questionnaire" onclick={() => {handle_show(1); setQuestionnaireForm({data_project_id: 1})}}/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Questionnaire" onclick={() => handle_show(2)}/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Question" onclick={() => {handle_show(3); setQuestionForm({questionnaire_id: 1})}}/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Question" onclick={() => handle_show(4)}/>
                    </Flex>
                </Flex>

    
                <Show when={addQuestionnaire()}>
                    <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto">
                        <h2>Add Questionnaire</h2>
                        <Flex direction="column" w="90%" h="80%" jc="space-evenly" ai="center">
                        <form class="form-add-project" onSubmit={ handle_submit_questionnaire }>
                            <Flex w="95%" jc="space-evenly" ai="center" h="20%" mt="5%">
                                <InputCustom w="60%" id="name" label="Name" type="text" placeholder="Name of Questionnaire" update={setQuestionnaireForm}/>
                            </Flex>
                            <Flex w="95%" jc="space-evenly" ai="center" h="20%" mt="3%">
                                <InputCustom w="45%" id="date_time_start" label="Start Date" type="date"  update={setQuestionnaireForm}/>
                                <InputCustom w="45%" id="date_time_end" label="End Date" type="date" update={setQuestionnaireForm}/>
                            </Flex>
                            <Flex w="35%" jc="space-evenly" ai="center">
                                <select name="data_project" id="data_project" onChange={handle_change_project}>
                                    <For each={projects()}>
                                        {(element) => (
                                            <option value={element.id}>{element.name}</option>
                                        )}
                                    </For>
                                </select>
                            </Flex>
                            <Flex w="95%" jc="center" ai="center" h="20%" mt="3%">
                                <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                            </Flex>
                        </form>
                        </Flex>
                        <Flex>
                            <Show when={confimed()} >
                                <p>Questionnaire added</p>
                            </Show>
                        </Flex>
                    </Flex>
                </Show>
    
    
                <Show when={removeQuestionnaire()}>
                    <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto" pt="5%">
                        <h2>Remove Questionnaire</h2>
                        <form class="form-remove" onSubmit={ handle_submit_delete_questionnaire }>
                            <Flex w="95%" jc="space-evenly" ai="center">
                                <Flex direction="column" jc="space-evenly" ai="center" w="65%">
                                    <input id="search" type="text" placeholder="Name questionnaire" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>  
                                    <Box w="100%" h="2em" ovy="scroll">
                                        <For each={questionnaires()}>
                                            {(element: any) => (
                                                <Show when={searching(element.name)}>
                                                    <li class="search-result">{element.name}</li>
                                                </Show>
                                            )}
                                        </For>
                                    </Box>
                                </Flex>
                                <Flex w="35%" jc="space-evenly" ai="center">
                                    <ButtonCustom ff="Roboto" text="Add" onclick={addToQuestionnaireToRemove}/>
                                </Flex>
                            </Flex>
                            <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                                <label>Questionnaire to remove</label>
                                <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
                                    <For each={questionnaireToRemove()}>
                                        {(element:any) => (
                                            <p>{element.name}</p>
                                        )}
                                    </For>
                                </Box>
                                <ButtonCustom class="form-submit" type="submit" value="submit" text="REMOVE" ff="Roboto black" fsz="16px" w="230px" h="60px" br="16px" bgc="#E36464" mt="4%"/>
                            </Flex>
                        </form>
                        <Flex>
                            <Show when={confimed()} >
                                <p>Questionnaire remove</p>
                            </Show>
                        </Flex>
                    </Flex>
                </Show>
    
    
                <Show when={addQuestion()}>
                    <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto">
                        <h2>Add Question</h2>
                        <Flex direction="column" w="90%" h="80%" jc="space-evenly" ai="center">
                        <form class="form-add-ressource" onSubmit={ handle_submit_question }>
                            <Flex w="95%" jc="space-evenly" ai="center" h="20%" mt="5%">
                                <InputCustom w="100%" id="question" label="Question" type="text" update={setQuestionForm}/>
                            </Flex>
                            <Flex w="35%" jc="space-evenly" ai="center">
                                <select name="data_project" id="data_project" onChange={handle_change_questionnaire}>
                                    <For each={questionnaires()}>
                                        {(element) => (
                                            <option value={element.id}>{element.name}</option>
                                        )}
                                    </For>
                                </select>
                            </Flex>
                            <Flex w="95%" jc="center" ai="center" h="20%" mt="3%">
                                <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                            </Flex>
                        </form>
                        </Flex>
                        <Flex>
                            <Show when={confimed()} >
                                <p>Question added</p>
                            </Show>
                        </Flex>
                    </Flex>
                </Show>
    
                <Show when={removeQuestion()}>
                    <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto" pt="5%">
                        <h2>Remove question</h2>
                        <form class="form-remove" onSubmit={ handle_submit_delete_question }>
                        <Flex w="95%" jc="space-evenly" ai="center">
                                    <Flex direction="column" jc="space-evenly" ai="center" w="65%">
                                        <input id="searchQuestion" type="text" placeholder="Name question" onInput={() => {setSearchValue((document.getElementById("searchQuestion") as HTMLInputElement).value)}}/>  
                                        <Box w="100%" h="2em" ovy="scroll">
                                            <For each={question()}>
                                                {(element: any) => (
                                                    <Show when={searching(element.name)}>
                                                        <li class="search-result">{element.name}</li>
                                                    </Show>
                                                )}
                                            </For>
                                        </Box>
                                    </Flex>
                                    <Flex w="35%" jc="space-evenly" ai="center">
                                        <ButtonCustom ff="Roboto" text="Add" onclick={addToQuestionToRemove}/>
                                    </Flex>
                                </Flex>
                                <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                                    <label>Question to remove</label>
                                    <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
                                        <For each={questionToRemove()}>
                                            {(element:any) => (
                                                <p>{element.id}</p>
                                            )}
                                        </For>
                                    </Box>
                                    <ButtonCustom class="form-submit" type="submit" value="submit" text="REMOVE" ff="Roboto black" fsz="16px" w="230px" h="60px" br="16px" bgc="#E36464" mt="4%"/>
                                </Flex>
                        </form>
                        <Flex>
                            <Show when={confimed()} >
                                <p>Question remove</p>
                            </Show>
                        </Flex>
                    </Flex>
                </Show>
    
            </Flex>
        )
    }   
    
    export default DashboardQuestionnaire