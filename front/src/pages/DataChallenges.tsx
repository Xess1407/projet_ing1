import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import { Image } from "@kobalte/core";
import "./css/DataChallenges.css";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";

const dataChallenges: Component = () => {
    return (
        <Flex bgc="white" direction="column" w="100%" h="100vh">
            <Box b="1px solid black" h="100px" w="300px" ml="10%" fsz="20px">
                <h1>Data Challenges </h1>
            </Box>
            <Flex class="container" b="1px solid red" direction="row" ml="10%" mr="10%" jc="space-around">
                <Box b="1px solid black" h="270px" w="350px"></Box>
                <Box b="1px solid black" h="270px" w="350px"></Box>
                <Box b="1px solid black" h="270px" w="350px"></Box>
                <Box b="1px solid black" h="270px" w="350px"></Box>
                <Box b="1px solid black" h="270px" w="350px"></Box>
                <Box b="1px solid black" h="270px" w="350px"></Box>
                <Box b="1px solid black" h="270px" w="350px"></Box>

            </Flex>
        </Flex>
    )
}

export default dataChallenges