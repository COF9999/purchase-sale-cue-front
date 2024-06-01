import { useEffect, useState } from "react"
import axios from "axios"
import "../css/denunciation.css"

function Denunciations({userDenunciator,message}){
    return(
        <div className="card-denunciations">
            <h3>{userDenunciator}</h3>
            <h4>Denuncia</h4>
            <p>
                {message}
            </p>
        </div>
    )
}

function ImgNameProfile({namePerson}){
    return(
        <div className="div-image-my-profile">
                    <div>
                        <img src="https://cdn-icons-png.flaticon.com/512/6378/6378141.png" alt="" />
                    </div>
                    <div>
                        <h2>{namePerson}</h2>
                    </div>
        </div>
    )
}

export function Profile(){

    const [dataProfile,setDataProfile] = useState(null)
    const [denunciations,setDenunciations] = useState([])

    useEffect(()=>{
        const fetchContentInfoProfile = async () =>{
                // const token = ()=> localStorage.getItem('token')!=null?localStorage.getItem('token'):""

                // const body ={
                //     "token":token()
                // }

                // try{
                //     const response = await axios.post("http://localhost:8080/product/select",body)
                //     if(response.status === 200){
                //         setDataProfile(response.data)
                //         console.log(response.data);
                //     }else{
                //         console.log("BAD RETURN OFF SERVER");
                //     }
                // }catch(e){
                //     console.log("Internal Server Error");
                // }


        }

        
        const fetchContentDenunciations = async () =>{
            const token = ()=> localStorage.getItem('token')!=null?localStorage.getItem('token'):""

            const body ={
                "tokenDto":{
                    "token":token()
                }
            }

            try{
                const response = await axios.post("http://localhost:8080/denuciations/find-denunciats",body)
                if(response.status === 200){
                    setDenunciations(response.data)
                    console.log(response.data);
                }else{
                    console.log("BAD RETURN OFF SERVER");
                }
            }catch(e){
                console.log(e);
                console.log("Internal Server Error");
            }
        }

        


        


        fetchContentInfoProfile()
        fetchContentDenunciations()

    },[])

    return(
        <div className="container-principal-my-profile">

                <ImgNameProfile></ImgNameProfile>
                <div className="div-points">
                    <h1>Puntos</h1>
                    <h2>10000</h2>
                </div>
                <div className="div-denunciations">
                <h2>Denuncias</h2>
                {
                  denunciations.map((item,index)=>{
                   return  <Denunciations
                   key={index}
                   userDenunciator={item.userDenunciator.name}
                   message={item.message}
                   >
                   </Denunciations>
                  })
                }
                </div>
               
        </div>
    )
}