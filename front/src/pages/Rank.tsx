import { For, createEffect, createSignal, onMount } from "solid-js"
import Flex from "../components/layouts/Flex"
import "./css/Rank.css"

const Rank = () => {
    const [ranks, setRanks] = createSignal<any>([])
    const [ranksByProjectTmp, setRanksByProjectTmp] = createSignal<any>([])
    const [ranksByProject, setRanksByProject] = createSignal<any>([])
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
        setRanks(rank_j)
    }

    const sortByProject = () => {
        let data: any = ranksByProjectTmp()
        ranks().forEach((element:any) => {
            let find = data.find((list: any[]) => { return list.at(0).data_project_id == element.data_project_id })
            if (find) {
                data.find((list: any[]) => { return list.at(0).data_project_id == element.data_project_id }).push(element)
            } else {
                data.push([element])
            }
        });

        data.forEach((element:any[]) => {
            element.sort((a, b) => { return b.score - a.score})
        });
        setRanksByProjectTmp(data)
        setRanksByProject(ranksByProjectTmp())
    }

    onMount(async () => {
        await getRanks()
        sortByProject()
    })
    
    return (
        <Flex bgc="#444444" br="10px" w="80%" h="80vh" direction="column" jc="space-evenly" ai="center" ovy="scroll" c="#FFFFFF" ff="Roboto">
            <For each={ranksByProject()}>
                {(list_ranks:any) => (
                    <Flex direction="row" w="95%" h="40%" ovy="scroll" c="#FFFFFF" ff="Roboto" bgc="#555555" br="10px">
                        <h2 class="data-project-name"> Data project : {list_ranks.at(0).data_project_id} </h2>
                        <Flex direction="column" c="#FFFFFF" ff="Roboto" w="60%" ml="5%">
                            <For each={list_ranks}>
                                {(rank: any) => (
                                    <div class="team-project">
                                        <h4 class="team-name">Team nom : {rank.team_id}</h4>
                                        <span class="score-team">Score : {rank.score}</span>
                                    </div>  
                                )}
                            </For>
                        </Flex>
                    </Flex>
                )}
            </For>
        </Flex>)
}

export default Rank