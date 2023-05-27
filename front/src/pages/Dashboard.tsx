import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit, form, setForm } from "../components/forms/RegisterForm";
import InputCustom from "../components/generals/InputCustom";
import { getSessionUser } from "../components/Session";

const [stat, setStat] = createSignal(true)

const Dashboard: Component = () => {
    const [addStudent, setAddStudent] = createSignal(false)
    const [removeStudent, setRemoveStudent] = createSignal(false)
    const [addManager, setAddManager] = createSignal(false)
    const [removeManager, setRemoveManager] = createSignal(false)

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
            console.log("[ERROR] Couldn't register the student! Status:" + status)
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

    const handle_show = (code: number) => {
        let [a,b,c,d] = [!addStudent(), !removeStudent(), !addManager(), !removeManager()]
        setAddStudent(false)
        setRemoveStudent(false)
        setAddManager(false)
        setRemoveManager(false)
        switch (code){
            case 1: if (a) setAddStudent(true); else setAddStudent(false); break;
            case 2: if (b) setRemoveStudent(true); else setRemoveStudent(false); break;
            case 3: if (c) setAddManager(true); else setAddManager(false); break;
            case 4: if (d) setRemoveManager(true); else setRemoveManager(false); break;
        }
    }

    const handle_submit = (event: Event): void => {
        event.preventDefault();
        if (stat()) {
            (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerHTML = "";
            submit(form)
            return
        }
        (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerText = "Erreur: Les deux mots de passes ne sont pas identiques"; 
    }
    return (
        <Flex bgc="#000000" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" direction="row" jc="space-evenly">
            <Flex direction="column" bgc="#555555" br="10px" w="18%" h="60%" jc="space-evenly" ai="center" c="#FFFFFF" ff="Roboto">
                <h2>Dashboard</h2>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
                    <img class="icons" src="src/img/analytics.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Analytics"/>
                </Flex>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center" bgc="#666666" br="10px">
                    <img class="icons" src="src/img/user.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Users"/>
                </Flex>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
                    <img class="icons" src="src/img/team.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Teams"/>
                </Flex>
                <Flex direction="row" w="100%" h="20%" jc="space-evenly" ai="center">
                    <img class="icons" src="src/img/challenge.png" alt="icon" />
                    <ButtonCustom w="60%" h="50%" br="10px" fs="1.5em" ff="Roboto" fc="#ffffff" fw="bold" text="Data Challenges"/>
                </Flex>
            </Flex>
            <Flex bgc="#444444" br="10px" w="30%" h="80%" direction="column">
                <Flex w="100%" h="50%" direction="">
                    <Flex directon="column" w="50%" jc="space-evenly" ai="center">
                        <Box w="60%" h="60%" bgc="#222222" br="10px" c="#FFFFFF" ta="center">
                            <h3>Total students</h3>
                            <p>6527</p>
                        </Box>
                    </Flex>
                    <Flex w="50%" direction="column" jc="space-evenly" ai="center">
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Student" onclick={() => handle_show(1)}/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Student" onclick={() => handle_show(2)}/>
                    </Flex>
                </Flex>
                <Flex w="100%" h="50%">
                    <Flex directon="column" w="50%" jc="space-evenly" ai="center">
                        <Box w="60%" h="60%" bgc="#222222" br="10px" c="#FFFFFF" ta="center">
                            <h3>Total Managers</h3>
                            <p>6527</p>
                        </Box>
                    </Flex>
                    <Flex w="50%" direction="column" jc="space-evenly" ai="center">
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Manager" onclick={() => handle_show(3)}/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Manager" onclick={() => handle_show(4)}/>
                    </Flex>
                </Flex>
            </Flex>
            <Show when={addStudent()}>
                <Flex bgc="#444444" br="10px" w="40%" h="80%" jc="center" ai="center">
                    <form onSubmit={ handle_submit }>
                        <Flex direction="row" jc="space-around" w="100%" h="70%" mt="5%">
                            <Flex direction="column" w="45%" jc="space-around" ai="center">
                                <Flex direction="column" m="0 0 30px 0" w="100%"> 
                                    <InputCustom id="family-name" label="Surname" type="text" placeholder="Surname" update={setForm} />
                                </Flex>
                                <Flex direction="column" m="0 0 30px 0">
                                    <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}" update={setForm}/>
                                </Flex>
                                <Flex direction="column" m="0 0 30px 0">
                                    <InputCustom id="telephone_number" label="Number" type="tel" placeholder="Number" update={setForm} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                                </Flex>
                            </Flex>
                            <Flex direction="column" w="45%" jc="space-around">
                                <Flex direction="column" m="0 0 30px 0">
                                    <InputCustom id="firstname" label="Firstname" type="text" placeholder="Firstname" update={setForm}/>
                                </Flex>
                                <Flex direction="row" w="100%" jc="space-between">
                                    <Flex direction="column" w="45%">
                                        <select id="school_level" required>
                                            <option value="" disabled selected hidden>Study level</option>
                                            <option value="L1">Licence 1</option>
                                            <option value="L2">Licence 2</option>
                                            <option value="L3">Licence 3</option>
                                            <option value="M1">Master 1</option>
                                            <option value="M2">Master 2</option>
                                            <option value="D">Doctorate</option>
                                        </select>
                                        <label for="school_level" class="school_level_label">Level</label>
                                    </Flex>
                                    <Flex direction="column" m="0 0 30px 0" w="50%">
                                        <InputCustom id="school" label="Etablishment" type="text" placeholder="Etablishement" update={setForm}/>
                                    </Flex>
                                </Flex>
                                <Flex direction="column" m="0 0 30px 0">
                                    <InputCustom id="city" label="City" type="text" placeholder="City" update={setForm}/>
                                    
                                </Flex>
                                <span id="form-not-same-password-message"></span>
                            </Flex>
                        </Flex>
                        <Flex jc="center" ai="center">
                            <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                        </Flex>
                    </form>
                </Flex>
            </Show>
            <Show when={removeStudent()}>
                <Flex direction="column" bgc="#444444" br="10px" w="40%" h="80%" jc="center" ai="center">
                    <Flex w="100%" jc="center" ai="center">
                        <label>Remove student</label>
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
                    <Flex direction="column" ai="center" w="80%" h="60%">
                        <label>Student</label>
                        <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
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

            <Show when={addManager()}>
                <Flex bgc="#444444" br="10px" w="40%" h="80%" jc="center" ai="center">
                    <form onSubmit={ handle_submit }>
                        <Flex direction="row" jc="space-around" w="100%" h="70%" mt="5%">
                            <Flex direction="column" w="45%" jc="space-around" ai="center">
                                <Flex direction="column" m="0 0 30px 0" w="100%"> 
                                    <InputCustom id="family-name" label="Surname" type="text" placeholder="Surname" update={setForm} />
                                </Flex>
                                <Flex direction="column" m="0 0 30px 0">
                                    <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}" update={setForm}/>
                                </Flex>
                                <Flex direction="column" m="0 0 30px 0">
                                    <InputCustom id="telephone_number" label="Number" type="tel" placeholder="Number" update={setForm} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                                </Flex>
                            </Flex>
                            <Flex direction="column" w="45%" jc="space-around">
                                <Flex direction="column" m="0 0 30px 0">
                                    <InputCustom id="firstname" label="Firstname" type="text" placeholder="Firstname" update={setForm}/>
                                </Flex>
                                <Flex direction="row" w="100%" jc="space-between">
                                    <Flex direction="column" w="45%">
                                        <select id="school_level" required>
                                            <option value="" disabled selected hidden>Study level</option>
                                            <option value="L1">Licence 1</option>
                                            <option value="L2">Licence 2</option>
                                            <option value="L3">Licence 3</option>
                                            <option value="M1">Master 1</option>
                                            <option value="M2">Master 2</option>
                                            <option value="D">Doctorate</option>
                                        </select>
                                        <label for="school_level" class="school_level_label">Level</label>
                                    </Flex>
                                    <Flex direction="column" m="0 0 30px 0" w="50%">
                                        <InputCustom id="school" label="Etablishment" type="text" placeholder="Etablishement" update={setForm}/>
                                    </Flex>
                                </Flex>
                                <Flex direction="column" m="0 0 30px 0">
                                    <InputCustom id="city" label="City" type="text" placeholder="City" update={setForm}/>
                                    
                                </Flex>
                                <span id="form-not-same-password-message"></span>
                            </Flex>
                        </Flex>
                        <Flex jc="center" ai="center">
                            <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                        </Flex>
                    </form>
                </Flex>
            </Show>
            <Show when={removeManager()}>
                <Flex direction="column" bgc="#444444" br="10px" w="40%" h="80%" jc="center" ai="center">
                    <Flex w="100%" jc="center" ai="center">
                        <label>Remove student</label>
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
                    <Flex direction="column" ai="center" w="80%" h="60%">
                        <label>Student</label>
                        <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
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
    )
}

export default Dashboard