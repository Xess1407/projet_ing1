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
    function handleSchoolLevelChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        setStudentForm({
            school_level: target.value,
        });
    }
    
    function handleSchoolChange(event: Event) {
        const target = event.target as HTMLInputElement;
        setStudentForm({
            school: target.value,
        });
    }
    
    function handleCityChange(event: Event) {
        const target = event.target as HTMLInputElement;
        setStudentForm({
            city: target.value,
        });
    }

    const [addStudent, setAddStudent] = createSignal(false)
    const [removeStudent, setRemoveStudent] = createSignal(false)
    const [addManager, setAddManager] = createSignal(false)
    const [removeManager, setRemoveManager] = createSignal(false)

    const [searchValue, setSearchValue] = createSignal("")

    const [students, setStudents] = createSignal<any>([])
    const [totalStudents, setTotalStudents] = createSignal<number>(0)
    const [studentsNames, setStudentNames] = createSignal<string[]>([])

    const [managers, setManagers] = createSignal<any>([])
    const [totalManagers, setTotalManagers] = createSignal<number>(0)
    const [managersNames, setManagerNames] = createSignal<string[]>([])

    const [projects, setProjects] = createSignal<any>([])

    const [studentToRemove, setStudentToRemove] = createSignal<any>([], { equals: false })

    const [managerToRemove, setManagerToRemove] = createSignal<any>([], { equals: false })

    function searching(ele: string): boolean { return ele.toLowerCase().includes(searchValue().toLowerCase()) }
    
    const getStudents = async () => {
        const res_students = await fetch(`http://localhost:8080/api/student/full`, {
            method: "GET",
        });
    
        let status = await res_students.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get students! Status:" + status)
            return
        }
        let stud = await res_students.json()
        setStudents(stud)
        setTotalStudents(students().length)
    }
    
    const getManagers = async () => {
        const res_managers = await fetch(`http://localhost:8080/api/manager/full`, {
            method: "GET",
        });
    
        let status = await res_managers.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get managers! Status:" + status)
            return
        }
        let mana = await res_managers.json()
        setManagers(mana)
        setTotalManagers(managers().length)
    }
    
    const addToStudentToRemove = () => {
        let student = students().find((st:any) => { return st.name == searchValue()})
        if (student === undefined) {
            console.log("Non trouvé");
            /** Afficher erreur */
            return
        }
    
        let data = studentToRemove()
        data.push(student)
        setStudentToRemove(data)
    }

    const addToManagerToRemove = () => {
        let manager = managers().find((st:any) => { return st.name == searchValue()})
        if (manager === undefined) {
            console.log("Non trouvé");
            /** Afficher erreur */
            return
        }
    
        let data = managerToRemove()
        data.push(manager)
        setManagerToRemove(data)
    }
    
    /*
    const handle_show = (code: number) => {
        let [a,b, c, d] = [!addChallenge(), !removeChallenge(), !addResource(), !removeResource()]
        setAddChallenge(false)
        setRemoveChallenge(false)
        setAddResource(false)
        setRemoveResource(false)
        switch (code){
            case 1: if (a) setAddChallenge(true); else setAddChallenge(false); break;
            case 2: if (b) setRemoveChallenge(true); else setRemoveChallenge(false); break;
            case 3: if (c) setAddResource(true); else setAddResource(false); break;
            case 4: if (d) setRemoveResource(true); else setRemoveResource(false); break;
        }
    }
    */

    const handle_submit_delete_student = async (event: Event) => {
        event.preventDefault();
        for(const element of studentToRemove()) {
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
        };
        setStudentToRemove([]);
        await getStudents()
    }

    const handle_submit_delete_manager = async (event: Event) => {
        event.preventDefault();
        for(const element of managerToRemove()) {
            let res_delete_manager = await fetch(`http://localhost:8080/api/manager`, {
            method: "DELETE",
            body: JSON.stringify({id: element.id, user_id: element.user_id, password: "admin"}),
            headers: {"Content-type": "application/json; charset=UTF-8"} 
            });
    
            let status = await res_delete_manager.status
            if (status != 200) {
                console.log("[ERROR] Couldn't delete the manager! Status:" + status)
                return status
            }
        };
        setManagerToRemove([]);
        await getManagers()
    }
    
    const handle_submit_student = async (event: Event): Promise<void> => {
        event.preventDefault();
        await submit_student(studentForm)
        await getStudents()
    }

    const handle_submit_manager = async (event: Event): Promise<void> => {
        event.preventDefault();
        await submit_manager(managerForm)
        await getManagers()
    }
    
    onMount(async () => {
        await getStudents()
        await getManagers()
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
                <Flex bgc="#444444" br="10px" w="50%" h="70%" jc="center" ai="center">
                    <form onSubmit={ handle_submit_student }>
                        <Flex direction="row" jc="space-around" w="100%" h="70%">
                            <Flex direction="column" w="45%" jc="space-evenly" ai="center">
                                <Flex direction="column" mt="2%">
                                    <InputCustom id="name" label="Firstname" type="text" placeholder="Firstname" update={setStudentForm}/>
                                </Flex>
                                <Flex direction="column" mt="2%">
                                    <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}" update={setStudentForm}/>
                                </Flex>
                                <Flex direction="column" mt="2%">
                                    <InputCustom id="telephone_number" label="Number" type="tel" placeholder="Number" update={setStudentForm} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                                </Flex>
                                <Flex direction="column" mt="2%">
                                    <InputCustom id="password" label="password" type="password" placeholder="Password" update={setStudentForm}></InputCustom>
                                </Flex>
                            </Flex>
                            <Flex direction="column" w="45%" jc="space-evenly" ai="center" p="0">
                                <Flex direction="column" h="25%"> 
                                    <InputCustom id="family_name" label="Surname" type="text" placeholder="Surname" update={setStudentForm} />
                                </Flex>
                                <Flex direction="row" w="90%" jc="space-between" ai="center">
                                    <Flex mt="8%" direction="column" w="35%">
                                        <select id="school_level" required onChange={handleSchoolLevelChange}>
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
                                        <input id="school" type="text" placeholder="Etablishment" required value={form.school} onChange={handleSchoolChange}/>
                                    </Flex>
                                </Flex>
                                <Flex mb="7.5%" $direction="column">
                                    <input id="city" placeholder="City" required value={form.city} onChange={handleCityChange}/>
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
                <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto">
                    <h2>Remove Student</h2>
                    <form class="form-remove" onSubmit={ handle_submit_delete_student }>
                        <Flex w="95%" jc="space-evenly" ai="center">
                            <Flex direction="column" jc="space-evenly" ai="center" w="65%">
                                <input id="search" type="text" placeholder="Name student" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>  
                                <Box w="100%" h="2em" ovy="scroll">
                                    <For each={students()}>
                                        {(element: any) => (
                                            <Show when={searching(element.name)}>
                                                <li>{element.name}</li>
                                            </Show>
                                        )}
                                    </For>
                                </Box>
                            </Flex>
                            <Flex w="35%" jc="space-evenly" ai="center">
                                <ButtonCustom text="Add" onclick={addToStudentToRemove}/>
                            </Flex>
                        </Flex>
                        <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                            <label>Questionnaire to remove</label>
                            <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
                                <For each={studentToRemove()}>
                                    {(element:any) => (
                                        <p>{element.name}</p>
                                    )}
                                </For>
                            </Box>
                            <ButtonCustom class="form-submit" type="submit" value="submit" text="REMOVE" ff="Roboto black" fsz="16px" w="230px" h="60px" br="16px" bgc="#E36464" mt="4%"/>
                        </Flex>
                    </form>
                </Flex>
            </Show>
            <Show when={addManager()}>
                <Flex bgc="#444444" br="10px" w="50%" h="70%" jc="center" ai="center">
                    <form onSubmit={ handle_submit_manager }>
                        <Flex direction="row" jc="space-around" w="100%" h="70%" mt="5%">
                            <Flex direction="column" w="47%" jc="space-around" ai="center">
                                <Flex direction="column" mt="2%">
                                    <InputCustom id="name" label="Firstname" type="text" placeholder="Firstname" update={setManagerForm}/>
                                </Flex>
                                <Flex direction="column" mt="2%">
                                    <InputCustom id="email" label="E-mail" type="email" placeholder="E-mail" pattern=".+@[a-z]{2,32}\.[a-z]{2,10}" update={setManagerForm}/>
                                </Flex>
                                <Flex direction="column" mt="2%">
                                    <InputCustom id="telephone_number" label="Number" type="tel" placeholder="Number" update={setManagerForm} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"></InputCustom>
                                </Flex>
                                <Flex direction="column" mt="2%">
                                    <InputCustom id="password" label="password" type="password" placeholder="Password" update={setManagerForm}></InputCustom>
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
                                        <InputCustom id="activation_date" label="Activation Date" type="date" placeholder="Activation" update={setManagerForm}/>
                                    </Flex>
                                    <Flex direction="column" w="48%" mt="4%">
                                        <InputCustom id="deactivation_date" label="Deactivation Date" type="date" placeholder="Desactivation" update={setManagerForm}/>
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
                <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto">
                    <h2>Remove Manager</h2>
                    <form class="form-remove" onSubmit={ handle_submit_delete_manager }>
                        <Flex w="95%" jc="space-evenly" ai="center">
                            <Flex direction="column" jc="space-evenly" ai="center" w="65%">
                                <input id="search" type="text" placeholder="Name manager" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>  
                                <Box w="100%" h="2em" ovy="scroll">
                                    <For each={managers()}>
                                        {(element: any) => (
                                            <Show when={searching(element.name)}>
                                                <li>{element.name}</li>
                                            </Show>
                                        )}
                                    </For>
                                </Box>
                            </Flex>
                            <Flex w="35%" jc="space-evenly" ai="center">
                                <ButtonCustom text="Add" onclick={addToManagerToRemove}/>
                            </Flex>
                        </Flex>
                        <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                            <label>Questionnaire to remove</label>
                            <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
                                <For each={managerToRemove()}>
                                    {(element:any) => (
                                        <p>{element.name}</p>
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