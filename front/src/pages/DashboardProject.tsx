import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import InputCustom from "../components/generals/InputCustom";
import ButtonCustom from "../components/generals/ButtonCustom";
import { submit_project, resourceForm, setProjectForm, setResourceForm, submit_resource, projectForm } from "../components/forms/ProjectForm";

export const [confirmed, setConfirmed] = createSignal(false)

const [searchValue, setSearchValue] = createSignal<string>("")
function searching(ele: string): boolean { return ele.toLowerCase().includes(searchValue().toLowerCase()) }

const [challenges, setChallenges] = createSignal<any>([])
const [projects, setProjects] = createSignal<any>([])
const [totalProjects, setTotalProjects] = createSignal<any>(0)
const [addProject, setAddProject] = createSignal(false)
const [removeProject, setRemoveProject] = createSignal(false)
const [addResource, setAddResource] = createSignal(false)
const [removeResource, setRemoveResource] = createSignal(false)
const [projectToRemove, setProjectToRemove] = createSignal<any>([], { equals: false })

const [resource, setResource] = createSignal<any>([])
const [resourceToRemove, setResourceToRemove] = createSignal<any>([], { equals: false })

const handle_show = (code: number) => {
    let [a,b, c, d] = [!addProject(), !removeProject(), !addResource(), !removeResource()]
    setAddProject(false)
    setRemoveProject(false)
    setAddResource(false)
    setRemoveResource(false)
    setConfirmed(false)
    switch (code){
        case 1: if (a) setAddProject(true); else setAddProject(false); break;
        case 2: if (b) setRemoveProject(true); else setRemoveProject(false); break;
        case 3: if (c) setAddResource(true); else setAddResource(false); break;
        case 4: if (d) setRemoveResource(true); else setRemoveResource(false); break;
    }
}

const getDataChallenges = async () => {
    const res_project = await fetch(`http://localhost:8080/api/challenge`, {
        method: "GET",
    });

    let status = await res_project.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get challenges! Status:" + status)
        return
    }
    let chll = await res_project.json()
    setChallenges(chll)
}

const getDataProject = async () => {
    const res_project = await fetch(`http://localhost:8080/api/project`, {
        method: "GET",
    });

    let status = await res_project.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get projects! Status:" + status)
        return
    }
    let chll = await res_project.json()
    setProjects(chll)
    setTotalProjects(projects().length)
}

const getResource = async () => {
    const res_resource = await fetch(`http://localhost:8080/api/resource-project`, {
        method: "GET",
    });

    let status = await res_resource.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get projects! Status:" + status)
        return
    }
    let chll = await res_resource.json()
    setResource(chll)
}

const addToProjectToRemove = () => {
    let project = projects().find((ch:any) => { return ch.name == searchValue()})
    if (project === undefined) {
        console.log("Non trouvé");
        /** Afficher erreur */
        return
    }

    let data = projectToRemove()
    data.push(project)
    setProjectToRemove(data)
}

const addToResourceToRemove = () => {
    let resource_s = resource().find((ch:any) => { return ch.name == searchValue()})
    if (resource_s === undefined) {
        console.log("Non trouvé");
        /** Afficher erreur */
        return
    }

    let data = resourceToRemove()
    data.push(resource_s)
    setResourceToRemove(data)
}

