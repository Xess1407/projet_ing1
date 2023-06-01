import { Component, For, Show, createSignal, onMount } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Home.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import { isConnected } from "../components/Session";
import { useNavigate } from "@solidjs/router";

const Home: Component = () => {
    const nav = useNavigate()

    const [ranks, setRanks] = createSignal<any>([], {equals: false})
    const getRanks = async () => {
        const res_rank = await fetch(`http://localhost:8080/api/rank`, {
            method: "GET",
        });

        let status = await res_rank.status
        if (status != 200) {
            console.log("[ERROR] Couldn't register the student! Status:" + status)
            return
        }
        let rank_j = await res_rank.json()
        setRanks(rank_j.slice(0, 3))
    }

    onMount(async () => {
        await getRanks()
        let data = ranks().sort((a:any, b:any) => { return b.score - a.score})
        setRanks(data)
    })

    return (
        <Box w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden">
            <img src="/src/img/fond.jpg" alt="background" class="background"/>
            <Flex>
                <h1 class="text">
                    <span>Welcome to MAGGLE</span>
                </h1>
                <Flex h="20%" ml="17%" mt="5%" w="20%" jc="space-evenly" direction="column" ff="Roboto" c="#FFFFFF">
                    <h2>Top Ranking</h2>
                    <Show when={ranks().at(0) != undefined}><Box c="#FFFFFF" w="100%" mt="2%" fsz="19px" ff="Roboto"> 1st place : Team {ranks().at(0).team_id} (score : {ranks().at(0).score})</Box></Show>
                    <Show when={ranks().at(1) != undefined}><Box c="#FFFFFF" w="100%" mt="2%" fsz="19px" ff="Roboto"> 2nd place : Team {ranks().at(1).team_id} (score : {ranks().at(1).score})</Box></Show>
                    <Show when={ranks().at(2) != undefined}><Box c="#FFFFFF" w="100%" mt="2%" fsz="19px" ff="Roboto"> 3rd place : Team {ranks().at(2).team_id} (score : {ranks().at(2).score})</Box></Show>
                </Flex>
            </Flex>
            <Flex direction="row">
                <Flex direction="column" mt="2%" ml="15%">
                    <Show when={!isConnected()}>
                        <ButtonCustom text="SIGN-IN" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3" mb="10%" onclick={() => {nav("/connect", {replace: true})}}/>
                        <ButtonCustom text="SIGN-UP" ff="Roboto black" fsz="16px" w="183px" h="48px" br="16px" bgc="#3BCFA3" mb="10%" onclick={() => {nav("/register", {replace: true})}}/>
                    </Show>
                </Flex>
                <Box c="#FFFFFF" w="37%" ml="30%" mt="2%" fsz="19px" ff="Roboto">
                    Maggle is the new IA Pau association's website dedicated to Data Challenges!
                    We offer you a unique opportunity to put your Data Science skills to the test. Whether you're a curious beginner or a seasoned expert, our platform is designed to offer you an exciting and stimulating experience.
                    Take part in our Data Challenges and immerse yourself in the fascinating world of data exploration and analysis. Put your analytical skills to the test by solving complex problems in teams of 3 to 8 students.
                </Box>
            </Flex>
        </Box>
    )
}

export default Home