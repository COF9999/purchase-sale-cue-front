import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"
import axios from "axios"
import "../css/myPublication.css"


function CardMyPublication({id,nameProduct,descriptionProduct,priceProduct,conditionProduct,imgPublication,statusPublication}){

    const downPublication = () =>{
        console.log("RECORDAR HACER");
    }

    const colorBox = useRef()
    const messageStatus = useRef()

    if(statusPublication===1){
        colorBox.current = "green-publication"
        messageStatus.current = "ACTIVA"
    }

    if(statusPublication===3){
        colorBox.current = "blue-publication"
        messageStatus.current = "VENDIDA"
    }

    return (
          <div className="box-card-myPublications">
             <div>
                <div className={`status-my-publication ${colorBox.current}`}>
                    {messageStatus.current}
                </div>
                <div className="box-inner">
                    <h2>{nameProduct}</h2>
                </div>
                <div className="box-inner img">
                    <img src={`http://localhost:8080/images/${imgPublication}`} alt="book-loaded" />
                </div>
                <div className="box-inner">
                <p>Estado {conditionProduct}</p>
                </div>
                <div className="box-inner">
                    <p>{descriptionProduct}</p>
                </div>
                <div className="box-inner">
                    <p>Precio {priceProduct}</p>
                </div>
                <div className="box-inner">
                    <div className="box-offerter">
                        <button onClick={downPublication}>Bajar publicación</button>
                    </div>
                    <div className="box-offerter">
                         <Link to={`/my-publications/detail/${id}`}>Ver detalles</Link>
                    </div>
                </div>
            </div>
        </div>
        )
}

export function MyPublications(){
    const [publications,SetPublications] = useState([])

    useEffect(()=>{
        const fetchProducts = async () =>{
                const token = ()=> localStorage.getItem('token')!=null?localStorage.getItem('token'):""

                const body ={
                    "token":token()
                }

                try{
                    const response = await axios.post("http://localhost:8080/publication/publicationsUser",body)
                    if(response.status === 200){
                        SetPublications(response.data)
                    }else{
                        console.log("BAD RETURN OFF SERVER");
                    }
                }catch(e){
                    console.log("Internal Server Error");
                }
        }
        fetchProducts()
    },[])
    return(
        <>
           <div className="container-primary-myPublications">
            <div className="container-principal-list-myPublications">
                <div>
                  
                </div>
                <div className="container-list-myPublications">
                   {
                    publications.map((item,index) => {
                        return (
                            <CardMyPublication
                             key={index}
                             id={item.id}
                             nameProduct={item.productResponse.name}
                             descriptionProduct={item.productResponse.description}
                             priceProduct={item.productResponse.price}
                             conditionProduct={item.productResponse.condition}
                             imgPublication={item.productResponse.img}
                             statusPublication={item.status}
                            >
                            </CardMyPublication>
                            )
                    })
                   }
                </div>
            </div>
            
            </div>
        </>
    )
}