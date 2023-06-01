import {Component, createSignal, For, onMount, Show} from "solid-js";
import Flex from "../components/layouts/Flex";
import {getSessionUser, isManager} from "../components/Session";
import {Chart} from "chart.js/auto";
import "./css/Dashboard.css"
import Box from "../components/layouts/Box";

const Analyse: Component = () => {
    const [teams, setTeams] = createSignal<any>([])

    const [projects, setProjects] = createSignal<any>([])
    const [students, setStudent] = createSignal<any>([])
    const [analytics, setAnalytics] = createSignal<any>([], {equals: false})

    const getStudents = async () => {
        // Fetch the Student
        const res_students = await fetch(`http://localhost:8080/api/student/full`, {
            method: "GET"
        });

        let status = await res_students.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the student! Status:" + status)
            return
        }
        let res = await res_students.json()
        
        res.forEach((element: any) => {
            let s_all:any[] = students()
            s_all.push({name: element.name, family_name: element.family_name, user_id: element.user_id})
            setStudent(s_all)
        });
    }

    const getFullName = (user_id: number) => {
        let v = ""
        students().forEach((element: any) => {
            if(element.user_id == user_id) {
                v = element.name + " " + element.family_name
            }
        });
        return v
    }

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
                            label: 'Lines',
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
                label: 'Functions',
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
        if (!isManager()) {
            proj.forEach((element: any) => {
                teams().forEach((team: any) => {
                    if (element.id == team.data_project_id) {
                        p.push(element)
                    }
                })
            });
        } else {
            p = proj
        }
        setProjects(p)
    }

    const getAnalyse = async () => {
        let user = getSessionUser()
        const res_analyse = await fetch(`http://localhost:8080/api/analytics`, {
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
        if (!isManager()){
        anal.forEach((element: any) => {
            teams().forEach((team: any) => {
                if(element.data_project_id == team.data_project_id && element.user_id == user?.user_id) {
                    element.json_data = JSON.parse(element.json_data)
                    a.push(element);
                }
            })
        });} else {
            anal.forEach((element: any) => {
                element.json_data = JSON.parse(element.json_data)
                a.push(element);
            })
        }
        setAnalytics(a);
    }
    
    /*linesStats.(maxLines,avgLines,minLines) functionCount lineCount*/
    onMount(async () => {
        await getStudents()
        await get_teams()
        await getDataProject()
        await getAnalyse()
    })

    return (
        <Flex bgc="#444444" br="10px" w="80%" h="90%" fw="wrap" direction="row" jc="space-evenly" ai="center" ovy="scroll" c="#FFFFFF" ff="Roboto">
            <For each={projects()}>
                {(project:any) => (
                    <Flex direction="row" w="95%" h="60%" c="#FFFFFF"ff="Roboto" bgc="#555555"jc="center" ai="center" br="10px" m="2% 0 2% 0">
                        <h2 class="data-project-name"> Data project : {project.name} </h2>
                        {/* <Flex direction="column" c="#FFFFFF" b="2px solid red" ff="Roboto" w="65%" ml="5%"> */}
                            <For each={analytics()}>
                                {(analytic:any) => (
                                    <Flex direction="column" w="65%" h="94%" ovy="scroll" c="#FFFFFF" ff="Roboto" bgc="#666666" br="10px" jc="center" ai="center">
                                        <Show when={(analytic.data_project_id == project.id)}>
                                            <Flex w="100%" h="100%" direction="column">
                                                <Flex ml="5%" direction="column" ff="Roboto">
                                                    <p>Name student : {getFullName(analytic.user_id)}</p>
                                                    <p>Name file : {analytic.file_name}</p>
                                                    <Flex ff="Roboto" jc="space-evenly">
                                                        <p>Number of lines</p>
                                                        <p>Number of functions</p>
                                                    </Flex>
                                                </Flex>
                                                <Flex jc="center">
                                                    <button class="button-stats" onclick={() => {get_chart(analytic)}}>PRESS</button>
                                                </Flex>
                                                <canvas id={analytic.id+"linesStats"} width="400px" height="100px" role="img"></canvas>
                                                <Flex direction="row" w="100%" h="100%" jc="space-evenly" ai="center">
                                                    <canvas class="dougnuts" id={analytic.id+"functionCount"} role="img"></canvas>
                                                    <canvas class="dougnuts" id={analytic.id+"lineCount"} role="img"></canvas>
                                                </Flex>
                                            </Flex>
                                        </Show>
                                    </Flex>
                                )}
                            </For>
                    </Flex>
                )}
            </For>
        </Flex>)
}

export default Analyse