const handle_submit_delete_project = async (event: Event) => {
    event.preventDefault();
    projectToRemove().forEach( async (element:any) => {
        let res_delete_project = await fetch(`http://localhost:8080/api/project`, {
        method: "DELETE",
        body: JSON.stringify({id: element.id, password: "admin"}),
        headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_delete_project.status
        if (status != 200) {
            console.log("[ERROR] Couldn't delete the project! Status:" + status)
            return status
        }
        setTotalProjects(totalProjects() - 1);
    });
    setConfirmed(true)
}

const handle_submit_delete_resource = async (event: Event) => {
    event.preventDefault();
    resourceToRemove().forEach( async (element:any) => {
        let res_delete_resource = await fetch(`http://localhost:8080/api/resource-project`, {
        method: "DELETE",
        body: JSON.stringify({id: element.id, password: "admin"}),
        headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_delete_resource.status
        if (status != 200) {
            console.log("[ERROR] Couldn't delete the resource! Status:" + status)
            return status
        }
    });
    setConfirmed(true)
}

const handle_submit_project = (event: Event): void => {
    event.preventDefault();
    submit_project(projectForm)
    setTotalProjects(totalProjects() + 1);
}

const handle_submit_resource = (event: Event): void => {
    event.preventDefault();
    submit_resource(resourceForm)
}

const handle_change_challenge = (e:any) => {
    let data = {name: projectForm.name, image: "", data_challenge_id: Number(e.currentTarget.value), description: projectForm.description }
    setProjectForm(data)
}

const handle_change_project = (e:any) => {
    let data = {name: resource().name, url: resource().url, data_challenge_id: Number(e.currentTarget.value)}
    setResource(data)
}

const DashboardProject: Component = () => {
    onMount( async () => {
        await getDataChallenges()
        await getDataProject()
        await getResource()
    })

    // TODO TRAITER IMAGE UPLOAD 

    return <Flex w="80%" jc="space-evenly">

    <Flex bgc="#444444" br="10px" w="40%" h="50%" direction="row" jc="space-evenly" ai="center">
        <Box w="35%" h="50%" bgc="#222222" br="10px" c="#FFFFFF" ta="center" ff="Roboto">
            <h3>Total projects</h3>
            <p>{totalProjects()}</p>
        </Box>
        <Flex direction="column" w="60%" h="100%" jc="space-evenly" ai="center">
            <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Project" onclick={() => handle_show(1)}/>
            <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Project" onclick={() => handle_show(2)}/>
            <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Resource" onclick={() => handle_show(3)}/>
            <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Resource" onclick={() => handle_show(4)}/>
        </Flex>
    </Flex>

    <Show when={addProject()}>
        <Flex bgc="#444444" br="10px" w="50%" h="80%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto">
            <h2>Add project</h2>
            <Flex direction="column" w="90%" h="80%" jc="space-evenly" ai="center">
            <form class="form-add-project" onSubmit={ handle_submit_project }>
                <Flex direction="column" w="95%" jc="space-evenly" ai="center" h="70%" mt="5%" ff="Roboto">
                    <InputCustom w="60%" mt="1%" id="name" label="Name" type="text" placeholder="Name of project" update={setProjectForm}/>
                    <InputCustom w="60%" mt="1%" id="description" label="Description" type="text" placeholder="Description" update={setProjectForm}/>
                    <label for="profile_pic">Choose file to upload</label>
                    <input class="input-add-project" type="file" id="project_img" name="project_img" required accept=".jpg, .jpeg, .png" />
                </Flex>
                <Flex w="35%" h="20%" jc="space-evenly" ai="center" ff="Roboto">
                    <select name="data_challenge" id="data_challenge" onChange={handle_change_challenge}>
                        <For each={challenges()}>
                            {(element) => (
                                <option value={element.id}>{element.name}</option>
                            )}
                        </For>
                    </select>
                </Flex>
                
                <Flex w="95%" jc="center" ai="center" h="20%" mt="3%" direction="column">
                    <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                </Flex>
            </form>
            <Flex jc="center" ai="center" ff="Roboto" c="#FFFFFF">
                <Show when={confirmed()} >
                    <p>Project added</p>
                </Show>
            </Flex>
            </Flex>
        </Flex>
    </Show>

    <Show when={removeProject()}>
        <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto" pt="5%">
            <h2>Remove Project</h2>
            <form class="form-remove" onSubmit={ handle_submit_delete_project }>
                <Flex w="95%" jc="space-evenly" ai="center">
                    <Flex direction="column" jc="space-evenly" ai="center" w="65%">
                        <input id="search" type="text" placeholder="Name project" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>  
                        <Box w="100%" h="2em" ovy="scroll">
                            <For each={projects()}>
                                {(element: any) => (
                                    <Show when={searching(element.name)}>
                                        <li class="search-result">{element.name}</li>
                                    </Show>
                                )}
                            </For>
                        </Box>
                    </Flex>
                    <Flex w="35%" jc="space-evenly" ai="center">
                        <ButtonCustom ff="Roboto" text="Add" onclick={addToProjectToRemove}/>
                    </Flex>
                </Flex>
                <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                    <label>Project to remove</label>
                    <Box w="80%" h="30%" b="2px solid #FFFFFF" ff="Roboto" br="10px">
                        {/* Requête pour récupérer le joueur recherché */}
                        <For each={projectToRemove()}>
                            {(element:any) => (
                                <p>{element.name}</p>
                            )}
                        </For>
                    </Box>
                    <ButtonCustom class="form-submit" type="submit" value="submit" text="REMOVE" ff="Roboto black" fsz="16px" w="230px" h="60px" br="16px" bgc="#E36464" mt="4%"/>
                </Flex>
            </form>
            <Flex jc="center" ai="center" ff="Roboto" c="#FFFFFF">
                <Show when={confirmed()} >
                    <p>Project removed</p>
                </Show>
            </Flex>
        </Flex>
    </Show>

    <Show when={addResource()}>
        <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto">
            <h2>Add Resource</h2>
            <Flex direction="column" w="90%" h="80%" jc="space-evenly" ai="center">
                <form class="form-add-ressource" onSubmit={ handle_submit_resource }>
                    <Flex w="95%" jc="space-evenly" ai="center" h="20%" mt="5%">
                        <InputCustom w="45%" id="name" label="Name" type="text" update={setResourceForm}/>
                        <InputCustom w="45%" id="url" label="Url" type="text" update={setResourceForm}/>   
                    </Flex>
                    <Flex w="35%" jc="space-evenly" ai="center">
                        <select name="data_challenge" id="data_challenge" onChange={handle_change_project}>
                            <For each={projects()}>
                                {(element) => (
                                    <option value={element.id}>{element.name}</option>
                                )}
                            </For>
                        </select>
                    </Flex>
                    <Flex w="95%" jc="center" ai="center" h="20%" mt="5%">
                        <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                    </Flex>
                </form>
            </Flex>
            <Flex jc="center" ai="center" ff="Roboto" c="#FFFFFF">
                <Show when={confirmed()} >
                    <p>Resource added</p>
                </Show>
            </Flex>
        </Flex>
    </Show>

    <Show when={removeResource()}>
        <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto" pt="5%">
            <h2>Remove resource</h2>
            <form class="form-remove" onSubmit={ handle_submit_delete_resource }>
            <Flex w="95%" jc="space-evenly" ai="center">
                        <Flex direction="column" jc="space-evenly" ai="center" w="65%">
                            <input id="search" type="text" placeholder="Name challenge" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>  
                            <Box w="100%" h="2em" ovy="scroll">
                                <For each={resource()}>
                                    {(element: any) => (
                                        <Show when={searching(element.name)}>
                                            <li class="search-result">{element.name}</li>
                                        </Show>
                                    )}
                                </For>
                            </Box>
                        </Flex>
                        <Flex w="35%" jc="space-evenly" ai="center">
                            <ButtonCustom ff="Roboto" text="Add" onclick={addToResourceToRemove}/>
                        </Flex>
                    </Flex>
                    <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                        <label>Resources to remove</label>
                        <Box w="80%" h="30%" b="2px solid #FFFFFF" ff="Roboto" br="10px">
                            {/* Requête pour récupérer le joueur recherché */}
                            <For each={resourceToRemove()}>
                                {(element:any) => (
                                    <p>{element.name}</p>
                                )}
                            </For>
                        </Box>
                        <ButtonCustom class="form-submit" type="submit" value="submit" text="REMOVE" ff="Roboto black" fsz="16px" w="230px" h="60px" br="16px" bgc="#E36464" mt="4%"/>
                    </Flex>
            </form>
            <Flex jc="center" ai="center" ff="Roboto" c="#FFFFFF">
                <Show when={confirmed()} >
                    <p>Resource removed</p>
                </Show>
            </Flex>
        </Flex>
    </Show>

    
</Flex>
}

export default DashboardProject