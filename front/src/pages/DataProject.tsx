import { Component, For, createSignal, onMount } from "solid-js"
import Flex from "../components/layouts/Flex"
import { useNavigate, useParams } from "@solidjs/router"

const DataProjects: Component = () => {
    const nav = useNavigate()
    const params = useParams();
    let data_challenge_id = params.data_challenge_id
    const [projects, setProjects] = createSignal<any>([])
    const [resources, setResources] = createSignal<any[]>([])

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

    onMount(async () => {
        await getProjects()
        await getResources()
    })

    return (
        <Flex bgc="#222222" direction="column" w="100%" h="100vh">
            <Flex h="25%" w="50%" ml="10%" fsz="56px" c="#FFFFFF" ai="center">
                <h1 class="text">Data Projects</h1>
            </Flex>
            <For each={projects()}>
                {(element: any) => (
                    <Flex fw="wrap" direction="row" ml="10%" mr="10%" h="75%" jc="space-around" onclick={() => {/* TODO nav to teams */}}>
                    <Flex h="270px" w="350px" br="10px" bgc="#3E3E3E" mt="15px" direction="column">
                        <Flex c="white" h="50%" jc="center" ai="center" ff="Roboto">
                            <h3>{element.name}</h3>
                        </Flex>
                        <Flex c="white" h="50%">
                            <Flex c="white" w="50%" direction="column" ai="center" ff="Roboto">
                                <h3>Description</h3>
                                <p>{element.description}</p>
                            </Flex>
                        </Flex>
                        <Flex direction="column">
                            <Flex c="white" h="50%" p="10px 0 0 0" jc="center" ai="center" ff="Roboto">
                                <h4>Resources</h4>
                            </Flex>
                            <For each={resources().filter((ele) => {return ele.data_project_id == element.id})}>
                                {(rse: any) => ( <Flex c="white" h="50%" jc="center" ai="center" ff="Roboto"><span>{rse.name}: {rse.url}</span></Flex>)}
                            </For>
                        </Flex>
                    </Flex>               
                </Flex>
                )}
            </For>
        </Flex>
    )
}

export default DataProjects