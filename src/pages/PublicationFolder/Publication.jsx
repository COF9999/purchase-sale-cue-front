import React, { useEffect, useRef, useState } from "react";
import imgBook from "../../images/img-book.jpeg"
import { Link } from "react-router-dom"
import axios from "axios"
import iconCloseGoToGreen from "../../images/icon-close-512.webp"
import "../css/publications.css"

function CardPublications({id,nameProduct,descriptionProduct,priceProduct,conditionProduct,imgPublication}){
    return (
          <div className="box-card-publications">
             <div>
                <div className="box-inner">
                    <h2>{nameProduct}</h2>
                </div>
                <div className="box-inner">
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
                    <p>
                        <Link to={`/publications/detail/${id}`}>Ver detalles</Link>
                    </p>
                </div>
            </div>
        </div>
        )
}


function Overlay({statePopUpGreen,popUpSetStatus}){

    const [initPopUpGreen,setInitPopUpGreen] = useState(()=> {
        return localStorage.getItem("popUpGreenFlat")!= ""?localStorage.getItem("popUpGreenFlat"):""
    }
    )

    if(initPopUpGreen === "yes" || statePopUpGreen==null){
        console.log(initPopUpGreen);
        return
    }

    const changeActiveOverlay = ()=>{
        popUpSetStatus(null)
        localStorage.setItem('popUpGreenFlat',"yes")
    }
    return(
        <div className="overlay-green-page">
                <div className="div-content-card-green-page">
                    <div>
                        Ayudanos y ve a economia circular,para ayudarnos a mejorar el medio ambiente
                    </div>
                   <div>
                        <Link to={"/green-page"}>Ir a pagina a la pagina</Link>
                   </div>
                   <div className="div-close-popUp-green-page">
                        <div>
                            <img src={iconCloseGoToGreen} alt="" onClick={changeActiveOverlay}/>
                        </div>
                   </div>
                </div>
        </div>
    )
}

