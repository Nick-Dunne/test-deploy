import './addIngredients.scss';

import {useDispatch, useSelector} from 'react-redux';
import { useEffect, useState } from 'react';

import { fetchCatOfIngred } from '../../../features/generalSlice';



const AddIngredients = ({formStateWithExtraIngr, extraIngr, minusExtraIngr})=>{
    console.log('render')
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchCatOfIngred());
    }, []);

    const [activeClass, setActiveClass] = useState(2);
    // addIngredients__borderB

    const allIngredients = useSelector(state=>state.general.ingr);
    const regExp = new RegExp(`^${activeClass}`,'g');
    const filteredIngred = Object.keys(allIngredients).filter(item=>{
         return item.match(regExp)}).map(item=>{
            return (
                <li className="addIngredients__ingr" key={item}>
                    <span className="addIngredients__ingr-title">{allIngredients[item][0]}</span>
                    <div>
                    <div className='addIngredients__ingr-price-wrapper'><span>порція&nbsp;</span><span className="addIngredients__ingr-price">{allIngredients[item][1]} грн</span></div>
                    {!extraIngr[item] ?
                    <span 
                    onClick={()=>{formStateWithExtraIngr(item, allIngredients[item][1])}}
                    className="addIngredients__ingr-count">➕</span> 
                    : 
                    <div className="aside-cart__footer-config-count">
                    <button 
                    onClick={()=>{minusExtraIngr(item)}}
                    className="aside-cart__min">-</button> 
                    <span
                      className="aside-cart__count">{extraIngr[item].length}</span> 
                    <button
                    onClick={()=>{formStateWithExtraIngr(item, allIngredients[item][1])}}
                    className="aside-cart__plus">+</button></div>
                    }
                    
                    </div>
                </li>
            )
         })


    const catOfIngred = useSelector(state=>state.general.catOfIngred);

    const categories = Object.keys(catOfIngred).map((item)=>{
        const classNames = activeClass == item ? 'addIngredients__ingr-cat addIngredients__borderB' : 'addIngredients__ingr-cat'
        if(item == 1 || item == 3){
            return null;
        }
        return (
            <li 
            onClick={()=>{setActiveClass(item)}}
            id={item} key={item + 1} className={classNames}>{catOfIngred[item]}</li>
        )

    })
   

    return (
       <>
        <ul className="addIngredients__cat-list">
           {categories}
        </ul>
        <div>
            <ul className="addIngredients__list">
                {filteredIngred}
            </ul>
        </div>
        {activeClass == 2 ? <div style={{fontSize: 12,}}>*здебільшого стандартна піца скадається з щонайменше 4 порцій м'ясних виробів</div> : null}
       </>
    )
}


export default AddIngredients;