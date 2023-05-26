import Box from "../components/layouts/Box";

function createDCBox(n: number){
    const list=[]
    for (let i = 0; i < n; i++){
        list.push("<Box b=\"1px solid black\" h=\"270px\" w=\"350px\"></Box>")
    }

        return(<>
                {list.map(box => (
                    {box}
                ))}
            </>
        )

}

export default createDCBox