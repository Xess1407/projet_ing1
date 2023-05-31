import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import InputCustom from "../components/generals/InputCustom";
import ButtonCustom from "../components/generals/ButtonCustom";
import { challengeForm, resourceForm, setChallengeForm, setResourceForm, submit_challenge, submit_resource } from "../components/forms/ChallengeForm";

export const [confirmed, setConfirmed] = createSignal(false)

const [challenges, setChallenges] = createSignal<any>([])
const [totalChallenges, setTotalChallenges] = createSignal<any>(0)
const [addChallenge, setAddChallenge] = createSignal(false)
const [removeChallenge, setRemoveChallenge] = createSignal(false)
const [addResource, setAddResource] = createSignal(false)
const [removeResource, setRemoveResource] = createSignal(false)
const [challengeToRemove, setChallengeToRemove] = createSignal<any>([], { equals: false })

const [resource, setResource] = createSignal<any>([])
const [resourceToRemove, setResourceToRemove] = createSignal<any>([], { equals: false })

const [searchValue, setSearchValue] = createSignal<string>("")
function searching(ele: string): boolean { return ele.toLowerCase().includes(searchValue().toLowerCase()) }

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
    setTotalChallenges(challenges().length)
}

const getResource = async () => {
    const res_resource = await fetch(`http://localhost:8080/api/resource-challenge`, {
        method: "GET",
    });

    let status = await res_resource.status
    if (status != 200) {
        console.log("[ERROR] Couldn't get challenges! Status:" + status)
        return
    }
    let chll = await res_resource.json()
    setResource(chll)
}

