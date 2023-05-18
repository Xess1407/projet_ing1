import { Component, For } from "solid-js";
import style_parser from "./StyleParser";

const Flex = (props: any) => {
    const children = Array.isArray(props.children)
    ? props.children
    : [props.children];

    /* Apply style */
    let s = style_parser(props) + "display: flex;"
    if (props.direction !== "undefined")
        s += "flex-direction:" + props.direction + ";"
    
    return (
        <div style={s}>
            <For each={children} fallback={<div>Loading...</div>}>
                {(item) => (
                    item
                )}
            </For>
        </div>
    );
}

export default Flex