import { Component, For, createSignal, onMount } from "solid-js";
import Flex from "../components/layouts/Flex";
import { useNavigate, useParams } from "@solidjs/router";
import ButtonCustom from "../components/generals/ButtonCustom";
import { getSessionUser } from "../components/Session";
import "./css/Qcm.css"

const Qcm: Component = () => {
    const nav = useNavigate()
    const params = useParams();
    let questionnaire_id = params.questionnaire_id
    const [question, setQuestion] = createSignal<any>([])
    const [team, setTeam] = createSignal<any>()
    const [questionnaire, setQuestionnaire] = createSignal<any>()
    const [answer, setAnswer] = createSignal<any[]>([], { equals: false})

    const getQuestion = async () => {
        const res_question = await fetch(`http://localhost:8080/api/question/${questionnaire_id}`, {
            method: "GET",
        });

        let status = await res_question.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get questions! Status:" + status)
            return
        }
        let res = await res_question.json()
        setQuestion(res)
    }

    const getQuestionnaire = async () => {
        const res_questionnaire = await fetch(`http://localhost:8080/api/questionnaire/${questionnaire_id}`, {
            method: "GET",
        });

        let status = await res_questionnaire.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get questions! Status:" + status)
            return
        }
        let res = await res_questionnaire.json()
        setQuestionnaire(res)
    }

    const getTeam = async () => {
        let user = getSessionUser()
        const res_team = await fetch(`http://localhost:8080/api/team/${user?.user_id}`, {
            method: "GET",
        });

        let status = await res_team.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get team! Status:" + status)
            return
        }
        let res = await res_team.json()
        let r = res.find((ele:any) => { return ele.data_project_id == questionnaire().data_project_id})
        setTeam(r)
    }


    onMount(async () => {
        await getQuestionnaire()
        await getQuestion()
        await getTeam()
    })

    const handleAnswer = (event: Event, qst: any) => {
        const target = event.target as HTMLInputElement;
        let data = answer()
        data.push({question_id: qst.id, content: target.value})
        setAnswer(data)
    }

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        let user = getSessionUser()
        answer().forEach( async (element:any) => {
            const res_register_answer = await fetch(`http://localhost:8080/api/answer`, {
                method: "POST",
                body: JSON.stringify({question_id: element.question_id, content: element.content, score: 0, team_id: team().id, user_id: user?.user_id, password: user?.password}),
                headers: {"Content-type": "application/json; charset=UTF-8"} 
            });

            let status = await res_register_answer.status
            if (status != 200) {
                console.log("[ERROR] Couldn't register the student! Status:" + status)
                return status
            }
        });
        
    }

    return <Flex bgc="#222222" direction="column" w="100%" jc="space-evenly" ai="center" h="calc(100vh - 140px)">
        <form class="form-qcm" onSubmit={ handleSubmit }>
            <Flex ovy="scroll" direction="column" w="100%" h="75%">
                <For each={question()}>
                    {(qst: any) => ( 
                        <Flex c="white" direction="column" w="50%" ml="25%" ff="Roboto">
                            <span class="question-qcm">{qst.name}</span> 
                            <input class="input-qcm" id={`question_${qst.id}`} placeholder="Response" required onChange={(e: Event) => handleAnswer(e, qst)}/>
                        </Flex>
                    )}
                </For>
            </Flex>
            <Flex jc="center" ai="center">
                <ButtonCustom class="form-submit" type="submit" value="submit" h="71px" w="373px" mt="0.5%" ff="Roboto" text="Validate" />
            </Flex>
        </form>
    </Flex>
}

export default Qcm