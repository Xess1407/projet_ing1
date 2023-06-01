import {Component, createSignal, For, onMount, Show} from "solid-js";
import Flex from "../components/layouts/Flex";
import {getSessionUser} from "../components/Session";


const Analyse: Component = () => {
    const [teams, setTeams] = createSignal<any>([])

    const [projects, setProjects] = createSignal<any>([])

    const [analytics, setAnalytics] = createSignal<any>([])

    const get_teams = async () => {
        let user = getSessionUser()
        const res_team = await fetch(`http://localhost:8080/api/team/${user?.user_id}`, {
            method: "GET",
        });

        let status = await res_team.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the team! Status:" + status)
            return
        }
        let res_t = await res_team.json()
        /* Reset the team */
        let t: any[] = []
        /* Get all team */
        res_t.forEach((element: any) => {
            t.push(element)
        });
        setTeams(t)
    }
    const getDataProject = async () => {
        let user = getSessionUser()
        const res_project = await fetch(`http://localhost:8080/api/project`, {
            method: "GET",
        });

        let status = await res_project.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the data project! Status:" + status)
            return
        }
        let proj: any[] = await res_project.json()

        let p: any[] = projects()
        setProjects([])
        proj.forEach((element: any) => {
            teams().forEach((team: any) => {
                if (element.id == team.data_project_id) {
                    p.push(element)
                }
            })
        });
        setProjects(p)
    }

    const getAnalyse = async () => {
        let user = getSessionUser()
        const res_analyse = await fetch(`http://localhost:8080/api/analytics/${user?.user_id}`, {
            method: "GET",
        });

        let status = await res_analyse.status
        if (status != 200) {
            console.log("[ERROR] Couldn't connect student ! Status:" + status)
            return false
        }
        let anal: any[] = await res_analyse.json()

        let a: any[] = analytics()
        setAnalytics([])
        anal.forEach((element: any) => {
            teams().forEach((team: any) => {
                if(element.data_project_id == team.data_project_id) {
                    a.push(element);
                }
            })
        });
        setAnalytics(a);
    }

    onMount(async () => {
        await get_teams()
        await getDataProject()
        await getAnalyse()
    })

    return (
        <Flex bgc="#444444" br="10px" w="80%" h="80vh" direction="column" jc="space-evenly" ai="center" ovy="scroll" c="#FFFFFF" ff="Roboto">
            <For each={projects()}>
                {(project:any) => (
                    <Flex direction="row" w="95%" h="40%" ovy="scroll" c="#FFFFFF" ff="Roboto" bgc="#555555" br="10px">
                        <h2 class="data-project-name"> Data project : {project.name} </h2>
                        <Flex direction="column" c="#FFFFFF" ff="Roboto" w="60%" ml="5%">
                            <For each={analytics()}>
                                {(analytic:any) => (
                                    <Show when={analytic.data_project_id == project.data_project_id}>
                                        <p>{analytic.file_name}</p>
                                    </Show>
                                )}
                            </For>
                        </Flex>
                    </Flex>
                )}
            </For>
        </Flex>)
}

export default Analyse