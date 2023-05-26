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
    const [studentsNames, setStudentNames] = createSignal<string[]>([])
    const [teams, setTeams] = createSignal<any>()
    const [members, setMembers] = createSignal([])
    const [selectedProject, setSelectedTeam] = createSignal(-1)

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
            let s: string[] = studentsNames()
            s.push(element.name)
            setStudentNames(s) 
        });
        console.log(res);
        console.log(studentsNames());   
    }

    const addToTeam = async () => {
        let name = studentsNames().find((nom) => { return nom == searchValue()})
        if (name === undefined) {
            console.log("Non trouvé");
            /** Afficher erreur */
            return
        }

        let user = getSessionUser()
        
        const res_team = await fetch(`http://localhost:8080/api/team`, {
            method: "POST",
            body: JSON.stringify({user_capitain_id: user?.user_id, password: user?.password, data_project_id: teams().data_project_id}),
            headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_team.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the student! Status:" + status)
            return
        }


    }

    /* Get team associeted to the selected data project */
    const getTeam = async () => {
        let user = getSessionUser()
        const res_team = await fetch(`http://localhost:8080/api/team/${user?.user_id}`, {
            method: "GET",
        });

        let status = await res_team.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the student! Status:" + status)
            return
        }
        let teams = await res_team.json()
        teams.forEach((element: any) => {
            if (element.data_project_id == selectedProject)
                setTeams(element)
        });
        
    }

    /* Get all members from a team_id */
    const getMembersFromTeam = async (team_id: any) => {
        const res_member = await fetch(`http://localhost:8080/api/member/${team_id}`, {
            method: "GET",
        });

        let status = await res_member.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the student! Status:" + status)
            return
        }
        let members = await res_member.json()
        setMembers(members)
    }

    onMount(async () => {
        await getStudents()
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
                        <Flex direction="column" jc="center" ai="center" w="100%">
                            <label>Search student</label>
                            {/* Call à la bdd pour trouver le joueur recherché */}
                            <input id="search" type="text" placeholder="Name of student" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>
                            <ButtonCustom text="Ajouter" onclick={addToTeam}/>
                            <For each={studentsNames()}>
                                {(element: string) => (
                                    <Show when={searching(element)}>
                                        <li>{element}</li>
                                    </Show>
                                )}
                            </For>
                        </Flex>
                        <Flex direction="column" ai="center" w="100%" h="60%">
                            <label>Your Teammates</label>
                            <Box w="80%" h="100%" b="2px solid #FFFFFF" br="10px">
                                {/* Requête pour récupérer le joueur recherché */}
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