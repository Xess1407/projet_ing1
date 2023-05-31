import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import InputCustom from "../components/generals/InputCustom";
import ButtonCustom from "../components/generals/ButtonCustom";
import "./css/Contact.css"
import { challengeForm, resourceForm, setChallengeForm, setResourceForm, submit_challenge, submit_resource } from "../components/forms/ChallengeForm";
import { SelectContent } from "@kobalte/core/dist/types/select/select-content";
import { useParams } from "@solidjs/router";


const Contact: Component = () => {
    const [challenge, setChallenge] = createSignal<any>([])
    const [teams, setTeams] = createSignal<any>([])

    const getChallenge = async () => {
        // Fetch project
        const res_project = await fetch(`http://localhost:8080/api/challenge`, {
            method: "GET"
        });

        let status = await res_project.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the student! Status:" + status)
            return
        }
        let res = await res_project.json()
        setChallenge(res)
    }

    const getTeams = async () => {
        const res_teams = await fetch(`http://localhost:8080/api/team`, {
            method: "GET",
        });

        let status = await res_teams.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the members of the team! Status:" + status)
            return
        }
        let teams = await res_teams.json()
        /* Reset the membres */
        let t: any[] = []
        /* Get all smembres of the team selected  */
        teams.forEach((element: any) => {
            t.push(element)
        });
        setTeams(t)
    }

    onMount(async () => {
        await getChallenge()
        await getTeams()
    })

    return (
        <Flex direction="row" jc="center" ai="center" w="70%" h="700px">
            <Flex jc="space-evenly" ai="center" c="white" w="80%" h="80%" direction="column" m="0" ff="Roboto"> 
                <form class="form-contact">
                    <Flex direction="column" w="100%" h="60%" jc="space-evenly" ai="center">
                        <h1>Contact</h1>
                        <input id="object" type="text" placeholder="Object"/>
                        <textarea id="content" placeholder="Content"/>
                    </Flex>
                    <Flex direction="column" w="100%" h="40%" jc="space-evenly" ai="center">
                        <Flex direction="row" w="80%" h="30%" jc="space-evenly" ai="center">
                            <select class="select-form">
                                <optgroup label="Teams">
                                    <For each={teams()}>
                                        {(team:any) => (
                                            <option value={team.id}>Team {team.id}</option>
                                        )}
                                    </For>
                                </optgroup>
                                <optgroup label="Challenge">
                                    <For each={challenge()}>
                                        {(challenge:any) => (
                                            <option value={challenge}>Challenge {challenge.name}</option>
                                        )}
                                    </For>
                                </optgroup>
                            </select>
                            <ButtonCustom w="10%" type="submit" value="Send" text="Send"/>
                        </Flex>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}

export default Contact;
