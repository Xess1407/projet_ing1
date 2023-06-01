import { Component, For, createSignal, onMount } from "solid-js"
import Flex from "../components/layouts/Flex"
import { useNavigate, useParams } from "@solidjs/router"
import "./css/DataProjects.css"
import Box from "../components/layouts/Box"

const AllDataProjects: Component = () => {
    const nav = useNavigate()
    const [projects, setProjects] = createSignal<any>([])
    const [resources, setResources] = createSignal<any[]>([])
    const [questionnaire, setQuestionnaire] = createSignal<any[]>([])

    /* Get all challenges */
    const getProjects = async () => {
        const res_project = await fetch(`http://localhost:8080/api/project`, {
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
                            <Flex fw="wrap" direction="row" w="100%" h="100%"  onclick={() => {nav(`/data-project/teams/${element.id}`,{replace: true})}}>
                                <Flex h="100%" w="100%" br="10px" bgc="#3E3E3E" direction="column">
                                    <Flex direction="row" w="100%" h="20%" m="2% 0 1% 2%">
                                        <Box w="20%" h="90%">
                                            <img class="img-data-project" src={"http://localhost:8080/api/file/"+element.image} alt="Image data project" />
                                        </Box>
                                        <Flex w="60%" c="white" jc="center" ai="center" ff="Roboto">
                                            <h3>{element.name}</h3>
                                        </Flex>
                                    </Flex>
                                    <Flex c="white" ovy="scroll" w="90%" ml="5%">
                                        <Flex c="white" w="100%" pl="5%" bgc="#4f4f4f" br="10px" direction="column" ff="Roboto">
                                            <h3>Description</h3>
                                            <p>{element.description}</p>
                                        </Flex>
                                    </Flex>
                                    <Flex direction="column" ovy="scroll" bgc="#4f4f4f" br="10px" w="90%" ml="5%" mt="2%">
                                        <Flex c="white" jc="center" ai="center" ff="Roboto">
                                            <h4>Resources</h4>
                                        </Flex>
                                        <For each={resources().filter((ele) => {return ele.data_project_id == element.id})}>
                                            {(rse: any) => ( <Flex c="white" jc="center" ai="center" ff="Roboto"><span>{rse.name}: {rse.url}</span></Flex>)}
                                        </For>
                                        <Flex c="white" jc="center" ai="center" ff="Roboto">
                                            <h4>Questionnaire</h4>
                                        </Flex>
                                        <For each={questionnaire().filter((ele) => {return ele.data_project_id == element.id})}>
                                            {(qst: any) => ( 
                                            <Flex c="white" ml="5%" ff="Roboto" w="90%" mb="2%">
                                                <span>{qst.name} Start : {qst.date_time_start} To : {qst.date_time_end}</span>
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

export default AllDataProjects