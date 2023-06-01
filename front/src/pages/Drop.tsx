import {Component, createSignal, For, onMount} from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import {dropForm, setDropForm, submit_drop} from "../components/forms/DropForm";
import {form} from "../components/forms/ProfileForm";
import {getSessionUser} from "../components/Session";
import "./css/Drop.css";

const Drop: Component = () => {


    const [teams, setTeams] = createSignal<any>([])

    const [projects, setProjects] = createSignal<any>([])

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
        await get_teams()
        await getDataProject()
    })

    function handleProjectChange(event: Event) {
        const target = event.target as HTMLInputElement;
        setDropForm((prevForm) => ({
            ...prevForm,
            data_project_id: parseInt(target.value),
        }));
    }
    const handle_submit_drop = async (event: Event): Promise<void> => {
        event.preventDefault();
        await submit_drop(dropForm)
    }

    return (
        <Flex w="80%" jc="space-evenly">
            <Flex bgc="#444444" p="20px 0" br="10px" w="40%" h="50%" direction="row" jc="space-evenly" ai="center">
                <form onSubmit={handle_submit_drop}>
                    <Flex direction="column" jc="space-around" w="100%" h="70%">
                        <p id="title-drop">Drop your project</p>
                        <Flex direction="column" w="100%" jc="space-evenly" ai="center">
                            <Flex direction="column" mt="2%" w="100%">
                                <Flex direction="row" jc="space-evenly" ai="center" mb="25px">
                                    <Flex direction="column" w="100%">
                                        <select id="data_project" required onchange={handleProjectChange}>
                                            <option value="" disabled selected hidden>Data project</option>
                                            <For each={projects()}>
                                                {(element:any) => (
                                                    <option value={element.id}>{element.name}</option>
                                                )}
                                            </For>
                                        </select>
                                    </Flex>
                                </Flex>
                                <input class="input-add-file" type="file" id="python_file" name="python_file" required accept=".py" />
                            </Flex>
                            <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="DROP" />
                        </Flex>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}

export default Drop