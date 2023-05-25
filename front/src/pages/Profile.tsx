import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import { Image } from "@kobalte/core";
import "./css/Profile.css";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";

const Profile: Component = () => {
    return (/*#222222*/
        <Flex bgc="black" direction="row" w="100%" h="100vh">
            <Flex direction="column" w="50%" h="100%">
                <Flex bgc="black" w="100%" jc="center">
                    <Image.Root fallbackDelay={600} class="image">
                        <Image.Img
                            class="image__img"
                            src="./src/img/profil.jpg"
                            alt="PP"
                        />
                        <Image.Fallback class="image__fallback">MG</Image.Fallback>
                    </Image.Root>
                </Flex>
                <Flex w="100%" h="100%" jc="space-around">
                    <Box h="262px" w="309px" c="white">
                        <h3>Team</h3>
                        <Box b="2px solid white" h="100%" br="8px"></Box>
                    </Box>
                    <Box h="262px" w="309px" c="white">
                        <h3>Challenges</h3>
                        <Box b="2px solid white" h="100%" br="8px"></Box>
                    </Box>
                </Flex>
            </Flex>
            <Box w="50%" >
                <Flex direction="row" jc="space-around" h="600px">
                    <Flex c="white" mb="20%">
                        <Flex direction="column" jc="space-around">
                            <InputCustom id="family_name" label="Nom de famille" type="text" placeholder="Nom de famille"/>
                            <InputCustom id="email" label="Email" type="text" placeholder="Email"/>
                            <InputCustom id="telephone_number" label="Télephone" type="text" placeholder="Télephone" pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}.[0-9]{2}|\+33 [1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+33[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9][0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}|[1-9] [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}|\+[0-9]{15}"/>
                            <InputCustom id="password" label="Mot de passe" type="password" placeholder="Mot de passe"/>
                        </Flex>
                    </Flex>
                    <Flex c="white" mb="20%">
                        <Flex direction="column" jc="space-around">
                            <InputCustom id="name" label="Prénom" type="text" placeholder="prénom"/>
                            <InputCustom id="school_level" label="Niveau d'étude" type="text" placeholder="Niveau d'étude"/>
                            <InputCustom id="school" label="Ecole" type="text" placeholder="Ecole"/>
                            <InputCustom id="city" label="Ville" placeholder="Ville"/>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex jc="center">
                    <ButtonCustom class="profile-submit" type="submit" value="submit" m="20px 0" w="12em" text="Edit profile"></ButtonCustom>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Profile