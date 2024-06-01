import { useParams } from "react-router-dom"
import { useState,useEffect,useRef } from "react"
import "../css/myPublicationDetail.css"
import axios from "axios"
import imgBook from "../../images/img-book.jpeg"

function ImgDetail({name,price,condition,imgMyDetailMyPublication}){
    return(
        <>
            <div className="content-render-img-myPublication">
                <div className="box-image-myPublication">
                    <div className="box-name-product-myPublication">
                
                    </div>
                     <img src={`http://localhost:8080/images/${imgMyDetailMyPublication}`} alt="#" />
                </div>
                <div className="box-description-publication">
                    <div>
                        <p>{name}</p>
                    </div>
                    <div>
                        <p>{`Precio: ${price}`}</p>
                    </div>
                    <div>
                        <p>{`Condición: ${condition}`}</p>
                    </div>
                </div>
               
            </div>
        </>
    )
}

function OfferDetail({idSearchProduct}){

    const inputAmount = useRef()
    const [productContent,setProductContent] = useState(null)

    useEffect(()=>{
        if(idSearchProduct!=null){
            console.log("HACER ESTA MAÑANA");
        }
    },[idSearchProduct])



    return(
        <>
             <div className="content-render-offer-myPublication">
                <div className="box-offer">
                    <div>
                        <img src={imgBook} alt="" />
                    </div>
                   
                </div>
                <div className="box-info-offer">
                    <div>
                         Nombre Product
                    </div>
                    <div>
                         Precio
                    </div>
                    <div>
                        Condicion
                    </div>
                </div>
                
                {/* <div>
                    Operación realizada con exitoso
                </div> */}
             </div>
        </>
    )
}

function InformationDetail({idOffer,nameOwner,condition,owners,priceOffer,priceProductOffer,idProduct,callBackinsertIdInProduct,imgBookOfferted}){

    const selectImg =()=>{
        callBackinsertIdInProduct(idProduct)
    }

    const acceptOffer = async ()=>{
        const token = ()=> localStorage.getItem('token')!=null?localStorage.getItem('token'):""
        try{
            let body = {
                "idOffer":idOffer,
                "tokenDto":{
                    "token": token()
                }
            }
            const response = await axios.post(`http://localhost:8080/transaction/`,body)
            if(response.status === 200){
                console.log(response.data);
                alert("Transación exitosa")
            }else{
                alert(e)
                console.log(e);
                console.log("BAD RETURN OFF SERVER TRANSACTION");
            }
        }catch(error){
            console.log(error.response.data.message);
        }
    }

    return(
        <>
            <div className="container-all-info-myPublication">
                <div className="card-offer-my-publication">
                    <div>
                         <h2>{nameOwner}</h2>
                    </div>
                    <div>
                        {
                            imgBookOfferted!=null
                            ?<div>
                                <img src={`http://localhost:8080/images/${imgBookOfferted}`} onClick={selectImg}></img>
                                <h2>{`${priceProductOffer} $`}</h2>
                                <h2>{`Estado : ${condition}`}</h2>
                            </div>
                            :""
                        }
                    </div>
                    <div>
                        <h2>{priceOffer!=null?`Valor ofertado \n ${priceOffer} $`: ""}</h2>
                    </div>
                    <div>
                        
                    </div>
                    <div>
                        <h2 className="accept-offer" onClick={acceptOffer}>Aceptar</h2>
                    </div>
                    <div>
                        <h2 className="deny-offer">Rechazar</h2>
                    </div>
                </div>
            </div>
        </>
    )
}


export function DetailMyPublications(){
    const {id} = useParams()
    const [onePublication,setOnePublication] = useState(null) 
    const [idProduct,setIdProduct] = useState(null)
    const [offers,setOffers] = useState([])

    useEffect(()=>{
        const fetchProducts = async () =>{
            try{
                const response = await axios.get(`http://localhost:8080/publication/${id}`)
                if(response.status === 200){
                    console.log(response.data);
                    setOnePublication(response.data)
                }else{
                    console.log("BAD RETURN OFF SERVER");
                }
            }catch(e){
                console.log(e);
                console.log("Internal Server Error");
            }

            try{
                let body = {
                     "idPublication":id,
                      "status":1
                }
                const response = await axios.post(`http://localhost:8080/offer/obtain-all-offers`,body)
                if(response.status === 200){
                    console.log(response.data);
                    setOffers(response.data)
                }else{
                    console.log("BAD RETURN OFF SERVER");
                }
            }catch(error){

            }
        }
        fetchProducts()
    },[])


    const insertIdInProduct = (id)=>{
        setIdProduct(id)
    }
    return(
            <div className="container-detail-myPublication">
            
                    <div>
                        <div className="container-img-myPublication">
                            {
                                onePublication!=null
                                ? <ImgDetail 
                                 name={onePublication.productResponse.name}
                                 price={onePublication.productResponse.price}
                                 condition={onePublication.productResponse.condition}
                                 imgMyDetailMyPublication={onePublication.productResponse.img}
                                />
                                :""
                            }
                            {
                                idProduct!=null
                                ?<OfferDetail
                                idSearchProduct={idProduct}
                                />
                                :""
                            }
                        </div>
                        <div className="container-information-myPublication">
                            {
                                offers.length === 0
                                ?<h2>Aun no tienes ofertas</h2> 
                                :<h2>Ofertas</h2>
                            }
                            {
                               
                                offers.map((item,index)=>{
                                    return <InformationDetail
                                    key={index}
                                    idOffer={item.id}
                                    nameOwner={item.userInformation.name}
                                    priceOffer={item.offerValue}
                                    priceProductOffer={item.productOffertedResponse!=null?item.productOffertedResponse.price:""}
                                    condition={item.productOffertedResponse!=null?item.productOffertedResponse.condition:""}
                                    idProduct={item.productOffertedResponse!=null?item.productOffertedResponse.id:""}
                                    callBackinsertIdInProduct={insertIdInProduct}
                                    imgBookOfferted={item.productOffertedResponse!=null?item.productOffertedResponse.img:null}
                                    >
                                        
                                    </InformationDetail>
                                  
                                })
                            }
                            
                        </div>
                    </div>
            </div>
    )
}