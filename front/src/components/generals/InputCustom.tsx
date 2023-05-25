import { TextField } from "@kobalte/core"
import style_parser from "../StyleParser"
import './scss/inputCustom.css'
import {createEffect, createSignal} from "solid-js";

/* WARNING an input without an update func must be declare with empty */
const InputCustom = (props: any) => {
    let s = ""+style_parser(props)

    /* Default value */
    let v = ""
    if (props.default !== "undefined")
        v = props.default
    const [value, setValue] = createSignal(v);

    /* Update the attribut id of the form given */
    if (!props.empty) {
        createEffect(() => {
            props.update(props.id, value())
        })
    }
    
    // @ts-ignore
    return <TextField.Root class="input" id={props.id} style={s} value={value()} onChange={setValue} validationState={value() !== props.check ? "invalid" : "valid"}>
        <TextField.Input class="input_textfield" type={props.type} id={props.id} placeholder={props.placeholder} required pattern={props.pattern}/>
        <TextField.Label class="input_label" for={props.id}>{props.label}</TextField.Label>
        <TextField.Description>{props.description}</TextField.Description>
        <TextField.ErrorMessage />
    </TextField.Root>
}

export default InputCustom