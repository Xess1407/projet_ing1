import {createStore} from "solid-js/store";

type DropFormField = {
    file_url: string;
}
export const submit_drop = async (form: DropFormField) => {

    const res_droped_file = await fetch(`http://localhost:8001/analyze?file=${dropForm.file_url}`, {
        method: "GET",
    })

    let status = await res_droped_file.status
    if(status != 200) {
        console.log("[ERROR] Couldn't register the student! Status:" + status)
        return status
    }

}


export const [dropForm, setDropForm] = createStore<DropFormField>({
   file_url: "",
});