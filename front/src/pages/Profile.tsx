import { Component, For, Suspense, createEffect, createResource, createSignal, lazy, onMount } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import { Image } from "@kobalte/core";
import "./css/Profile.css";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import { form, setForm } from "../components/forms/ProfileForm";
import { getSessionUser } from "../components/Session";
import LinkItems from "../components/LinkItems";


const Profile = ()=> {
    const [teams, setTeams] = createSignal<any>([])
    const [projects, setProjects] = createSignal<any>([])

    const get_student_profile = async () => {
        let user = {user_id: getSessionUser()?.user_id, password: getSessionUser()?.password};
        // Fetch the Student
        const res_student_profile = await fetch(`http://localhost:8080/api/student/get`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {"Content-type": "application/json; charset=UTF-8"} 
        });
    
        let status = await res_student_profile.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get student information! Status:" + status)
            return 
        }
        let res = await res_student_profile.json()
        setForm({school: res.school, school_level: res.school_level, city: res.city})
        return form
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

    onMount(async () => {
        await get_student_profile()
        await get_teams()
        await getDataProject()
    })
    

    return (/*#222222*/
        <Flex bgc="#111111" direction="row" w="100%" h="calc(100vh - 140px)">
            <Flex direction="column" w="50%" h="100%">
                <Flex w="100%" jc="center">
                    <Image.Root fallbackDelay={600} class="image">
                        <Image.Img
                            class="image__img"
                            src="/src/img/profil.jpg"
                            alt="PP"
                        />
                        <Image.Fallback class="image__fallback">MG</Image.Fallback>
                    </Image.Root>
                </Flex>
                <Flex w="100%" h="100%" jc="space-around">
                    <Box h="262px" w="309px" c="white" ff="Roboto">
                        <h3>Team</h3>
                        <Box b="2px solid white" h="100%" br="8px">
                            <For each={teams()}>
                                {(element:any) => (
                                    <Flex><LinkItems path={"/yourteam/" + element.id} text={"Team" + element.id} /></Flex>
                                )}
                            </For>
                        </Box>
                    </Box>
                    <Box h="262px" w="309px" c="white" ff="Roboto">
                        <h3>Data Projects</h3>
                        <Box b="2px solid white" h="100%" br="8px">
                            <For each={projects()}>
                                {(element:any) => (
                                    <Flex>{element.name}</Flex>
                                )}
                            </For>
                        </Box>
                    </Box>
                </Flex>
            </Flex>
            <Box w="50%" >
                <h1>{form.city}</h1>
                <Flex direction="row" jc="space-around" ai="center" h="600px">
                    <Flex jc="space-evenly" ai="center" c="white" direction="column">
                            <InputCustom id="family_name" label="Surname" type="text" placeholder="Surname" empty default={form.family_name}/>
                            <InputCustom id="email" label="Email" type="text" placeholder="Email" empty default={form.email}/>
                            <InputCustom id="phone" label="Phone number" type="text" placeholder="Phone number" empty default={form.telephone_number} pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"/>
                            <InputCustom id="password" label="Password" type="password" placeholder="Password" empty/>
                    </Flex>
                    <Flex jc="space-evenly" ai="center" c="white" direction="column">
                        <InputCustom id="name" label="First name" type="text" placeholder="First name" empty default={form.name}/>
                        <Flex direction="row">
                            <Flex direction="column" w="100%">
                                <select id="school_level" value={form.school_level} required>
                                    <option value="" disabled selected hidden>Study level</option>
                                    <option value="L1">Licence 1</option>
                                    <option value="L2">Licence 2</option>
                                    <option value="L3">Licence 3</option>
                                    <option value="M1">Master 1</option>
                                    <option value="M2">Master 2</option>
                                    <option value="D">Doctorate</option>
                                </select>
                            </Flex>                            
                        </Flex>
                        <input id="school" type="text" placeholder="Etablishment"  value={form.school}/>
                        <input id="city" placeholder="City"  value={form.city} />
                    </Flex>
                </Flex>
                <Flex jc="center">
                    <ButtonCustom ff="Roboto" class="profile-submit" type="submit" value="submit" m="20px 0" w="30%" h="3.5em" text="Edit profile"></ButtonCustom>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Profile