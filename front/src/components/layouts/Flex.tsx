import { For } from "solid-js";
import style_space_parser, { style_box_parser, style_border_parser } from "../StyleParser";

const Flex = (props: any) => {
    const children = Array.isArray(props.children)
    ? props.children
    : [props.children];

    /* Apply style */
    let s = style_space_parser(props) + "display: flex;" + style_box_parser(props) + style_border_parser(props)
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