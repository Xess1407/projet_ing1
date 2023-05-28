import { For, createSignal, onMount } from "solid-js"
import Flex from "../components/layouts/Flex"

const Rank = () => {
    const [ranks, setRanks] = createSignal<any>([])
    const [ranksByProject, setRanksByProject] = createSignal<any[][]>([])
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
        ranks().forEach((element:any) => {
            let find = ranksByProject().find((list: any[]) => { return list.at(0).data_project_id == element.data_project_id })
            if (find) {
                find.push(element)
            } else {
                ranksByProject().push([element])
            }
        });
    }

    onMount(async () => {
        await getRanks()
        sortByProject()
        console.log(ranks());
        console.log(ranksByProject());
        
    })
    
    return (
    <Flex bgc="#444444" br="10px" w="80%" h="80%" direction="column">
        <For each={ranks()}>
            {(element: string) => (
                <div>RANK</div>  
            )}
        </For>
    </Flex>)
}

export default Rank