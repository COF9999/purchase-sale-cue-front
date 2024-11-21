import { useParams } from "react-router-dom"
import reportIcon from "../../images/report-icon.png"
import closeIconReport from "../../images/icon-close-512.webp"
import iconChat from "../../images/icon-chat.png"
import { useEffect, useRef, useState } from "react"
import iconSendChat from "../../images/icon-send-chat.png"
import axios from "axios"
import "../css/detail.css"
import "../css/selectBox.css"
import { localStorageFunction } from "../js/methodsLocalStorage"
import baseUrl from "../../hostConfig";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';



const decodeJWT = ()=>{
    const token = localStorageFunction()
    const parts = token.split('.');
  
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
  
    // Decodificamos el payload de base64 a JSON
    const payload = JSON.parse(atob(parts[1]));
    return payload;
}


function ImgDetail({name,imgDetailPublication}){
    return(
        <>
            <div className="content-render-img-detail">
                <div className="box-name-product-detail">
                    <h2>{name}</h2>
                </div>
                <div className="box-image-detail div-img">
                     <img src={`${baseUrl}/images/${imgDetailPublication}`} alt="#" />
                </div>
            </div>
        </>
    )
}


function OptionProducts({id,name,price,funcOptionSelected,imgProductsOfferted}){

    const referenceSingleOption = useRef()

    const referenceTitleObserver = useRef()

    return(
        <a href="#" className="opcion" ref={referenceSingleOption} onClick={(e)=>{
            funcOptionSelected(e,referenceSingleOption,referenceTitleObserver)
        }}>
        <div className="contenido-opcion">
            <img src={`${baseUrl}/images/${imgProductsOfferted}`} alt=""/>
            <div className="textos" >
                <p className="p-ocult">{id}</p>
                <h2 className="titulo" ref={referenceTitleObserver}>{name}</h2>
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
            const response = await axios.post(`${baseUrl}/offer/`,body)
            if(response.status === 200){
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

    const optionSelected = (e,referenceSingleOption,referenceTitle) => {
        referenceTitle.current.classList.add('insert-node')
        referenceContentSelect.current.innerHTML = referenceTitle.current.parentElement.parentElement.parentElement.innerHTML
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
                    const response = await axios.post(`${baseUrl}/product/select`,body)
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
                     <button onClick={offerterPublication}>OFERTAR</button>
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
            
                <div className="container-description">
                    <div className="description-basic">
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
                            <p className="p-description"> {description}</p>
                        </div> 
                    </div>
                </div>
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
            const response = await axios.post(`${baseUrl}/denuciations/`,body)
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
                        <textarea name="" id="" cols="1" rows="1" ref={textAreaRef}>

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





function CreateMessageChapt({idPublication,setSearhAgainFunction}){

    const textAreaRef = useRef()

    const launchCreateMessage = async () =>{

        const valueTextArea = textAreaRef.current.textContent

        console.log(valueTextArea);
        
        if(valueTextArea=="" || valueTextArea == undefined){
            alert("Llena el campo de texto para chatear")
            return
        }

        let body={
            "message":valueTextArea, 
            "tokenDto":{
                "token": localStorageFunction()
            },
            "idPublication": idPublication
        }

        

        try{
            const response = await axios.post(`${baseUrl}/comments-publication/`,body)
            if(response.status === 200){
                setSearhAgainFunction()
            }else{
                console.log("BAD RETURN OFF SERVER");
            }
        }catch(e){
            console.log("Internal Server Error",e);
        }
    }

    return(
        <div className="wrapper-chapt">
            <div className="chat-tab-1">
                <div className="data-content-input">
                    <div 
                        className="campus-text content-tab-1"
                        aria-placeholder="Escribe un mensaje" 
                        contentEditable="true"
                    type="text" ref={textAreaRef} 
                    >
                      
                    </div>
                </div>
               
                <div className="div-btn-send-chap content-tab-1">
                    <div>
                        <div>
                            <img src={iconSendChat} onClick={launchCreateMessage} className="btn-send-message-chap"/>
                        
                        </div>
                    </div>
                </div>
            </div>
           
        </div>
    )
}


/*

function DetailChapt({userInformation,message}){


    const refColorCard = useRef("friendComment")

    if(userInformation==null){
        return
    }

    const decodeJWT = (token)=>{
        const parts = token.split('.');
      
        if (parts.length !== 3) {
          throw new Error('Invalid token format');
        }
      
        // Decodificamos el payload de base64 a JSON
        const payload = JSON.parse(atob(parts[1]));
      
        return payload;
    }


    

    useEffect(()=>{
        const consultData = async ()=>{

            try{

              const token = localStorageFunction()
                
               const body =  {
                    "token": token
               }
                const response = await axios.post(`${baseUrl}/security/token-is-valid`,body)

                if(response.status === 200 && response.data){
                    if(userInformation.identification === decodeJWT(token).sub){
                       refColorCard.current = "myComment"
                    }
                }else{
                    
                }
            }catch(e){
                localStorage.removeItem('token')
            }
        }
        consultData()
    },[])
 

    return(
        <div className={`cardDetailChapt ${refColorCard.current}`}>
            <div>
                <p>~{userInformation.name}</p>
            </div>
            <div>
                {message}
            </div>
        </div>
    )
}


function Chapt({idPublication,setVisualizateContentChap}){

    const [chapt,setChapt] = useState([])

    const [searchAgain,setSearchAgain] = useState(0)

    useEffect(()=>{
        
        const fetchProducts = async () =>{
            try{
                const response = await axios.get(`${baseUrl}/comments-publication/${idPublication}`)
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
    },[searchAgain])

   

    
    
    const deactiveChap = () =>{
        setVisualizateContentChap(false)
    }

    
    const setSearhAgainFunction = () =>{
        setSearchAgain(searchAgain+1)
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
                                    setSearhAgainFunction={setSearhAgainFunction}
                                    idPublication={idPublication}
                                />
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

*/


///////////////////////----

function CardMessage({message}){

    const colorClasses = ["emerald-400",
    "yellow-400"]
  
    let colorTextWriter;
    let margin;
    let bkgColor;
  
    if(decodeJWT()===message.userResponseDto.idUser){
      colorTextWriter = colorClasses[0]
      margin = "margin-right"
      bkgColor = "green-cht-basic"
    }else{
      colorTextWriter = colorClasses[1]
    }
  
    return(
      <div className='wrapper-message'>
          <div className={`message ${margin} ${bkgColor}`}>
              <div className='info-writer'>
                <p className={`text-writer ${colorTextWriter}`}>~ {message.userResponseDto.name}</p>
              </div>
              <div className='box-content-text-message'>
                <p>{message.message}</p>
              </div>
          </div>
      </div>
     
    )}
  
  function IterateCardMessage({chat,paramsUrl}){
    if(Object.keys(chat).length === 0 || chat["commentResponseDto"].length === 0){
      return
    }
  
    return(
      <Fragment>
        {
          chat.commentResponseDto.map(message=> <CardMessage
            key={message.id}
            paramsUrl={paramsUrl}
            message={message}
          />)
        }
      </Fragment>
    )
  }
  
  function BarSendMessage({sendMessage}){
  
    const textCampusRef = useRef()
  
    
    const launchMessage = async ()=>{
    
        try{

                const token = localStorageFunction()
                
                const body =  {
                    "token": token
                }
                const response = await axios.post(`${baseUrl}/security/token-is-valid`,body)

                if(response.status === 200 && response.data){
                    if(userInformation.identification === decodeJWT().sub){
                        refColorCard.current = "myComment"
                    }
                }else{
                    
                }
            }catch(e){
                localStorage.removeItem('token')
            }
      
      sendMessage({
        message: textCampusRef.current.value,
        idUser: userInformation.identification
      }
      )
    }
  
    return(
      <div className='box-send-message box-send-message-1'>
          <input ref={textCampusRef} type="text" />
          <button onClick={()=> launchMessage()}>Enviar</button>
      </div>
      
    )
  }
  
   function App({setVisualizateContentChap,idPublication}) {
    const paramsUrl = useParams()
    const url = 'http://192.168.1.16:8080/chat-socket'
    const [stompClient,setStompClient] = useState(null)
    const [chat,setChat] = useState({})
    const init = useRef(false)
    const [sockJs,setSockJs] = useState(new SockJS(url))
    
    const initMessages = async ()=>{
      if(init.current==false){
        try{
          const response = await axios.post(`http://192.168.1.16:8080/chat/list/${idPublication}`)
          setChat(response.data)
          console.log(response.data);
          init.current = true
        }catch(e){
          console.log("Error",e);
        }
      }
    }

    const deactiveChap = () =>{
        setVisualizateContentChap(false)
    }
  
    useEffect(()=>{
      initMessages()
      const client = Stomp.over(sockJs);
      
      // Creamos la conexión al broker con la room
      client.connect({},()=>{
        client.subscribe(`/topic/${idPublication}`,(objMessage)=>{
          const newMessageObj = JSON.parse(objMessage.body)
          setChat((prevObjMessage)=>{
            let instanceBefore = structuredClone(prevObjMessage)
            instanceBefore.commentResponseDto.push(newMessageObj)
            return instanceBefore
          })
        })
      }, (error)=>{
          console.log("Error Web Socket");
      })
  
      setStompClient(client)
  
      return () => {
        if (stompClient) {
            stompClient.disconnect(() => {
                console.log('Desconectado del WebSocket');
            });
        }
      }
    },[])
  
  
    const sendMessage = (messageObj)=>{
      if(stompClient.connect){
        stompClient.send(`/app/chat/${idPublication}`,{},JSON.stringify(messageObj))
      }
    }
  
    return (
      <Fragment>
       <main className='main'>
       <section className='section'>
          <div className='panel panel-1'>
            <div className='chat chat-1'>
                <IterateCardMessage
                  paramsUrl={paramsUrl}
                  chat={chat}
                />
            </div>
           <BarSendMessage
              sendMessage={sendMessage}
            />
          </div>
        </section>
       </main>
      </Fragment>    
    )
  }


//////////////////////


export function Detail(){
    const {id} = useParams()
    const [onePublication,setOnePublication] = useState(null) 
    const [visualizationOverlay,setVisualizationOverlay] = useState(null)
    
    const [visualizateContentChap,setVisualizateContentChap] = useState(false)

    useEffect(()=>{
        const fetchProducts = async () =>{
            try{
                const response = await axios.get(`${baseUrl}/publication/${id}`)
                if(response.status === 200){
                   
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
           
                {
                    onePublication!=null
                    ?<div className="container-detail-publication">
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
                                onePublication={onePublication}
                            />
                             <div className="container-actions-detail-publication">
                              
                                    <div className="div-denunciation --content-div-icon">
                                        <div className="div-content-icon-report" onClick={launchPopUpDenunciation}>
                                            <img src={reportIcon} alt="report-icon" />
                                        </div>
                                    </div>
                                    <div className="div-chapt --content-div-icon">
                                            <div className="div-content-icon-chapt" onClick={activeChapt}>
                                                <img src={iconChat} alt="Icon-Chat"/>
                                            </div>
                                    </div>
                               
                               
                             </div>
                            
                        </div>
                    </div>
                    :""
                }
            <Overlay
                idPublication={onePublication!=null?onePublication.id:null}
                activeOverlay={visualizationOverlay}
                changeVisorActiveOverlay={setVisualizationOverlay}
            />

            {
                onePublication!=null && visualizateContentChap != false
                ? <App
                setVisualizateContentChap={setVisualizateContentChap}
                idPublication={onePublication!=null?onePublication.id:null}
                />
                :""
            }        
        </>
    )
}