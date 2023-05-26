import { Component } from "solid-js";
import Box from "../components/layouts/Box";
import Flex from "../components/layouts/Flex";
import { Image } from "@kobalte/core";
import ButtonCustom from "../components/generals/ButtonCustom";
import InputCustom from "../components/generals/InputCustom";
import createDCBox from "../components/createDCBox";

const DataChallenges: Component = () => {
    return (
        <Flex bgc="#222222" direction="column" w="100%" h="120vh">
            <Box b="1px solid black" h="100px" w="300px" ml="10%" fsz="20px" jc="center" ff="Roboto">
                <h1>Data Challenges </h1>
            </Box>
            <Flex fw="wrap" b="1px solid red" direction="row" ml="10%" mr="10%" h="800px" jc="space-around">
                <Flex h="270px" w="350px" br="10px" bgc="#3E3E3EFF" mt="15px" direction="column">
                    <Flex c="white" h="50%" jc="center" ai="center">
                        <h3>Name of Challenge</h3>
                    </Flex>
                    <Flex c="white" h="50%">
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>start Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>12 May 2023</div>
                            </Flex>
                        </Flex>
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>End Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>11 june 2023</div>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex h="270px" w="350px" br="10px" bgc="#A0A0A0FF" mt="15px" direction="column">
                    <Flex c="white" h="50%" jc="center" ai="center">
                        <h3>Name of Challenge</h3>
                    </Flex>
                    <Flex c="white" h="50%">
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>start Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>12 May 2023</div>
                            </Flex>
                        </Flex>
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>End Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>11 june 2023</div>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex h="270px" w="350px" br="10px" bgc="#3E3E3EFF" mt="15px" direction="column">
                    <Flex c="white" h="50%" jc="center" ai="center">
                        <h3>Name of Challenge</h3>
                    </Flex>
                    <Flex c="white" h="50%">
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>start Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>12 May 2023</div>
                            </Flex>
                        </Flex>
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>End Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>11 june 2023</div>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex h="270px" w="350px" br="10px" bgc="#A0A0A0FF" mt="15px" direction="column">
                    <Flex c="white" h="50%" jc="center" ai="center">
                        <h3>Name of Challenge</h3>
                    </Flex>
                    <Flex c="white" h="50%">
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>start Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>12 May 2023</div>
                            </Flex>
                        </Flex>
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>End Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>11 june 2023</div>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex h="270px" w="350px" br="10px" bgc="#A0A0A0FF" mt="15px" direction="column">
                    <Flex c="white" h="50%" jc="center" ai="center">
                        <h3>Name of Challenge</h3>
                    </Flex>
                    <Flex c="white" h="50%">
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>start Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>12 May 2023</div>
                            </Flex>
                        </Flex>
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>End Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>11 june 2023</div>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex h="270px" w="350px" br="10px" bgc="#3E3E3EFF" mt="15px" direction="column">
                    <Flex c="white" h="50%" jc="center" ai="center">
                        <h3>Name of Challenge</h3>
                    </Flex>
                    <Flex c="white" h="50%">
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>start Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>12 May 2023</div>
                            </Flex>
                        </Flex>
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>End Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>11 june 2023</div>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex h="270px" w="350px" br="10px" bgc="#A0A0A0FF" mt="15px" direction="column">
                    <Flex c="white" h="50%" jc="center" ai="center">
                        <h3>Name of Challenge</h3>
                    </Flex>
                    <Flex c="white" h="50%">
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>start Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>12 May 2023</div>
                            </Flex>
                        </Flex>
                        <Flex c="white" w="50%" direction="column" ai="center" >
                            <h3>End Date</h3>
                            <Flex bgc="#111111FF" h="40%" w="70%" br="8px" ai="center" jc="center">
                                <div>11 june 2023</div>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

            </Flex>
        </Flex>
    )
}

export default DataChallenges