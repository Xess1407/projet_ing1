import {createStore} from "solid-js/store";

type DropFormField = {
    data_project: string;
    file_url: string;
}
export const submit_drop = async (form: DropFormField) => {

    const res_dropped_file = await fetch(`http://localhost:8001/analyze?project=${dropForm.data_project}&file=${dropForm.file_url}`, {
        method: "GET",
    })

    let status = await res_dropped_file.status
    if(status != 200) {
        console.log("[ERROR] Couldn't register the student! Status:" + status)
        return status
    }

}


export const [dropForm, setDropForm] = createStore<DropFormField>({
    data_project: "",
    file_url: "",
});