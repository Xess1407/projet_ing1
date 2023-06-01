import { Component, For, Show, createSignal, onMount } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/MessageDashboard.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import { isConnected } from "../components/Session";
import { useNavigate } from "@solidjs/router";

const MessageDashboard: Component = () => {
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
        <Box w="80%" h="80vh" m="0" p="0" br="10px" pos="relative">
            <Flex>
                <h1 class="text">
                    <span>Welcome on your Dashboard</span>
                </h1>
            </Flex>
            <img class="background2" src="/src/img/fond.jpg" alt="" />
        </Box>
    )
}

export default MessageDashboard