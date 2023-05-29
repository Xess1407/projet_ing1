import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import InputCustom from "../components/generals/InputCustom";
import ButtonCustom from "../components/generals/ButtonCustom";
import { challengeForm, resourceForm, setChallengeForm, setResourceForm, submit_challenge } from "../components/forms/ChallengeForm";


const DashboardChallenge: Component = () => {
    const [challenges, setChallenges] = createSignal<any>([])
    const [totalChallenges, setTotalChallenges] = createSignal<any>(0)
    const [addChallenge, setAddChallenge] = createSignal(false)
    const [removeChallenge, setRemoveChallenge] = createSignal(false)
    const [challengeToRemove, setChallengeToRemove] = createSignal<any>([], { equals: false })

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

    onMount( async () => {
        await getDataChallenges()
    })

    createEffect(() => {
        console.log(challengeToRemove());
        
    })

    const handle_submit_challenge = (event: Event): void => {
        event.preventDefault();
        submit_challenge(challengeForm, resourceForm)
        setTotalChallenges(totalChallenges() + 1);
    }

    const handle_show = (code: number) => {
        let [a,b] = [!addChallenge(), !removeChallenge()]
        setAddChallenge(false)
        setRemoveChallenge(false)
        switch (code){
            case 1: if (a) setAddChallenge(true); else setAddChallenge(false); break;
            case 2: if (b) setRemoveChallenge(true); else setRemoveChallenge(false); break;
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
    }

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
                </Flex>
            </Flex>
            <Show when={addChallenge()}>
                <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto">
                    <h2>Add Challenge</h2>
                    <Flex direction="column" w="90%" h="80%" jc="space-evenly" ai="center">
                    <form onSubmit={ handle_submit_challenge }>
                        <Flex w="95%" jc="space-evenly" ai="center" h="20%" mt="5%">
                            <InputCustom w="60%" id="name" label="Name" type="text" placeholder="Name of Challenge" update={setChallengeForm}/>
                        </Flex>
                        <Flex w="95%" jc="space-evenly" ai="center" h="20%" mt="3%">
                            <InputCustom w="45%" id="date_time_start" label="Start Date" type="date"  update={setChallengeForm}/>
                            <InputCustom w="45%" id="date_time_end" label="End Date" type="date" update={setChallengeForm}/>
                        </Flex>
                        <Flex w="95%" h="20%" direction="column" jc="center" ai="center" ff="Roboto" mt="3%" color="#FFFFFF">
                            <h3>Resources</h3>
                            <Flex w="100%" jc="space-evenly" ai="center" mt="3%">
                                <InputCustom w="45%" id="name" label="Name" type="text" update={setResourceForm}/>
                                <InputCustom w="45%" id="url" label="Url" type="text" update={setResourceForm}/>   
                            </Flex>  
                        </Flex>
                        <Flex w="95%" jc="center" ai="center" h="20%" mt="3%">
                            <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                        </Flex>
                    </form>
                    </Flex>
                </Flex>
            </Show>
            <Show when={removeChallenge()}>
                <Flex bgc="#444444" br="10px" w="50%" h="75%" jc="center" ai="center" direction="column" c="#FFFFFF" ff="Roboto">
                    <h2>Remove Challenge</h2>
                    <form class="form-remove" onSubmit={ handle_submit_delete_challenge }>
                        <Flex w="95%" jc="space-evenly" ai="center">
                            <Flex direction="column" jc="space-evenly" ai="center" w="65%">
                                <input id="search" type="text" placeholder="Name challenge" onInput={() => {setSearchValue((document.getElementById("search") as HTMLInputElement).value)}}/>  
                                <Box w="100%" h="2em" ovy="scroll">
                                    <For each={challenges()}>
                                        {(element: any) => (
                                            <Show when={searching(element.name)}>
                                                <li>{element.name}</li>
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
                        </Flex>
                    </form>
                </Flex>
            </Show>
        </Flex>
    )
}   

export default DashboardChallenge