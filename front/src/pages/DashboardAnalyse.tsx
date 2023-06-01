import {Component, createSignal, For, onMount, Show} from "solid-js";
import Flex from "../components/layouts/Flex";
import {getSessionUser} from "../components/Session";
import {Chart} from "chart.js/auto";
const Analyse: Component = () => {
    const [teams, setTeams] = createSignal<any>([])

    const [projects, setProjects] = createSignal<any>([])

    const [analytics, setAnalytics] = createSignal<any>([])

    const get_chart_LinesStats = (analytic: any) => {

        //var barColors = ["#0DC9C1", "#e36464","#0ac2b9"];
        const data = [
            { name: "Maximum", count: analytic.json_data.linesStats.maxLines},
            { name: "Average", count: analytic.json_data.linesStats.avgLines},
            { name: "Minimum", count: analytic.json_data.linesStats.minLines},
        ]

        new Chart(
            document.getElementById(analytic.id+"linesStats") as any,
            {
                type: 'bar',
                data: {
                    labels: data.map(row => row.name),
                    datasets: [
                        {
                            label: 'Number of lines by function',
                            data: data.map(row => row.count)
                        }
                    ]
                }
            }
        );
    }

    const get_chart_functionCount = (analytic: any) => {
        const data = {
            datasets: [{
                label: 'Number of functions',
                data: [analytic.json_data.functionCount/4, analytic.json_data.functionCount],
                backgroundColor: [
                    '#666666',
                    '#0ac2b9'
                ],
                hoverOffset: 4
            }]
        }
        new Chart(
            document.getElementById(analytic.id+"functionCount") as any,
            {
                type: 'doughnut',
                data: data,
            }
        )

    }

    const get_chart_LineCount = (analytic: any) => {
        const data = {
            datasets: [{
                label: 'Number of Lines',
                data: [analytic.json_data.lineCount/2, analytic.json_data.lineCount],
                backgroundColor: [
                    '#666666',
                    '#0ac2b9'
                ],
                hoverOffset: 4
            }]
        }
        new Chart(
            document.getElementById(analytic.id+"lineCount") as any,
            {
                type: 'doughnut',
                data: data,
            }
        )
    }

    const get_chart = (analytic: any) => {
        get_chart_LinesStats(analytic);
        get_chart_functionCount(analytic);
        get_chart_LineCount(analytic)
    }

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
                    element.json_data = JSON.parse(element.json_data)
                    a.push(element);
                }
            })
        });
        setAnalytics(a);
    }
    /*linesStats.(maxLines,avgLines,minLines) functionCount lineCount*/
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
                                    <Flex direction="row" w="95%" h="45%" mt="2%" ovy="scroll" c="#FFFFFF" ff="Roboto" bgc="#666666" br="10px">

                                    <Show when={(analytic.data_project_id == project.id)}>
                                        <div id={"plot"+analytic.id}></div>
                                        <p>Nombre de lignes : {analytic.json_data.lineCount}</p>
                                        <p>Nombre de fonctions : {analytic.json_data.functionCount}</p>
                                        <p>Nombre moyen de lignes par fonction : {Math.round(analytic.json_data.linesStats.avgLines)}</p>
                                        <p>Nombre maximum de lignes par fonction : {analytic.json_data.linesStats.maxLines}</p>
                                        <p>Nombre minimum de lignes par fonction : {analytic.json_data.linesStats.minLines}</p>
                                        <button onclick={() => {get_chart(analytic)}}></button>
                                        <canvas id={analytic.id+"linesStats"} width="400" height="100" role="img"></canvas>
                                        <canvas id={analytic.id+"functionCount"} width="400" height="100" role="img"></canvas>
                                        <canvas id={analytic.id+"lineCount"} width="400" height="100" role="img"></canvas>
                                    </Show>
                                    </Flex>
                                )}
                            </For>
                        </Flex>
                    </Flex>
                )}
            </For>
        </Flex>)
}

export default Analyse