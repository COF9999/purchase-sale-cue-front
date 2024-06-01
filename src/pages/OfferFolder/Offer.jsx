import React, { useEffect, useRef, useState } from "react";
import axios from "axios"
import "../css/offer.css"



function CardMyOffer({id,nameProductRequired,productExchanged,priceOffer,imgProductRequired,statusOffer}){

    const colorBox = useRef()
    const messageStatus = useRef()

    if(statusOffer===0){
        colorBox.current = "red-offer"
        messageStatus.current = "RECHAZADO"
    }

    if(statusOffer===1){
        colorBox.current = "green-offer"
        messageStatus.current = "ACTIVA"
    }

    if(statusOffer===3){
        colorBox.current = "blue-offer"
        messageStatus.current = "INTERCAMBIADO"
    }
    
    return (
          <div className="box-card-offer">
             <div>
                <div className={`status-my-offer ${colorBox.current}`}>
                    {messageStatus.current}
                </div>
                <div className="box-inner">
                    <h2>{nameProductRequired}</h2>
                </div>
                <div className="box-inner img">
                    <img src={`http://localhost:8080/images/${imgProductRequired}`} alt="book-loaded" />
                </div>
                <div className="box-inner">
                    {
                        statusOffer===1
                        ?<p>{`Esperando el producto ${productExchanged}`}</p>
                        :""
                    }
                    {
                        productExchanged!=null && statusOffer===3
                        ?<p>{`cambiado por ${productExchanged}`}</p>
                        :""
                    }
                    
                </div>
                <div className="box-inner">
                    <p>{`Valor Oferta  ${priceOffer==null?"no especificado en la compra":priceOffer}`}</p>
                </div>
            </div>
        </div>
        )
}


export function Offer(){

    const [myOffer,setMyOffer] = useState([])

    useEffect(()=>{
        const fetchProducts = async () =>{
                const token = ()=> localStorage.getItem('token')!=null?localStorage.getItem('token'):""

                const body ={
                    "token": token()
                }

                try{
                    const response = await axios.post("http://localhost:8080/offer/my-offers",body)
                    if(response.status === 200){
                        setMyOffer(response.data)
                        console.log(response.data);
                    }else{
                        console.log("BAD RETURN OFF SERVER");
                    }
                }catch(e){
                    console.log(e);
                    console.log("Internal Server Error");
                }
        }
        fetchProducts()
    },[])

    return(
        <div className="container-primary-offer">
            <div className="container-principal-list-offer">
                <div className="container-list-offer">
                    {
                        myOffer.map((item,index)=>{
                        return <CardMyOffer
                                key={index}
                                nameProductRequired={item.publicationData.productResponse.name}
                                imgProductRequired={item.publicationData.productResponse.img}
                                productExchanged={item.productOffertedResponse!=null ?item.productOffertedResponse.name:null}
                                priceOffer={item.offerValue}
                                statusOffer={item.state}
                            >
                            </CardMyOffer>
                        })
                    }
                </div>
            </div>
        </div>
        
    )
}