import { Component, createSignal, For, onMount, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import "./css/YourTeam.css"
import { useParams } from "@solidjs/router";

const YourTeam: Component = () => {
    const params = useParams();
    let team_id = params.team_id
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
        const res_member = await fetch(`http://localhost:8080/api/member/${team_id}`, {
            method: "GET",
        });

        let status = await res_member.status
        if (status != 200) {
            console.log("[ERROR] Couldn't get the members of the team! Status:" + status)
            return
        }
        let members = await res_member.json()
        /* Reset the membres */
        let m: any[] = []
        /* Get all smembres of the team selected  */
        members.forEach((element: any) => {
            m.push(element)
        });
        setMembers(m)
    }

    const getName = (id: number) => {
        let v = ""
        students().forEach((element: any) => {
            if(element.user_id == id) v = element.name
        });
        return v
    }

    onMount(async () => {
        await getStudents()
        await getMembersFromTeam(team_id)
        console.log(students());
        
    })
    
    return (
        <Flex direction="column" w="100%" h="150vh" m="0" p="0" ovy="hidden" bgc="#111111"> 
            <h1 class="text">
                <span>Your Team</span>
            </h1>
            <Flex w="100%" h="28%" jc="space-around" mt="1%">
                <For each={members()}>
                    {(element:any) => (
                        <Box w="20%" h="100%" br="10px" bgc="#555555">
                            <img class="profile-picture" src="src/img/profil.jpg" alt="PHOTO " />
                            <span>{"Nom:" + getName(element.id).toUpperCase()}</span>
                        </Box>
                    )}
                </For>
                
            </Flex>
            <Flex w="100%" h="28%" jc="space-around" mt="5%">
                                                                 
            </Flex>
        </Flex>
    )
}

export default YourTeam