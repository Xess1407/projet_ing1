import { Component, For, createSignal, onMount } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import { Image } from "@kobalte/core";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import createDCBox from "../components/createDCBox";
import { useNavigate } from "@solidjs/router";
import "./css/DataChallenges.css"

const DataChallenges: Component = () => {
    const nav = useNavigate()
    const [challenges, setChallenges] = createSignal<any>([])
    const [resources, setResources] = createSignal<any[]>([])

    /* Get all challenges */
    const getChallenges = async () => {
        const res_project = await fetch(`http://localhost:8080/api/challenge`, {
            method: "GET",
        });

        let status = await res_project.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get challenges! Status:" + status)
            return
        }
        let clg = await res_project.json()
        setChallenges(clg)
    }

    const getResources = async () => {
        const res_resource = await fetch(`http://localhost:8080/api/resource-challenge`, {
            method: "GET",
        });

        let status = await res_resource.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get challenges! Status:" + status)
            return
        }
        let res = await res_resource.json()
        setResources(res)
    }

    onMount(async () => {
        await getChallenges()
        await getResources()
    })

    return (
        <Flex bgc="#222222" direction="column" w="100%" h="100vh">
            <Flex h="25%" w="50%" ml="10%" fsz="56px" c="#FFFFFF" ai="center">
                <h1 class="text">Data Challenges</h1>
            </Flex>
            <Flex fw="wrap" direction="row" jc="space-evenly" w="100%" h="100%">
                <For each={challenges()}>
                    {(element: any) => (
                        <div class="data-challenges" onclick={() => {nav("/data-project/" + element.id)}}>
                            <Flex h="270px" w="350px" br="10px" bgc="#3E3E3E" direction="column">
                                    <Flex c="white" h="50%" jc="center" ai="center" ff="Roboto">
                                        <h3>{element.name}</h3>
                                    </Flex>
                                    <Flex c="white" h="50%">
                                        <Flex c="white" w="50%" direction="column" ai="center" ff="Roboto">
                                            <h3>Start date</h3>
                                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center" ff="Roboto">
                                                <span>{element.date_time_start}</span>
                                            </Flex>
                                    </Flex>
                                    <Flex c="white" w="50%" direction="column" ai="center" ff="Roboto">
                                        <h3>End date</h3>
                                        <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center" ff="Roboto" >
                                            <span>{element.date_time_end}</span>
                                        </Flex>
                                    </Flex>
                                </Flex>
                                <Flex direction="column">
                                    <Flex c="white" h="50%" p="10px 0 0 0" jc="center" ai="center" ff="Roboto">
                                        <h4>Resources</h4>
                                    </Flex>
                                    <For each={resources().filter((ele) => {return ele.data_challenge_id == element.id})}>
                                        {(rse: any) => ( <Flex c="white" h="50%" jc="center" ai="center" ff="Roboto"><span>{rse.name}: {rse.url}</span></Flex>)}
                                    </For>
                                </Flex>
                            </Flex>               
                        </div>
                    )}
                </For>
            </Flex>
        </Flex>
    )
}

export default DataChallenges