const addToChallengeToRemove = () => {
    let challenge = challenges().find((ch:any) => { return ch.name == searchValue()})
    if (challenge === undefined) {
        console.log("Non trouvé");
        /** Afficher erreur */
        return
    }

    let data = challengeToRemove()
    data.push(challenge)
    setChallengeToRemove(data)
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

const handle_show = (code: number) => {
    let [a,b, c, d] = [!addChallenge(), !removeChallenge(), !addResource(), !removeResource()]
    setAddChallenge(false)
    setRemoveChallenge(false)
    setAddResource(false)
    setRemoveResource(false)
    setConfirmed(false)
    switch (code){
        case 1: if (a) setAddChallenge(true); else setAddChallenge(false); break;
        case 2: if (b) setRemoveChallenge(true); else setRemoveChallenge(false); break;
        case 3: if (c) setAddResource(true); else setAddResource(false); break;
        case 4: if (d) setRemoveResource(true); else setRemoveResource(false); break;
    }
}

const handle_submit_delete_challenge = async (event: Event) => {
    event.preventDefault();
    challengeToRemove().forEach( async (element:any) => {
        let res_delete_challenge = await fetch(`http://localhost:8080/api/challenge`, {
        method: "DELETE",
        body: JSON.stringify({id: element.id, password: "admin"}),
        headers: {"Content-type": "application/json; charset=UTF-8"} 
        });

        let status = await res_delete_challenge.status
        if (status != 200) {
            console.log("[ERROR] Couldn't delete the student! Status:" + status)
            return status
        }
        setTotalChallenges(totalChallenges() - 1);
    });
    setConfirmed(true)
}

const handle_submit_delete_resource = async (event: Event) => {
    event.preventDefault();
    resourceToRemove().forEach( async (element:any) => {
        let res_delete_resource = await fetch(`http://localhost:8080/api/resource-challenge`, {
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

const handle_submit_challenge = (event: Event): void => {
    event.preventDefault();
    submit_challenge(challengeForm)
    setTotalChallenges(totalChallenges() + 1);
}

const handle_submit_resource = (event: Event): void => {
    event.preventDefault();
    submit_resource(resourceForm)
}

const handle_change_challenge = (e:any) => {
    let data = {name: resource().name, url: resource().url, data_challenge_id: Number(e.currentTarget.value)}
    setResource(data)
}

const DashboardChallenge: Component = () => {
    onMount( async () => {
        await getDataChallenges()
        await getResource()
    })

    return (
        <Flex w="80%" jc="space-evenly">
            <Flex bgc="#444444" br="10px" w="40%" h="50%" direction="row" jc="space-evenly" ai="center">
                <Box w="35%" h="50%" bgc="#222222" br="10px" c="#FFFFFF" ta="center" ff="Roboto">
                    <h3>Total challenges</h3>
                    <p>{totalChallenges()}</p>
                </Box>
                <Flex direction="column" w="60%" h="100%" jc="space-evenly" ai="center">
                    <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Challenge" onclick={() => handle_show(1)}/>
                    <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Challenge" onclick={() => handle_show(2)}/>
                    <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #00FFF5" c="#00FFF5" text="Add Resource" onclick={() => handle_show(3)}/>
                    <ButtonCustom w="80%" ff="Roboto" bgc="#444444" b="2px solid #E36464" c="#E36464" text="Remove Resource" onclick={() => handle_show(4)}/>
                </Flex>
            </Flex>

            <Show when={addChallenge()}>
                <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto">
                    <h2>Add Challenge</h2>
                    <Flex direction="column" w="90%" h="80%" jc="space-evenly" ai="center">
                    <form class="form-add-project" onSubmit={ handle_submit_challenge }>
                        <Flex w="95%" jc="space-evenly" ai="center" h="20%" mt="5%">
                            <InputCustom w="60%" id="name" label="Name" type="text" placeholder="Name of Challenge" update={setChallengeForm}/>
                        </Flex>
                        <Flex w="95%" jc="space-evenly" ai="center" h="20%" mt="3%">
                            <InputCustom w="45%" id="date_time_start" label="Start Date" type="date"  update={setChallengeForm}/>
                            <InputCustom w="45%" id="date_time_end" label="End Date" type="date" update={setChallengeForm}/>
                        </Flex>
                        <Flex w="95%" jc="center" ai="center" h="20%" mt="3%">
                            <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                            <Flex>
                            <Show when={confirmed()} >
                                <p>Challenge added</p>
                            </Show>
                        </Flex>
                        </Flex>
                    </form>
                    </Flex>
                </Flex>
            </Show>


            <Show when={removeChallenge()}>
                <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto" pt="5%">
                    <h2>Remove Challenge</h2>
                    <form class="form-remove" onSubmit={ handle_submit_delete_challenge }>
                        <Flex w="95%" jc="space-evenly" ai="center">
                            <Flex direction="column" jc="space-evenly" ai="center" w="65%">
                                <input id="search" type="text" placeholder="Name challenge" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>  
                                <Box w="100%" h="2em" ovy="scroll">
                                    <For each={challenges()}>
                                        {(element: any) => (
                                            <Show when={searching(element.name)}>
                                                <li class="search-result">{element.name}</li>
                                            </Show>
                                        )}
                                    </For>
                                </Box>
                            </Flex>
                            <Flex w="35%" jc="space-evenly" ai="center">
                                <ButtonCustom text="Add" onclick={addToChallengeToRemove}/>
                            </Flex>
                        </Flex>
                        <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                            <label>Challenge to remove</label>
                            <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
                                {/* Requête pour récupérer le joueur recherché */}
                                <For each={challengeToRemove()}>
                                    {(element:any) => (
                                        <p>{element.name}</p>
                                    )}
                                </For>
                            </Box>
                            <ButtonCustom class="form-submit" type="submit" value="submit" text="REMOVE" ff="Roboto black" fsz="16px" w="230px" h="60px" br="16px" bgc="#E36464" mt="4%"/>
                            <Show when={confirmed()} >
                                <p>Challenge removed</p>
                            </Show>
                        </Flex>
                    </form>
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
                            <select name="data_challenge" id="data_challenge" onChange={handle_change_challenge}>
                                <For each={challenges()}>
                                    {(element) => (
                                        <option value={element.id}>{element.name}</option>
                                    )}
                                </For>
                            </select>
                        </Flex>
                        <Flex w="95%" jc="center" ai="center" h="20%" mt="3%">
                            <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                            <Show when={confirmed()} >
                                <p>Resource added</p>
                            </Show>
                        </Flex>
                    </form>
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
                                    <ButtonCustom text="Add" onclick={addToResourceToRemove}/>
                                </Flex>
                            </Flex>
                            <Flex direction="column" ai="center" w="80%" h="60%" ff="Roboto" mt="5%">
                                <label>Resources to remove</label>
                                <Box w="80%" h="30%" b="2px solid #FFFFFF" br="10px">
                                    {/* Requête pour récupérer le joueur recherché */}
                                    <For each={resourceToRemove()}>
                                        {(element:any) => (
                                            <p>{element.name}</p>
                                        )}
                                    </For>
                                </Box>
                                <ButtonCustom class="form-submit" type="submit" value="submit" text="REMOVE" ff="Roboto black" fsz="16px" w="230px" h="60px" br="16px" bgc="#E36464" mt="4%"/>
                                <Show when={confirmed()} >
                                    <p>Resource removed</p>
                                </Show>
                            </Flex>
                    </form>
                </Flex>
            </Show>

        </Flex>
    )
}   

export default DashboardChallenge