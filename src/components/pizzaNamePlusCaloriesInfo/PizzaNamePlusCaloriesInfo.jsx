import {useState, useEffect, useRef} from 'react';


const PizzaNamePlusCaloriesInfo = ({name, calories})=>{
    const [isComponentVisible, setIsComponentVisible] = useState(false);
    const ref = useRef(null);
    const refSpanInfo = useRef(null);
        


    const handleClickOutside = (event) =>{
         if (ref.current && !ref.current.contains(event.target) && refSpanInfo.current && !refSpanInfo.current.contains(event.target)){
            setIsComponentVisible(false);
        } 
    }

    useEffect(()=>{
       if(isComponentVisible){
        document.addEventListener('click', handleClickOutside, {passive:true});
        return ()=>{
            document.removeEventListener('click', handleClickOutside, {passive:true});
        }
       }
    }, [isComponentVisible]);

    return (
        <>
        <div className="pizzablock__pizza-title-info-wrap">
        <h3 className="pizzablock__pizza-title">{name}</h3>
        <span
      ref={refSpanInfo}
        onClick={(e)=>{
          setIsComponentVisible(!isComponentVisible)}}
        className="pizzablock__pizza-calories">
          
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            width="25" height="25"
            viewBox="0 0 50 50"
            /* style={{fill:'#000000'}} */>    <path d="M25,2C12.297,2,2,12.297,2,25s10.297,23,23,23s23-10.297,23-23S37.703,2,25,2z M25,11c1.657,0,3,1.343,3,3s-1.343,3-3,3 s-3-1.343-3-3S23.343,11,25,11z M29,38h-2h-4h-2v-2h2V23h-2v-2h2h4v2v13h2V38z"></path></svg>

        </span>
      </div>
      {isComponentVisible &&  <div 
          ref = {ref}
          className="pizzablock__pizza-calories-popup">В данной пицце {calories} кКал</div>}
        </>
    )
}

export default PizzaNamePlusCaloriesInfo;