export function Publication(){
    const [allPublications,setAllPublications] = useState([])
    const filterCategoryDiv = useRef(null)
    const [menuCategoryVisible,setMenuCategoryVisible] = useState(false)
    const [menuPriceVisible,setMenuPriceVisible] = useState(false)
    const [menuValorationVisible,setMenuValorationVisible] = useState(false)
    const inputPriceMinimum = useRef(null)
    const inputPriceMaximum = useRef(null)
    const inputConditionMinimum = useRef(null)
    const inputConditionMaximum = useRef(null)
    const [popUpGreen,setPopUpGreen] = useState(true)

    const multiConsult = useRef({
        "category":[],
        "price":[],
        "condition":[]
    })
    
    useEffect(()=>{
        const fetchProducts = async () =>{
               // const token = ()=> localStorage.getItem('token')!=null?localStorage.getItem('token'):""

                // const body ={
                //     "token":token()
                // }

                try{
                    const response = await axios.get("http://localhost:8080/publication/allPublications")
                    if(response.status === 200){
                        setAllPublications(response.data)
                    }else{
                        console.log("BAD RETURN OFF SERVER");
                    }
                }catch(e){
                    console.log("Internal Server Error");
                }
        }
        fetchProducts()
    },[])

    const filterCategory = (e,menu,func) => {
        const referenceInput = e.target.matches("input")
        let flatEnter = true
        if(e.target.matches("label") || (e.target.name === "category")){
            flatEnter = false
            const $checkBox = e.target
            const consultArray = multiConsult.current;
            if($checkBox.checked){
                consultArray.category.push($checkBox.value)
                console.log(consultArray);
            }else{
                const indexInArray = consultArray.category.indexOf($checkBox.value)
                consultArray.category.splice(indexInArray,1)
                console.log(consultArray);
            }
        }

        if(referenceInput){
            flatEnter = false
        }

        if(flatEnter){
            func(!menu)
        }
                    
    }

    const extractAndCompactValuesInput = (inputMinimun,inputMaximum)=>{
        const valueInputMinimum = inputMinimun.current.value;
        const valueInputMaximum = inputMaximum.current.value;
        if(valueInputMinimum!='' && valueInputMaximum!=''){
            return [parseFloat(valueInputMinimum),parseFloat(valueInputMaximum)]
        }else if(valueInputMinimum == '' && valueInputMaximum==''){
            return "NOT HAPPEND NOTHING"
        }else if((valueInputMinimum != '' && valueInputMaximum=='') || (valueInputMinimum=='' && valueInputMaximum !='')){
            return false
        }
    }

    const setDataInArrayConsult = (value,referenceInConsult) =>{
        let reference = referenceInConsult
        console.log(reference);
        if(value!="NOT HAPPEND NOTHING" && value!= false){
            reference = value
            console.log(reference);
            return reference
        }else if(value=="NOT HAPPEND NOTHING"){
            return []
        }
        else if(value==false){
            alert("Alerta verifica que tienes tus valores de precio y condición completos")
            return []
        }
    }

    const launchMultiConsult = async ()=>{
        const valuePrice = extractAndCompactValuesInput(inputPriceMinimum,inputPriceMaximum)
        const valueCondition = extractAndCompactValuesInput(inputConditionMinimum,inputConditionMaximum)
        multiConsult.current.price = setDataInArrayConsult(valuePrice,multiConsult.current.price)
        multiConsult.current.condition =  setDataInArrayConsult(valueCondition,multiConsult.current.condition)
        // if(multiConsult.current.category != null && multiConsult.current.category.length === 0){
        //     multiConsult.current.category = null
        // }
        let body = multiConsult.current;
        console.log(multiConsult.current);
        try{
            const response = await axios.post("http://localhost:8080/publication/multi-consult",body)
            if(response.status === 200){
                console.log(response.data);
                setAllPublications(response.data)
            }else{
                console.log("BAD RETURN OFF SERVER");
            }
        }catch(e){
            console.log("Internal Server Error");
        }
    }

    return(
        <>
           <div className="container-primary-publications">                  
                <div className="container-filter-publications" >
                        <div className="menu box-filter-category" onClick={(e)=> filterCategory(e,menuCategoryVisible,(menu) => setMenuCategoryVisible(menu))} ref={filterCategoryDiv}>
                            <p>Categoria</p>
                            <div className={`div-father-list-filters-category ${menuCategoryVisible ? '' : 'active'}`}>

                                    <div className="content-input-label-filter-category">
                                        <div>
                                             <input type="checkbox" name="category" value="LIBROS"/>
                                        </div>
                                        <div>
                                             <label>LIBROS</label>
                                        </div>
                                    </div>
                                    <div className="content-input-label-filter-category">
                                        <div>
                                          <input type="checkbox" name="category" value="UNIFORME"/>
                                        </div>
                                        <div>
                                          <label>UNIFORME</label><br/>
                                        </div>
                                    </div>
                                    <div className="content-input-label-filter-category">
                                        <div>
                                            <input type="checkbox" name="category" value="EQUIPOS"/>
                                        </div>
                                        <div>
                                          <label>EQUIPOS</label>
                                        </div>
                                    </div>
                                    <div className="content-input-label-filter-category">
                                        <div>
                                             <input type="checkbox" name="category" value="ELECTRONICA"/>
                                        </div>
                                        <div>
                                             <label>ELECTRONICA</label>
                                        </div>
                                    </div>         
                            </div>
                        </div>
                        
                        
                        <div className="menu box-filter-price" onClick={(e)=> filterCategory(e,menuPriceVisible,(menu) => setMenuPriceVisible(menu))}>
                            <p> Filter price</p>
                            <div className={`${menuPriceVisible ? '' : 'active'}`} id="price-menu">
                                <input  ref={inputPriceMinimum} type="number" placeholder="Min Price"/>
                                <input ref={inputPriceMaximum} type="number" placeholder="Max Price"/>
                            </div>
                        </div>
                        
                        
                        <div className="menu box-filter-valoration" onClick={(e)=> filterCategory(e,menuValorationVisible,(menu) => setMenuValorationVisible(menu))}>
                            <p>Filter Condition</p>
                            <div className={`${ menuValorationVisible? '' : 'active'}`} id="valoration-menu">
                                <input ref={inputConditionMinimum} type="number" placeholder="Valoration"/>
                                <input  ref={inputConditionMaximum}  type="number" placeholder="Valoration"/>
                            </div>
                        </div>

                        <div className="box-btn-send-consult">
                            <button onClick={launchMultiConsult}>Consultar</button>
                        </div>
                       
                </div>


                <div className="container-principal-list-publications">
                    <div className="container-list-publications">
                    {
                        allPublications.map((item,index) => {
                            return (
                                <CardPublications
                                key={index}
                                id={item.id}
                                nameProduct={item.productResponse.name}
                                descriptionProduct={item.productResponse.description}
                                priceProduct={item.productResponse.price}
                                conditionProduct={item.productResponse.condition}
                                imgPublication={item.productResponse.img}
                                >
                                </CardPublications>
                                )
                        })
                    }
                    </div>
                </div>
            
            </div>
            <Overlay
               statePopUpGreen={popUpGreen} 
               popUpSetStatus={setPopUpGreen}
            >
            </Overlay>
        </>
    )
}