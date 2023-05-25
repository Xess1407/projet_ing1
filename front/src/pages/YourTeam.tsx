import { Component, createSignal, Show} from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import "./css/YourTeam.css"

const YourTeam: Component = () => {
    const [boxData, setBoxData] = createSignal(false);

    // Fonction à faire pour faire apparaître le form de recherche pour créer son équipe
    
    return (
        <Flex direction="column" w="100%" h="150vh" m="0" p="0" ovy="hidden" bgc="#111111"> 
            <h1 class="text">
                <span>Your Team</span>
            </h1>
            <Flex w="100%" h="28%" jc="space-around" mt="1%">
                <Box w="20%" h="100%" br="10px" bgc="#555555">
                    <img class="profile-picture" src="src/img/profil.jpg" alt="OK" />
                </Box>
                <Box w="20%" h="100%" br="10px" bgc="#888888">
                    <img class="profile-picture" src="src/img/profil.jpg" alt="OK" />
                </Box>
                <Box w="20%" h="100%" br="10px" bgc="#555555">
                    <img class="profile-picture" src="src/img/profil.jpg" alt="OK" />
                </Box>
                <Box w="20%" h="100%" br="10px" bgc="#888888">
                    <img class="profile-picture" src="src/img/profil.jpg" alt="OK" />
                </Box>
            </Flex>
            <Flex w="100%" h="28%" jc="space-around" mt="5%">
                <Box w="20%" h="100%" br="10px" bgc="#888888">
                    <img class="profile-picture" src="src/img/profil.jpg" alt="OK" />
                </Box>                
                <Box w="20%" h="100%" br="10px" bgc="#555555">
                    <img class="profile-picture" src="src/img/profil.jpg" alt="OK" />
                </Box>                            
                <Box w="20%" h="100%" br="10px" bgc="#888888">
                    <img class="profile-picture" src="src/img/profil.jpg" alt="OK" />
                </Box>                
                <Box w="20%" h="100%" br="10px" bgc="#555555">
                    <img class="profile-picture" src="src/img/profil.jpg" alt="OK" />
                </Box>                                                       
            </Flex>
        </Flex>
    )
}

export default YourTeam