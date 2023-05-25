import { Component, createSignal, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import "./css/Team.css"
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";

const Team: Component = () => {
    const [boxData, setBoxData] = createSignal(false);

    // Fonction à faire pour faire apparaître le form de recherche pour créer son équipe
    
    return (
        <Flex direction="row" w="100%" h="calc(100vh - 140px)" m="0" p="0" ovy="hidden" bgc="#111111"> 
            <Box w="45%">
                <h1 class="text">
                    <span>Your Team</span>
                </h1>
                <Flex direction="column" ml="30%">
                    <Box ff="Roboto" fsz="18px" mb="5%" c="#FFFFFF">You don't have a team yet, create it !</Box>
                    <ButtonCustom text="CREATE YOUR TEAM" ff="Roboto black" fsz="16px" w="300px" h="60px" br="16px" bgc="#3BCFA3"/>
                </Flex>
            </Box>
            <Flex w="55%" jc="center" ai="center" m="0">
                    <Flex bgc="#555555" w="80%" h="90%" direction="column" jc="space-evenly" ai="center" br="10px">
                        <h1>CREATION</h1>
                        <Flex direction="column" jc="center" ai="center" w="100%">
                            <label>Search student</label>
                            {/* Call à la bdd pour trouver le joueur recherché */}
                            <input type="search" placeholder="Name of student"/>
                        </Flex>
                        <Flex direction="column" ai="center" w="100%" h="60%">
                            <label>Your Teammates</label>
                            <Box w="80%" h="100%" b="2px solid #FFFFFF" br="10px">
                                {/* Requête pour récupérer le joueur recherché */}
                            </Box>
                            <ButtonCustom text="CREATE" ff="Roboto black" fsz="16px" w="230px" h="70px" br="16px" bgc="#8DCEB0" mt="4%"/>
                        </Flex>
                    </Flex>
            </Flex>
        </Flex>
    )
}

export default Team