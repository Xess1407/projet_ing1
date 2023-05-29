import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import "./css/DashboardUser.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import { studentForm, setStudentForm, submit_student } from "../components/forms/RegisterStudentForm";
import InputCustom from "../components/generals/InputCustom";
import { getSessionUser } from "../components/Session";
import { managerForm, setManagerForm, submit_manager } from "../components/forms/RegisterManagerForm";
import { form } from "../components/forms/ProfileForm";

const [stat, setStat] = createSignal(true)

const DashboardUser: Component = () => {
    setStudentForm({
        "password": "my_s3cr3t_p4ssw0rd"
    })

    setManagerForm({
        "password": "my_s3cr3t_p4ssw0rd"
    })

    const [school_level, setSchool_level] = createSignal("none");
    createEffect(() => {
        setStudentForm({ school_level: school_level() });
    });

    const [addStudent, setAddStudent] = createSignal(false)
    const [removeStudent, setRemoveStudent] = createSignal(false)
    const [addManager, setAddManager] = createSignal(false)
    const [removeManager, setRemoveManager] = createSignal(false)

    const [searchValue, setSearchValue] = createSignal("")

    const [students, setStudent] = createSignal<any>([])
    const [totalStudents, setTotalStudents] = createSignal<number>(0)
    const [studentsNames, setStudentNames] = createSignal<string[]>([])

    const [managers, setManager] = createSignal<any>([])
    const [totalManagers, setTotalManagers] = createSignal<number>(0)
    const [managersNames, setManagerNames] = createSignal<string[]>([])

    const [teams, setTeams] = createSignal<any>([])
    const [projects, setProjects] = createSignal<any>([])
    const [members, setMembers] = createSignal<any>([])
    const [selectedProject, setSelectedProject] = createSignal(1)
    const [selectedTeam, setSelectedTeam] = createSignal(1)


    const [studentsToRemove, setStudentToRemove] = createSignal<any>([], { equals: false })

    const [managerToRemove, setManagerToRemove] = createSignal<any>([], { equals: false })

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
            s_all.push({id: element.id, name: element.name, user_id: element.user_id})
            setStudent(s_all)
            setTotalStudents(s_all.length);
            /* Get only the names of the students */
            let s: string[] = studentsNames()
            s.push(element.name)
            setStudentNames(s) 
        });
        //console.log(students());
        //console.log(studentsNames());   
    }

    const getManagers = async () => {
        // Fetch the Managers
        const res_managers = await fetch(`http://localhost:8080/api/manager/full`, {
            method: "GET"
        });

        let status = await res_managers.status
        if (status != 200) {res_managers
            console.log("[ERROR] Couldn't get the managers! Status:" + status)
            return
        }
        let res = await res_managers.json()
        
        res.forEach((element: any) => {
            let m_all:any[] = managers()
            m_all.push({id: element.id, name: element.name, user_id: element.user_id})
            setManager(m_all)
            setTotalManagers(m_all.length);
            /* Get only the names of the managers */
            let m: string[] = managersNames()
            m.push(element.name)
            setManagerNames(m) 
        });
    }

    const getIdFromName = (name: string) => {
        let v = -1
        students().forEach((element: any) => {
            if(element.name == name) v = element.user_id
        });
        return v
    }

    const getIdFromNameManager = (name: string) => {
        let v = -1
        managers().forEach((element: any) => {
            if(element.name == name) v = element.user_id
        });
        return v
    }

    const getIdStudentFromName = (name: string) => {
        let v = -1
        students().forEach((element: any) => {
            if(element.name == name) v = element.id
        });
        return v
    }

    const getIdManagerFromNameManager = (name: string) => {
        let v = -1
        managers().forEach((element: any) => {
            if(element.name == name) v = element.id
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
            console.log("Utilisateur inconnu");
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

    const addToStudentToRemove = () => {
        let name = studentsNames().find((nom) => { return nom == searchValue()})
        if (name === undefined) {
            console.log("Non trouvé");
            /** Afficher erreur */
            return
        }

        let user_to_remove_id = getIdFromName(searchValue())
        if (user_to_remove_id == -1) {
            console.log("Utilisateur inconnu");
            return
        }

        let data = studentsToRemove()
        data.push({id: getIdStudentFromName(searchValue()), user_id: user_to_remove_id})
        setStudentToRemove(data)
    }

    const addToManagerToRemove = () => {
        let name = managersNames().find((nom) => { return nom == searchValue()})
        if (name === undefined) {
            console.log("Non trouvé");
            /** Afficher erreur */
            return
        }

        let user_to_remove_id = getIdFromNameManager(searchValue())
        if (user_to_remove_id == -1) {
            console.log("Utilisateur inconnu");
            return
        }

        let data = managerToRemove()
        data.push({id: getIdManagerFromNameManager(searchValue()), user_id: user_to_remove_id})
        setManagerToRemove(data)
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
        await getManagers()
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

    const handle_submit_student = (event: Event): void => {
        event.preventDefault();
        if (stat()) {
            (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerHTML = "";
            submit_student(studentForm)
            setTotalStudents(totalStudents() + 1);
            return
        }
        (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerText = "Erreur: Les deux mots de passes ne sont pas identiques"; 
    }

    const handle_submit_manager = (event: Event): void => {
        event.preventDefault();
        if (stat()) {
            (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerHTML = "";
            submit_manager(managerForm)
            setTotalManagers(totalManagers() + 1);
            return
        }
        (document.getElementById("form-not-same-password-message") as HTMLInputElement).innerText = "Erreur: Les deux mots de passes ne sont pas identiques"; 
    }

    const handle_submit_delete_students = async (event: Event) => {
        event.preventDefault();
        studentsToRemove().forEach( async (element:any) => {
            let res_delete_student = await fetch(`http://localhost:8080/api/student`, {
            method: "DELETE",
            body: JSON.stringify({id: element.id, user_id: element.user_id, password: "admin"}),
            headers: {"Content-type": "application/json; charset=UTF-8"} 
            });

            let status = await res_delete_student.status
            if (status != 200) {
                console.log("[ERROR] Couldn't delete the student! Status:" + status)
                return status
            }
        });
    }

    const handle_submit_delete_manager = async (event: Event) => {
        event.preventDefault();
        managerToRemove().forEach( async (element:any) => {
            let res_delete_student = await fetch(`http://localhost:8080/api/manager`, {
            method: "DELETE",
            body: JSON.stringify({id: element.id, user_id: element.user_id, password: "admin"}),
            headers: {"Content-type": "application/json; charset=UTF-8"} 
            });

            let status = await res_delete_student.status
            if (status != 200) {
                console.log("[ERROR] Couldn't delete the manager! Status:" + status)
                return status
            }
        });
    }

    return (
        <Flex w="80%" jc="space-evenly">
            <Flex bgc="#444444" br="10px" w="40%" h="80%" direction="column">
                <Flex w="100%" h="50%" direction="">
                    <Flex directon="column" w="50%" jc="space-evenly" ai="center">
                        <Box w="60%" h="60%" bgc="#222222" br="10px" c="#FFFFFF" ta="center" ff="Roboto">
                            <h3>Total students</h3>
                            <p>{totalStudents()}</p>
                        </Box>
                    </Flex>
                    <Flex w="50%" direction="column" jc="space-evenly" ai="center">
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Student" onclick={() => handle_show(1)}/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Student" onclick={() => handle_show(2)}/>
                    </Flex>
                </Flex>
                <Flex w="100%" h="50%">
                    <Flex directon="column" w="50%" jc="space-evenly" ai="center">
                        <Box w="60%" h="60%" bgc="#222222" br="10px" c="#FFFFFF" ta="center" ff="Roboto">
                            <h3>Total Managers</h3>
                            <p>{totalManagers()}</p>
                        </Box>
                    </Flex>
                    <Flex w="50%" direction="column" jc="space-evenly" ai="center">
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Manager" onclick={() => handle_show(3)}/>
                        <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Manager" onclick={() => handle_show(4)}/>
                    </Flex>
                </Flex>
            </Flex>
            <Show when={addStudent()}>
                <Flex bgc="#444444" br="10px" w="50%" h="60%" jc="center" ai="center">
                    <form onSubmit={ handle_submit_student }>
                        <Flex direction="row" jc="space-around" w="100%" h="70%">
                            <Flex direction="column" w="45%" jc="space-evenly" ai="center">
                                <Flex direction="column" mt="2%">
                                    <InputCustom id="name" label="Firstname" type="text" placeholder="Firstname" update={setStudentForm}/>
                                </Flex>
                                <Flex direction="column" mt="4%">
                                    <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}" update={setStudentForm}/>
                                </Flex>
                                <Flex direction="column" mt="4%">
                                    <InputCustom id="telephone_number" label="Number" type="tel" placeholder="Number" update={setStudentForm} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                                </Flex>
                            </Flex>
                            <Flex direction="column" w="45%" jc="space-evenly" ai="center" p="0">
                                <Flex direction="column" h="25%"> 
                                    <InputCustom id="family_name" label="Surname" type="text" placeholder="Surname" update={setStudentForm} />
                                </Flex>
                                <Flex direction="row" w="90%" jc="space-between" ai="center">
                                    <Flex mt="8%" direction="column" w="35%">
                                        <select id="school_level" required>
                                            <option value="">Level</option>
                                            <option value="L1">Licence 1</option>
                                            <option value="L2">Licence 2</option>
                                            <option value="L3">Licence 3</option>
                                            <option value="M1">Master 1</option>
                                            <option value="M2">Master 2</option>
                                            <option value="D">Doctorate</option>
                                        </select>
                                    </Flex>
                                    <Flex direction="column" w="60%">
                                        <input id="school" type="text" placeholder="Etablishment"  value={form.school}/>
                                    </Flex>
                                </Flex>
                                <Flex mb="7.5%" $direction="column">
                                    <input id="city" placeholder="City" value={form.city} />
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex jc="center" ai="center">
                            <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                        </Flex>
                    </form>
                </Flex>
            </Show>
            <Show when={removeStudent()}>
                <Flex direction="column" bgc="#444444" br="10px" w="50%" h="60%" jc="space-evenly" ai="center" ff="Roboto" pt="3%">
                    <label class="label-remove">Remove Student</label>
                        <form class="form-remove" onSubmit={ handle_submit_delete_students }>
                            <Flex w="95%" jc="space-evenly" ai="center">
                                <Flex direction="column" jc="space-evenly" ai="center" w="65%">
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
                                    <ButtonCustom text="Ajouter" onclick={addToStudentToRemove}/>
                                </Flex>
                            </Flex>
                            <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                                <label>Student to remove</label>
                                <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
                                    {/* Requête pour récupérer le joueur recherché */}
                                    <For each={studentsToRemove()}>
                                        {(element:any) => (
                                            <p>{element.user_id}</p>
                                            )}
                                    </For>
                                </Box>
                                <ButtonCustom class="form-submit" type="submit" value="submit" text="REMOVE" ff="Roboto black" fsz="16px" w="230px" h="60px" br="16px" bgc="#E36464" mt="4%"/>
                            </Flex>
                        </form>
                </Flex>
            </Show>
            <Show when={addManager()}>
                <Flex bgc="#444444" br="10px" w="50%" h="60%" jc="center" ai="center">
                    <form onSubmit={ handle_submit_manager }>
                        <Flex direction="row" jc="space-around" w="100%" h="70%" mt="5%">
                            <Flex direction="column" w="47%" jc="space-around" ai="center">
                                <Flex direction="column" mt="4%">
                                    <InputCustom id="name" label="Firstname" type="text" placeholder="Firstname" update={setManagerForm}/>
                                </Flex>
                                <Flex direction="column" mt="4%">
                                    <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}" update={setManagerForm}/>
                                </Flex>
                                <Flex direction="column" mt="4%">
                                    <InputCustom id="telephone_number" label="Number" type="tel" placeholder="Number" update={setManagerForm} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                                </Flex>
                            </Flex>
                            <Flex direction="column" w="47%" jc="space-around" ai="center">
                                <Flex direction="column" mt="4%"> 
                                    <InputCustom id="family_name" label="Surname" type="text" placeholder="Surname" update={setManagerForm} />
                                </Flex>
                                <Flex direction="column" mt="4%">
                                    <InputCustom id="company" label="Company" type="text" placeholder="Company" update={setManagerForm}/>
                                </Flex>
                                <Flex direction="row" w="80%" jc="space-between">
                                    <Flex direction="column" w="48%" mt="4%">
                                        <InputCustom id="activation_date" label="Date" type="text" placeholder="Activation" update={setManagerForm}/>
                                    </Flex>
                                    <Flex direction="column" w="48%" mt="4%">
                                        <InputCustom id="deactivation_date" label="Date" type="text" placeholder="Desactivation" update={setManagerForm}/>
                                    </Flex>
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
                <Flex direction="column" bgc="#444444" br="10px" w="50%" h="60%" jc="space-evenly" ai="center" ff="Roboto" pt="3%">
                <label class="label-remove">Remove Manager</label>
                <form class="form-remove" onSubmit={ handle_submit_delete_manager }>
                    <Flex w="95%" jc="space-evenly" ai="center">
                        <Flex direction="column" jc="space-evenly" ai="center" w="65%">
                            {/* Call à la bdd pour trouver le joueur recherché */}
                            <input id="search" type="text" placeholder="Name of manager" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>  
                            <Box w="100%" h="2em" ovy="scroll">
                                <For each={managersNames()}>
                                    {(element: string) => (
                                        <Show when={searching(element)}>
                                            <li>{element}</li>
                                        </Show>
                                    )}
                                </For>
                            </Box>
                        </Flex>
                        <Flex w="35%" jc="space-evenly" ai="center">
                            
                            <ButtonCustom text="Ajouter" onclick={addToManagerToRemove}/>
                        </Flex>
                    </Flex>
                    <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                        <label>Managers</label>
                        <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
                            {/* Requête pour récupérer le joueur recherché */}
                            <For each={managerToRemove()}>
                                {(element:any) => (
                                    <p>{element.user_id}</p>
                                )}
                            </For>
                        </Box>
                        <ButtonCustom class="form-submit" type="submit" value="submit" text="REMOVE" ff="Roboto black" fsz="16px" w="230px" h="60px" br="16px" bgc="#E36464" mt="4%"/>
                    </Flex>
                </form>
                </Flex>
            </Show>
        </Flex>
    )
}

export default DashboardUser