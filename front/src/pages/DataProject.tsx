import { Component, For, createSignal, onMount } from "solid-js"
import Flex from "../components/layouts/Flex"
import { useNavigate, useParams } from "@solidjs/router"
import "./css/DataProjects.css"

const DataProjects: Component = () => {
    const nav = useNavigate()
    const params = useParams();
    let data_challenge_id = params.data_challenge_id
    const [projects, setProjects] = createSignal<any>([])
    const [resources, setResources] = createSignal<any[]>([])
    const [questionnaire, setQuestionnaire] = createSignal<any[]>([])

    /* Get all challenges */
    const getProjects = async () => {
        const res_project = await fetch(`http://localhost:8080/api/project/from-data-challenge/${data_challenge_id}`, {
            method: "GET",
        });

        let status = await res_project.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get projects! Status:" + status)
            return
        }
        let res = await res_project.json()
        setProjects(res)
    }

    const getResources = async () => {
        const res_resource = await fetch(`http://localhost:8080/api/resource-project`, {
            method: "GET",
        });

        let status = await res_resource.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get challenges! Status:" + status)
            return
        }
        let res = await res_resource.json()
        setResources(res)
    }

    const getQuestionnaire = async () => {
        const res_questionnaire = await fetch(`http://localhost:8080/api/questionnaire`, {
            method: "GET",
        });

        let status = await res_questionnaire.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get projects! Status:" + status)
            return
        }
        let res = await res_questionnaire.json()
        setQuestionnaire(res)
    }

    onMount(async () => {
        await getProjects()
        await getResources()
        await getQuestionnaire()
    })

    return (
        <Flex bgc="#222222" direction="column" w="100%" jc="space-between" h="120vh">
            <Flex h="20%" w="100%" fsz="56px" c="#FFFFFF" ai="center">
                <h1 class="text">Data Projects</h1>
            </Flex>
            <Flex fw="wrap" jc="space-evenly" w="100%" h="77%" direction="row">
                <For each={projects()}>
                    {(element: any) => (
                        <div class="data-projects">
                            <Flex fw="wrap" direction="row" w="100%" h="100%" onclick={() => {nav(`/data-project/teams/${element.id}`,{replace: true})}}>
                                <Flex h="100%" w="100%" br="10px" bgc="#3E3E3E" direction="column">
                                    <Flex c="white" jc="center" ai="center" ff="Roboto">
                                        <h3>{element.name}</h3>
                                    </Flex>
                                    <Flex c="white">
                                        <Flex c="white" w="100%" ml="5%" direction="column" ff="Roboto">
                                            <h3>Description</h3>
                                            <p>{element.description}</p>
                                        </Flex>
                                    </Flex>
                                    <Flex direction="column">
                                        <Flex c="white" p="10px 0 0 0" jc="center" ai="center" ff="Roboto">
                                            <h4>Resources</h4>
                                        </Flex>
                                        <For each={resources().filter((ele) => {return ele.data_project_id == element.id})}>
                                            {(rse: any) => ( <Flex c="white" jc="center" ai="center" ff="Roboto"><span>{rse.name}: {rse.url}</span></Flex>)}
                                        </For>
                                        <Flex c="white" p="10px 0 0 0" jc="center" ai="center" ff="Roboto">
                                            <h4>Questionnaire</h4>
                                        </Flex>
                                        <For each={questionnaire().filter((ele) => {return ele.data_project_id == element.id})}>
                                            {(qst: any) => ( 
                                            <Flex c="white" jc="center" ai="center" ff="Roboto">
                                                <span>{qst.name} Start: {qst.date_time_start} To: {qst.date_time_end}</span>
                                            </Flex>)}
                                        </For>
                                    </Flex>
                                </Flex>              
                            </Flex>
                        </div>
                    )}
                </For>
            </Flex>
        </Flex>
    )
}

export default DataProjects