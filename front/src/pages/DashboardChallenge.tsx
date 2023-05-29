import { Component, createEffect, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Dashboard.css"
import InputCustom from "../components/generals/InputCustom";
import ButtonCustom from "../components/generals/ButtonCustom";
import { challengeForm, setChallengeForm, submit_challenge } from "../components/forms/ChallengeForm";


const DashboardChallenge: Component = () => {
    const [challenges, setChallenges] = createSignal<any>([])
    const [totalChallenges, setTotalChallenges] = createSignal<any>(0)

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

    onMount( async () => {
        await getDataChallenges()
        setTotalChallenges(challenges().length)
    })

    const handle_submit_challenge = (event: Event): void => {
        event.preventDefault();
        submit_challenge(challengeForm)
    }

    return (
        <Flex w="80%" jc="space-evenly">
            <Flex bgc="#444444" br="10px" w="40%" h="80%" direction="column">
                <Flex w="100%" h="50%" direction="">
                    <Flex directon="column" w="50%" jc="space-evenly" ai="center">
                        <Box w="60%" h="60%" bgc="#222222" br="10px" c="#FFFFFF" ta="center">
                            <h3>Total challenges</h3>
                            <p>{totalChallenges()}</p>
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
            <Flex bgc="#444444" br="10px" w="50%" h="60%" jc="center" ai="center">
                <h2>Add Challenge</h2>
                <form onSubmit={ handle_submit_challenge }>
                    <Flex direction="row" jc="space-around" w="100%" h="70%">
                        <InputCustom id="name" label="Name" type="text" placeholder="Name of Challenge" update={setChallengeForm}/>
                    </Flex>
                    <Flex>
                        <InputCustom id="date_time_start" label="Start Date" type="date"  update={setChallengeForm}/>
                        <InputCustom id="date_time_end" label="End Date" type="date" update={setChallengeForm}/>
                    </Flex>
                    <Flex>
                        <h3>Resources</h3>
                    </Flex>
                    <Flex jc="center" ai="center">
                        <ButtonCustom class="form-submit" type="submit" value="submit" m="10px 0" h="65px" w="250px" ff="Roboto black" text="ADD" />
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}   

export default DashboardChallenge