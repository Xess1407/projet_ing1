import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import "./css/Contact.css"
import { contactForm, setContactForm, submit_mail } from "../components/forms/ContactForm";

export const [contacted, setContacted] = createSignal<any>([], {equals: false})
export const [sended, setSended] = createSignal<any>(false)

const Contact: Component = () => {
    const [challenge, setChallenge] = createSignal<any>([])
    const [teams, setTeams] = createSignal<any>([])
    const [update, setUpdate] = createSignal<any>([], {equals: false})

    createEffect(() => {
        console.log(sended());
        console.log(contacted());
        setUpdate(contacted())
    })

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

    const handle_submit_mail = (event: Event): void => {
        event.preventDefault();
        submit_mail(contactForm)
    }

    function handleObjectChange(event: Event) {
        const target = event.target as HTMLInputElement;
        setContactForm({
            object: target.value,
        });
    }

    function handleContentChange(event: Event) {
        const target = event.target as HTMLInputElement;
        setContactForm({
            content: target.value,
        });
    }

    onMount(async () => {
        await getChallenge()
        await getTeams()
    })

    return (
        <Flex direction="row" jc="center" ai="center" w="80%" h="80vh" bgc="#444444" br="10px">
            <Flex jc="space-evenly" ai="center" c="white" w="80%" h="80%" direction="column" m="0" ff="Roboto"> 
                <form class="form-contact" onSubmit={handle_submit_mail}>
                    <Flex direction="column" w="100%" h="60%" jc="space-evenly" ai="center">
                        <h1>Contact</h1>
                        <input id="object" type="text" required  placeholder="Object" onChange={handleObjectChange}/>
                        <textarea id="content" required placeholder="Content" onChange={handleContentChange}/>
                    </Flex>
                    <Flex direction="column" w="100%" h="40%" jc="space-evenly" ai="center">
                        <Flex direction="row" w="80%" h="30%" jc="space-evenly" ai="center">
                            <select class="select-form" onChange={(e: any) => {setContactForm({ receiver: [e.currentTarget.value.split(",")[0], e.currentTarget.value.split(",")[1]]})}}>
                                <optgroup label="Teams">
                                    <For each={teams()}>
                                        {(team:any) => (
                                            <option value={["team", team.id]}>Team {team.id}</option>
                                        )}
                                    </For>
                                </optgroup>
                                <optgroup label="Challenge">
                                    <For each={challenge()}>
                                        {(challenge:any) => (
                                            <option value={["challenge", challenge.id]}>Challenge {challenge.name}</option>
                                        )}
                                    </For>
                                </optgroup>
                            </select>
                            <ButtonCustom w="10%" type="submit" value="Send" text="Send"/>
                        </Flex>
                    </Flex>
                </form>
            </Flex>
            <Flex>
                <Show when={sended()} >
                    <p>Email send at:</p>
                    <For each={update()}>
                        {(c:any) => (
                            <p>{c}</p>
                        )}
                     </For>
                </Show>
            </Flex>
        </Flex>
    )
}

export default Contact;