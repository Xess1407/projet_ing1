import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Team.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import { getSessionUser } from "../components/Session";
import LinkItems from "../components/LinkItems";
import { Link } from "@solidjs/router";


const Team: Component = () => {
    const [createTeam, setCreateTeam] = createSignal(false)
    const [editTeam, setEditTeam] = createSignal(false)

    const [searchValue, setSearchValue] = createSignal("")
    const [students, setStudent] = createSignal<any>([])
    const [studentsNames, setStudentNames] = createSignal<string[]>([])
    const [teams, setTeams] = createSignal<any>([])
    const [projects, setProjects] = createSignal<any>([])
    const [members, setMembers] = createSignal<any>([])
    const [selectedProject, setSelectedProject] = createSignal(1)
    const [selectedTeam, setSelectedTeam] = createSignal(1)

    const [showList, setShowList] = createSignal(false);

    const [userTeams, setUserTeams] = createSignal<any>([])
    const [userTeamsMembers, setUserTeamsMembers] = createSignal<any>([])

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
            s_all.push({name: element.name, family_name: element.family_name, user_id: element.user_id})
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

        if(selectedTeam() == -1) {
            /* Erreur pas d'équipe selectionner */
            return 
        }
        
        let data = {team_id: selectedTeam(), user_id: user_to_add_id, password: user?.password}

        
        const res_team = await fetch(`http://localhost:8080/api/member`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_team.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the member! Status:" + status)
            return
        }

        handleChangeMember()
    }

    /* Get team associeted to the selected data project */
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
        let projects = await res_project.json()
        setProjects(projects)
    }

    const getUserTeams = async () => {
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
        res_t.forEach((element: any) => {
            t.push(element);
        });
        setUserTeams(t)
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

    const getUserTeamsMembers = async (user_id: any) => {
        const res_member = await fetch(`http://localhost:8080/api/member/user/${user_id}`, {
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
            m.push(element)
        });
        setUserTeamsMembers(m)
    }

    /* Get all members from a team_id */
    const getMembersFromTeam = async (team_id: any) => {
        const res_member = await fetch(`http://localhost:8080/api/member/team/${team_id}`, {
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
        setMembers([])
        /* Get the members of the team if found */
        if (teams().length != 0) {
            await getMembersFromTeam(selectedTeam())
        }
    }

    /* Creation new team */
    let user = getSessionUser()
    const [newMembers, setNewMembers] = createSignal<any>([{user_id: user?.user_id, name: user?.name}])
    const [newSelectedProject, setNewSelectedProject] = createSignal(1)

    const addNewMember = () => {
        let name = studentsNames().find((nom) => { return nom == searchValue()})
        if (name === undefined) {
            console.log("Non trouvé");
            /** Afficher erreur */
            return
        }

        let user_to_add_id = getIdFromName(searchValue())
        if (user_to_add_id == -1) {
            console.log("Utilisateur inconnue");
            return
        }
        let new_data = {user_id: user_to_add_id, name: name}
        if (newMembers().find((user:any) => {
            return new_data.user_id == user.user_id
        })) {
            console.log("Membre déjà ajouté");
            return
        }

        let data = newMembers()
        data.push(new_data)
        setNewMembers([])
        setNewMembers(data)
    }

    const createNewTeam = async () => {
        let user = getSessionUser()
        /* Create the team */
        const res_new_team = await fetch(`http://localhost:8080/api/team`, {
            method: "POST",
            body: JSON.stringify({user_captain_id: user?.user_id, password: user?.password, data_project_id: newSelectedProject()}),
            headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_new_team.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the new team! Status:" + status)
            return
        }

        let res = await res_new_team.json()
        console.log((res));
        
        let team_id = res.team_id
        /* Add all the members to the new team */
        newMembers().forEach(async (element: any) => {
            if (element.user_id != res.user_id) {
                let data = {team_id: team_id, user_id: element.user_id, password: user?.password}
                console.log(data);
                
                const res_team = await fetch(`http://localhost:8080/api/member`, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {"Content-type": "application/json; charset=UTF-8"} 
                });

                let status = await res_team.status
                if (status != 200) {
                    console.log("[ERROR] Couldn't register the member! Status:" + status)
                    return
                }
            }
        });
        setShowList(false);
        await getUserTeams();
        await getUserTeamsMembers(user?.user_id);
        setShowList(true);
    }

    const handle_change_project = (e:any) => {
        setNewSelectedProject(Number(e.currentTarget.value));
        setNewMembers([])
        let user = getSessionUser()
        setNewMembers([{user_id: user?.user_id, name: user?.name}])
    }
    
    onMount(async () => {
        setShowList(false);
        await getStudents()
        await getDataProject()
        await getUserTeams()
        await getUserTeamsMembers(user?.user_id)
        await handleChangeTeam()
        await handleChangeMember()
        setShowList(true);
    })

    const handle_show = (code: number) => {
        let [a,b] = [!createTeam(), !editTeam()]
        setCreateTeam(false)
        setEditTeam(false)
        switch (code){
            case 1: if (a) setCreateTeam(true); else setCreateTeam(false); break;
            case 2: if (b) setEditTeam(true); else setEditTeam(false); break;
        }
    }

    return (
        <Flex direction="row" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" bgc="#111111"> 
            <Box w="45%">
                <h1 class="text">
                    <span>Your Teams</span>
                </h1>
                <Flex direction="column" ml="15%">
                    <Show when={showList()}>
                        <Flex mb="5%" direction="column">
                            <For each={userTeams()}>
                            {(team: any) => (
                                <For each={projects().filter((project: any) => project.id === team.data_project_id)}>
                                {(project: any) => {
                                    const teamMembers = userTeamsMembers()
                                    .filter((member: any) => member.team_id === team.id)
                                    .map((member: any) => {
                                        const student = students().find((student: any) => student.user_id === member.user_id);

                                        const isCaptain = student?.user_id === team.user_captain_id;

                                        if(student) {
                                            if (isCaptain) {
                                                return (
                                                    <Flex fsz="18px" c="red" ff="Roboto">
                                                        <span>Captain: {student.name} {student.family_name}</span>
                                                    </Flex>
                                                );
                                            }
        
                                            return <Flex fsz="18px" c="white" ff="Roboto"><span>{student.name} {student.family_name}</span></Flex>;
                                        } else {
                                            return null;
                                        }
                                    });

                                    const filteredTeamMembers = teamMembers.filter(Boolean); // Filtrer les valeurs nulles (chaînes vides)

                                    return (
                                        <Link href={"/yourteam/" + team.id}>
                                            <Box b="2px solid white" mb="2%" h="100%" w="100%" br="8px">
                                                <Flex>
                                                        <Flex fsz="18px" c="white" ff="Roboto">
                                                            <span>Team {team.id} on Project {project.name}: [</span>
                                                        </Flex>
                                                        <For each={filteredTeamMembers}>
                                                        {(teamMember: any, index: () => number) => (
                                                            <>
                                                            {teamMember}
                                                            {index() !== filteredTeamMembers.length - 1 && (
                                                                <Flex fsz="18px" c="white"ff="Roboto">
                                                                    ,&nbsp;
                                                                </Flex>
                                                            )}
                                                            </>
                                                        )}
                                                        </For>
                                                        <Flex fsz="18px" c="white" ff="Roboto">
                                                            <span>]</span>
                                                        </Flex>
                                                </Flex>
                                            </Box>
                                        </Link>
                                    );
                                }}
                                </For>
                            )}
                            </For>
                        </Flex>
                    </Show>
                    <Show when={userTeams().length == 0}>
                        <Box ff="Roboto" fsz="18px" mb="5%" c="#FFFFFF">You don't have a team yet, create it !</Box>
                    </Show>
                    <ButtonCustom text="CREATE YOUR TEAM" ff="Roboto black" fsz="16px" w="300px" h="60px" br="16px" bgc="#3BCFA3" mb="5%" onclick={() => handle_show(1)}/>
                    <ButtonCustom text="EDIT YOUR TEAM" ff="Roboto black" fsz="16px" w="300px" h="60px" br="16px" bgc="#3BCFA3" mb="5%" onclick={() => handle_show(2)} />
                </Flex>
            </Box>
            <Flex w="55%" jc="center" ai="center" m="0">
                <Show when={createTeam()} >
                    <Flex bgc="#555555" w="80%" h="90%" direction="column" jc="space-evenly" ai="center" br="10px">
                        <h1>Create Your Team</h1>
                        <label>Search student</label>
                        <Flex w="80%" jc="space-evenly" ai="center">
                            <Flex direction="column" jc="center" ai="center" w="65%">
                                <input id="search" type="text" placeholder="Name of student" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>
                                <Box w="100%" h="2em" ovy="scroll">
                                    <For each={studentsNames()}>
                                        {(element: string) => (
                                            <Show when={searching(element)}>
                                                <li>{element}</li>
                                            </Show>
                                        )}
                                    </For>
                                </Box>
                            </Flex>
                            <Flex w="35%" jc="space-evenly" ai="center">
                                <select name="data_project" id="data_project" onChange={handle_change_project}>
                                    <For each={projects()}>
                                        {(element) => (
                                            <option value={element.id}>{element.name}</option>
                                            )}
                                    </For>
                                </select>
                                <ButtonCustom text="Ajouter" onclick={addNewMember}/>
                            </Flex>
                        </Flex>
                        <Flex direction="column" ai="center" w="100%" h="60%">
                            <label>Your Teammates</label>
                            <Box w="80%" h="70%" b="2px solid #FFFFFF" br="10px">
                                {/* Requête pour récupérer le joueur recherché */}
                                <For each={newMembers()}>
                                    {(element:any) => (
                                        <p>{element.user_id}</p>
                                    )}
                                </For>
                            </Box>
                            <ButtonCustom onclick={createNewTeam} text="CREATE" ff="Roboto black" fsz="16px" w="230px" h="65px" br="16px" bgc="#8DCEB0" mt="4%"/>
                        </Flex>
                    </Flex>
                </Show>
                <Show when={editTeam()} >
                    <Flex bgc="#555555" w="80%" h="90%" direction="column" jc="space-evenly" ai="center" br="10px">
                        <h1>Edit Your Team</h1>
                        <label>Search student</label>
                        <Flex w="80%" jc="space-evenly" ai="center">
                            <Flex direction="column" jc="center" ai="center" w="65%">
                                <input id="search" type="text" placeholder="Name of student" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>
                                <Box w="100%" h="2em" ovy="scroll">
                                    <For each={studentsNames()}>
                                        {(element: string) => (
                                            <Show when={searching(element)}>
                                                <li>{element}</li>
                                            </Show>
                                        )}
                                    </For>
                                </Box>
                            </Flex>
                            <Flex w="35%" jc="space-evenly" ai="center">
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
                        </Flex>
                        <Flex direction="column" ai="center" w="100%" h="60%">
                            <label>Your Teammates</label>
                            <Box w="80%" h="70%" b="2px solid #FFFFFF" br="10px">
                                {/* Requête pour récupérer le joueur recherché */}
                                <For each={members()}>
                                    {(element:any) => (
                                        <p>{element.user_id}</p>
                                    )}
                                </For>
                            </Box>
                            <ButtonCustom text="UPDATE" ff="Roboto black" fsz="16px" w="230px" h="65px" br="16px" bgc="#8DCEB0" mt="4%"/>
                        </Flex>
                    </Flex>
                </Show>
            </Flex>
        </Flex>
    )
}

export default Team