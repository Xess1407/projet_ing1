import { TextField } from "@kobalte/core"
import style_parser from "../StyleParser"
import './scss/inputCustom.css'
import {createEffect, createSignal} from "solid-js";

const InputCustom = (props: any) => {
    let s = ""+style_parser(props)
    const [value, setValue] = createSignal("");
    if (!props.empty) {
        createEffect(() => {
            props.update(props.id, value())
        })
    }
    
    // @ts-ignore
    return <TextField.Root class="input" id={props.id} style={s} value={value()} onChange={setValue} validationState={value() !== props.check ? "invalid" : "valid"}>
        <TextField.Label class="input_label" for={props.id}>{props.label}</TextField.Label>
        <TextField.Input class="input_textfield" type={props.type} id={props.id} placeholder={props.placeholder} required pattern={props.pattern}/>
        <TextField.Description>{props.description}</TextField.Description>
        <TextField.ErrorMessage />
    </TextField.Root>
}

export default InputCustom