import { Component, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import "./css/YourTeam.css"
import { useParams } from "@solidjs/router";

const DataProjectTeams: Component = () => {
    const params = useParams();
    let data_project_id = params.data_project_id
    const [teams, setTeams] = createSignal<any>([])
    const [membersTmp, setMembersTmp] = createSignal<any>([])
    const [members, setMembers] = createSignal<any>([])
    const [students, setStudent] = createSignal<any>([])

    const getStudents = async () => {
        // Fetch the Student
        const res_students = await fetch(`http://localhost:8080/api/student/full`, {
          method: "GET"
        });
      
        let status = await res_students.status
        if (status != 200) {
          console.log("[ERROR] Couldn't register the student! Status:" + status)
          return
        }
        let res = await res_students.json()
        
        res.forEach((element: any) => {
            let s_all:any[] = students()
            s_all.push({name: element.name, user_id: element.user_id})
            setStudent(s_all)
        });
    }

    /* Get all members from a team_id */
    const getMembersFromTeam = async (team_id: any) => {
        const res_member = await fetch(`http://localhost:8080/api/member/team/${team_id}`, {
            method: "GET",
        });

        let status = await res_member.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the members of the team! Status:" + status)
            return
        }
        let r_members = await res_member.json()
        /* Reset the membres */
        let m: any[] = membersTmp()
        /* Get all smembres of the team selected  */
        r_members.forEach((element: any) => {
            m.push(element)
        });

        /* Log the stuff it shouldn't work and yet... It's magic, it's javascript */
        setMembersTmp(m)
        setMembers(membersTmp())
    }

    const getName = (user_id: number) => {
        let v = ""
        students().forEach((element: any) => {
            if(element.user_id == user_id) v = element.name
        });
        return v
    }

    const getTeams = async () => {
        const res_teams = await fetch(`http://localhost:8080/api/team/data_project/${data_project_id}`, {
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
        await getStudents()
        await getTeams()
        teams().forEach( async (element:any) => {
            await getMembersFromTeam(element.id)
        });
    })
    
    return (
        <Flex direction="column" w="100%" h="150vh" m="0" p="0" ovy="hidden" bgc="#111111"> 
            <h1 class="text">
                <span>Data Project Team</span>
            </h1>

            <Flex w="100%" h="40%" jc="space-around" mt="1%">
                <For each={teams()}>
                    {(team:any) => (
                        <Box w="20%" h="100%" br="10px" bgc="#555555">
                            <h3>Team {team.id}</h3>
                            <h4>Members</h4>
                            <Box>
                            <For each={members().filter((ele:any) => {return ele.team_id == team.id})}>
                                {(member:any) => (
                                    <span>{member.user_id}</span>
                                )}
                            </For>
                            </Box>
                        </Box>
                    )}
                </For>
            </Flex>
            <Flex w="100%" h="28%" jc="space-around" mt="5%">
                                                                 
            </Flex>
        </Flex>
    )
}

export default DataProjectTeams