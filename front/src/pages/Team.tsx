import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Team.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import { getSessionUser } from "../components/Session";




const Team: Component = () => {
    const [createTeam, setCreateTeam] = createSignal(false)
    const [searchValue, setSearchValue] = createSignal("")
    const [students, setStudent] = createSignal<any>([])
    const [studentsNames, setStudentNames] = createSignal<string[]>([])
    const [teams, setTeams] = createSignal<any>([])
    const [projects, setProjects] = createSignal<any>([])
    const [members, setMembers] = createSignal<any>([])
    const [selectedProject, setSelectedProject] = createSignal(1)
    const [selectedTeam, setSelectedTeam] = createSignal(1)

    function searching(ele: string): boolean { return ele.toLowerCase().includes(searchValue().toLowerCase()) }
    
    // Fonction à faire pour faire apparaître le form de recherche pour créer son équipe
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
            s_all.push({name: element.name, user_id: element.user_id})
            setStudent(s_all)
            /* Get only the names of the students */
            let s: string[] = studentsNames()
            s.push(element.name)
            setStudentNames(s) 
        });
        //console.log(students());
        //console.log(studentsNames());   
    }

    const getIdFromName = (name: string) => {
        let v = -1
        students().forEach((element: any) => {
            if(element.name == name) v = element.user_id
        });
        return v
    }

    const addToTeam = async () => {
        let name = studentsNames().find((nom) => { return nom == searchValue()})
        if (name === undefined) {
            console.log("Non trouvé");
            /** Afficher erreur */
            return
        }

        let user = getSessionUser()
        let user_to_add_id = getIdFromName(searchValue())
        if (user_to_add_id == -1) {
            console.log("Utilisateur inconnue");
            return
        }
        
        
        const res_team = await fetch(`http://localhost:8080/api/member`, {
            method: "POST",
            body: JSON.stringify({team_id: teams().id, user_id: user_to_add_id, password: user?.password}),
            headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_team.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the student! Status:" + status)
            return
        }
    }

    /* Get team associeted to the selected data project */
    const getDataProject = async () => {
        let user = getSessionUser()
        const res_project = await fetch(`http://localhost:8080/api/project`, {
            method: "GET",
        });

        let status = await res_project.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the student! Status:" + status)
            return
        }
        let projects = await res_project.json()
        setProjects(projects)
    }

    /* Get team associeted to the selected data project */
    const getTeams = async () => {
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
        //console.log("Select project:" + selectedProject());

        /* Reset the team */
        let t: any[] = []
        /* Get all team of the data project  */
        res_t.forEach((element: any) => {
            if (element.data_project_id == selectedProject()) {
                t.push(element)
            }
        });
        setTeams(t)
    }

    /* Get all members from a team_id */
    const getMembersFromTeam = async (team_id: any) => {
        const res_member = await fetch(`http://localhost:8080/api/member/${team_id}`, {
            method: "GET",
        });

        let status = await res_member.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the members of the team! Status:" + status)
            return
        }
        let members = await res_member.json()
        /* Reset the membres */
        let m: any[] = []
        /* Get all smembres of the team selected  */
        members.forEach((element: any) => {
            if (element.team_id == selectedTeam()) m.push(element)
        });
        setMembers(m)
    }

    const handleChangeTeam = async () => {
        /* Get the team */
        await getTeams()
    }

    const handleChangeMember = async () => {
        console.log(selectedTeam());
        console.log(teams());
        
        setMembers([])
        /* Get the members of the team if found */
        if (teams().length != 0) {
            //console.log("Il y a des teams");
            await getMembersFromTeam(selectedTeam())
        }
        console.log(members());
    }
    
    onMount(async () => {
        await getStudents()
        await getDataProject()
        await handleChangeTeam()
        await handleChangeMember()
    })


    createEffect(() => {
    })

    return (
        <Flex direction="row" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" bgc="#111111"> 
            <Box w="45%">
                <h1 class="text">
                    <span>Your Team</span>
                </h1>
                <Flex direction="column" ml="15%">
                    <Box ff="Roboto" fsz="18px" mb="5%" c="#FFFFFF">You don't have a team yet, create it !</Box>
                    <ButtonCustom text="CREATE YOUR TEAM" ff="Roboto black" fsz="16px" w="300px" h="60px" br="16px" bgc="#3BCFA3" onclick={() => setCreateTeam(!createTeam())} />
                </Flex>
            </Box>
            <Flex w="55%" jc="center" ai="center" m="0">
                <Show when={createTeam()} >
                    <Flex bgc="#555555" w="80%" h="90%" direction="column" jc="space-evenly" ai="center" br="10px">
                        <h1>CREATION</h1>
                        <Flex>
                            <label>Search student</label>
                            <Flex direction="column" jc="center" ai="center" w="100%">
                                {/* Call à la bdd pour trouver le joueur recherché */}
                                <input id="search" type="text" placeholder="Name of student" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>
                                
                                <For each={studentsNames()}>
                                    {(element: string) => (
                                        <Show when={searching(element)}>
                                            <li>{element}</li>
                                        </Show>
                                    )}
                                </For>
                            </Flex>
                            <select name="data_project" id="data_project" onChange={async (e) => { setSelectedProject(Number(e.currentTarget.value)); await handleChangeTeam(); if(teams().length != 0) {setSelectedTeam(1);} else {setSelectedTeam(-1); }handleChangeMember()}}>
                                <For each={projects()}>
                                    {(element) => (
                                        <option value={element.id}>{element.name}</option>
                                    )}
                                </For>
                            </select>
                            <select name="teams" id="teams" onChange={(e) => { setSelectedTeam(Number(e.currentTarget.value)); handleChangeMember()}}>
                                <For each={teams()}>
                                    {(element) => (
                                        <option value={element.id}>{element.id}</option>
                                    )}
                                </For>
                            </select>
                            <ButtonCustom text="Ajouter" onclick={addToTeam}/>
                        </Flex>
                        <Flex direction="column" ai="center" w="100%" h="60%">
                            <label>Your Teammates</label>
                            <Box w="80%" h="100%" b="2px solid #FFFFFF" br="10px">
                                {/* Requête pour récupérer le joueur recherché */}
                                <For each={members()}>
                                    {(element:any) => (
                                        <p>{element.user_id}</p>
                                    )}
                                </For>
                            </Box>
                            <ButtonCustom text="CREATE" ff="Roboto black" fsz="16px" w="230px" h="70px" br="16px" bgc="#8DCEB0" mt="4%"/>
                        </Flex>
                    </Flex>
                </Show>
            </Flex>
        </Flex>
    )
}

export default Team