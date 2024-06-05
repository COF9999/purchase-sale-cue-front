import { useParams } from "react-router-dom"
import reportIcon from "../../images/report-icon.png"
import closeIconReport from "../../images/icon-close-512.webp"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import "../css/detail.css"
import "../css/selectBox.css"
import { localStorageFunction } from "../js/methodsLocalStorage"

function ImgDetail({name,imgDetailPublication}){
    return(
        <>
            <div className="content-render-img-detail">
                <div className="box-name-product-detail">
                    <h2>{name}</h2>
                </div>
                <div className="box-image-detail div-img">
                     <img src={`http://localhost:8080/images/${imgDetailPublication}`} alt="#" />
                </div>
            </div>
        </>
    )
}


function OptionProducts({id,name,price,funcOptionSelected,imgProductsOfferted}){

    const referenceSingleOption = useRef()

    return(
        <a href="#" className="opcion" ref={referenceSingleOption} onClick={(e)=>{
            funcOptionSelected(e,referenceSingleOption)
        }}>
        <div className="contenido-opcion">
            <img src={`http://localhost:8080/images/${imgProductsOfferted}`} alt=""/>
            <div className="textos">
                <p className="p-ocult">{id}</p>
                <h2 className="titulo">{name}</h2>
                <p className="descripcion">{price}</p>
            </div>
        </div>
        </a>
    )
}
function OfferDetail({id}){

    const inputAmount = useRef(null)
    const referenceSelect = useRef()
    const referenceContentSelect = useRef()
    const referenceOptions = useRef()
    const [myProductsOffer,setMyProductsOffer] = useState([])
    const productHasBeenSelected = useRef(null)

    const offerterPublication = async () =>{

        const valueInputAmount = inputAmount.current.value!=""?inputAmount.current.value:null
        const token = ()=> localStorage.getItem('token')!=null?localStorage.getItem('token'):""
        const idProduct = productHasBeenSelected.current!=null? parseInt(productHasBeenSelected.current):null
        let body = {
            "idPublication":id,
            "idProduct":idProduct,
            "priceOffert":valueInputAmount,
            "tokenDto":{
                "token": token()
            }
        }

        
        try{
            const response = await axios.post(`http://localhost:8080/offer/`,body)
            if(response.status === 200){
                console.log(response.data);
                console.log("Oferta-------");
                alert("Oferta realizada con exito");
            }else{
                console.log("BAD RETURN OFF SERVER");
            }
        }catch(e){
            alert(e.response.data.message)
        }
    }

    const activeSelect = () =>{
        referenceSelect.current.classList.toggle('active')
        referenceOptions.current.classList.toggle('active')
    }

    const optionSelected = (e,referenceSingleOption) => {
        e.preventDefault()
        referenceContentSelect.current.innerHTML = e.currentTarget.innerHTML
        referenceSelect.current.classList.toggle('active')
        referenceOptions.current.classList.toggle('active')
        productHasBeenSelected.current = referenceSingleOption.current.querySelector(".p-ocult").textContent;
    }

    // Carga de productos del ofetante
    useEffect(()=>{
        const fetchProducts = async () =>{
                const token = ()=> localStorage.getItem('token')!=null?localStorage.getItem('token'):""

                const body ={
                    "token":token()
                }

                try{
                    const response = await axios.post("http://localhost:8080/product/select",body)
                    if(response.status === 200){
                        setMyProductsOffer(response.data)
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
             <div className="content-render-offer-detail">
             <div className="box-offer">
                    <div>
                        <h3>Monto a ofertar</h3>
                    </div>
                    <div>
                            <input ref={inputAmount} type="text" />
                    </div>
                </div>
                
             <form action="">
                        <div className="selectbox">
                            <div className="select" id="select" ref={referenceSelect} onClick={activeSelect}>
                            <div className="contenido-select" ref={referenceContentSelect}>
                                <h1 className="titulo">Escoge un producto</h1>
                                <p className="descripción">Producto</p>
                            </div>
                            <span className="material-symbols-outlined">expand_more</span>
                        </div>

                         <div className="opciones" id="opciones" ref={referenceOptions}>
                            {
                                myProductsOffer.map((item,index) =>{
                                    return( 
                                        <OptionProducts
                                         key={index}
                                         id={item.id}
                                         name={item.name}
                                         price={item.price}
                                         funcOptionSelected={optionSelected}
                                         imgProductsOfferted={item.img}
                                        >
                                        </OptionProducts>
                                    )
                                })
                              
                            }
                    </div>
                </div>
                <input type="hidden" name="pais" id="inputSelect" value=""/>

                </form>
                <div className="div-btn-offer">
                     <button onClick={offerterPublication}>Ofertar</button>
                 </div>   


                {/* Mensaje correcto */}
                {/* <div>
                    Operación realizada con exitoso
                </div> */}
             </div>
        </>
    )
}

function InformationDetail({nameOwner,condition,price,description}){
    return(
        <>
            <div className="container-all-info-detail">
                <div>
                    <h3>Dueño</h3>
                    <p>{nameOwner}</p>
                </div>
                <div>
                    <h3>Precio</h3>
                    <p>{price}</p>
                </div>
                <div>
                    <h3>Estado</h3>
                    <p>{condition}</p>
                </div>
                <div>
                    <h3>Descripción</h3>
                    <p>{description}</p>
                </div>
            </div>
        </>
    )
}



export function Overlay({idPublication,activeOverlay,changeVisorActiveOverlay}){

    if (activeOverlay == null || idPublication==null) {
        return null
    };

    const textAreaRef = useRef()

    const changeActiveOverlay = ()=>{
        changeVisorActiveOverlay(null)
    }

    
    const sendReport = async()=>{

        if (textAreaRef.current.value === ""){
            return null
        }
        const token = ()=> localStorage.getItem('token')!=null?localStorage.getItem('token'):""

        let body = {
            "idPublication":idPublication,
             "message": textAreaRef.current.value,
             "tokenDto":{
                "token":token()
             }
        }
        try{
            const response = await axios.post("http://localhost:8080/denuciations/",body)
            if(response.status === 200){
                changeActiveOverlay()
            }else{
                console.log("BAD RETURN OFF SERVER");
            }
        }catch(e){
            alert(e.response.data.message)
            changeActiveOverlay()
        }
        
    }


    return(
        <div className="overlay">
                <div className="div-content-card-report">
                    <div>
                        <h2>Escribe tu denuncia</h2>
                    </div>
                   
                   <div>
                        <textarea name="" id="" cols="30" rows="10" ref={textAreaRef}>

                        </textarea>
                   </div>

                   <div>
                        <button onClick={sendReport}>Enviar</button>
                   </div>
                   <div className="div-close-popUp-report">
                        <div>
                            <img src={closeIconReport} alt="" onClick={changeActiveOverlay}/>
                        </div>
                   </div>
                </div>
        </div>
    )
}





function CreateMessageChapt({id}){

    const textAreaRef = useRef()

    const launchCreateMessage   = async () =>{

        const valueTextArea = textAreaRef.current.value
        if(valueTextArea=="" || valueTextArea == undefined){
            alert("Llena el campo de texto para chatear")
            return
        }

        let body={
            "message":valueTextArea, 
            "tokenDto":{
                "token": localStorageFunction()
            },
            "idPublication": id
        }

        try{
            const response = await axios.post(`http://localhost:8080/comments-publication/`,body)
            if(response.status === 200){
                console.log("Mensaje creado exitosamente");
            }else{
                console.log("BAD RETURN OFF SERVER");
            }
        }catch(e){
            console.log("Internal Server Error");
        }
    }

    return(
        <div className="container-chapt">
            <div>
                <textarea name="" id="" cols="30" rows="10" ref={textAreaRef}></textarea>
            </div>
            <div>
                <button onClick={launchCreateMessage}>Enviar</button>
            </div>
        </div>
    )
}

function DetailChapt({userInformation,message}){

    if(userInformation==null){
        return
    }
    
    return(
        <div className="cardDetailChapt">
            <div>
                {userInformation.name}
            </div>
            <div>
                {message}
            </div>
        </div>
    )
}

function Chapt({setVisualizateContentChap, visualizateContentChap,id}){

    
    if(visualizateContentChap===false){
        return
    }
    
    const [chapt,setChapt] = useState([])

    useEffect(()=>{
        const fetchProducts = async () =>{
            try{
                const response = await axios.get(`http://localhost:8080/comments-publication/${id}`)
                if(response.status === 200){
                    console.log(response.data);
                    setChapt(response.data)
                    
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

    

    const deactiveChap = () =>{
        setVisualizateContentChap(false)
    }
    return(
        <div className="father-content-chapt">
            <div className="container-chapt">
                <div className="all-chapts">
                    {
                        chapt.length>0
                        ?chapt.map((item,index)=>{
                            return <DetailChapt
                                key={index}
                                message={item.message}
                                userInformation={item.userInformation}
                            ></DetailChapt>
                        })
                        :""
                        
                    }
                </div>
            <div className="first-content-chapt">
                <CreateMessageChapt
                    id={id}
                ></CreateMessageChapt>
                 </div>
            </div>
            <div className="div-close-icon" onClick={deactiveChap}>
                <div>
                    <img src={closeIconReport} alt="" />
                </div>
            </div>
        </div>
    )
}


export function Detail(){
    const {id} = useParams()
    const [onePublication,setOnePublication] = useState(null) 
    const [visualizationOverlay,setVisualizationOverlay] = useState(null)
    
    const [visualizateContentChap,setVisualizateContentChap] = useState(false)

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
                console.log("Internal Server Error");
            }
        }
        fetchProducts()
    },[])

    const launchPopUpDenunciation = () =>{
        setVisualizationOverlay(true)
    }

    const activeChapt = () =>{
        setVisualizateContentChap(!visualizateContentChap)
    }
    return(
        <>
            <div className="container-detail-publication">
                <div></div>
                {
                    onePublication!=null
                    ?<div>
                        <div className="container-img-offer">
                                <ImgDetail 
                                    name={onePublication.productResponse.name}
                                    imgDetailPublication={onePublication.productResponse.img}
                                >
                                    
                                </ImgDetail>
                                <OfferDetail id={onePublication.id}></OfferDetail>
                        </div>
                        <div className="container-information-detail">
                            <InformationDetail
                                nameOwner={onePublication.userInformation.name}
                                condition={onePublication.productResponse.condition}
                                price={onePublication.productResponse.price}
                                description={onePublication.productResponse.description}
                            >
                            </InformationDetail>
                        </div>
                    </div>
                    :""
                }
                
                <div className="div-principal-denunciation">
                    <div className="div-content-icon" onClick={launchPopUpDenunciation}>
                        <img src={reportIcon} alt="report-icon" />
                    </div>
                </div>
                <div className="div-principal-chapt">
                    <div className="div-content-icon-chapt" onClick={activeChapt}>
                        <p>Chatear</p>
                    </div>
                </div>
            </div>
            <Overlay
                idPublication={onePublication!=null?onePublication.id:null}
                activeOverlay={visualizationOverlay}
                changeVisorActiveOverlay={setVisualizationOverlay}
            >

            </Overlay>
            <Chapt
                visualizateContentChap={visualizateContentChap}
                setVisualizateContentChap={setVisualizateContentChap}
                id={onePublication!=null?onePublication.id:null}
            />
            
            
        </>
    )
}