import './pizzaItem.scss';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PizzaNamePlusCaloriesInfo from '../pizzaNamePlusCaloriesInfo/PizzaNamePlusCaloriesInfo';

//импортируем экшен для того, чтобы открывать модальное окно для модификации при нажатии "Изменить ингредиенты"
import { goModify } from '../../features/generalSlice';

//импортируем экшены добавления в корзину объекта, плюс и минус
import { addToCart, plusToCart, minusToCart } from '../../features/cartSlice';





//в пропсах иp ПиццаЛист приходит объект с данными конкретной пиццы (там у нас map)
const PizzaItem = ({info})=>{
  //далее до ЮЗЭФФЕКТ реализован попАП для выбора бортиков. Тут же и рефы для того, чтобы определять в какую область клацать. В слушателе событий есть четкая зависимость от появления или скрытия окна, кроме этого - слушатель вешается только в случае, если модальное для бортиков открыто, когда оно будет закрыто, то слушатель будет удален.
  const [bortIndex, setBortIndex] = useState(0);
  const [chooseBortPopUp, setChooseBortPopUp] = useState(false);

  const ref = useRef(null);
  const dispatch = useDispatch();
  
  const handleClickOutside = (event) =>{
    if (ref.current && !ref.current.contains(event.target)){
       setChooseBortPopUp(false);
   } 
}
//тут вешаем сам слушатель событий. Хорошее и эффективное решение вышло. Можешь проверить в консоли.
useEffect(()=>{
  if(chooseBortPopUp){
   document.addEventListener('click', handleClickOutside, {passive:true});
   return ()=>{
       document.removeEventListener('click', handleClickOutside, {passive:true});
   }
  }
}, [chooseBortPopUp]);

//получаем данные из корзины для проверок
const cartData = useSelector(state=>state.cart.cart);


  //получаем объект {порядковый номер:название ингредиента}
  //это делается для того, чтобы потом мы могли перевести порядковые номера, полученные из объектов с пиццами в нормальный язык. А почему я использую порядковые номера вместо буквенных обозначений? Потому что мы с ними формируем уникальные айди, сортируем их (чтобы была идентичность) и т.д. Мне нужны числа, потому что потом я их сортирую, формируя айди, чтобы быть уверенным в порядке. Да и красиво это
    const allIngr = useSelector(state=>state.general.ingr);
    
  //так же поступаем и с бортиками
  const borts = useSelector(state=>state.general.borts);

    
  //деструктуризируем объект с данными пиццы (пропсы) и достаем все, что нужно
    const {id, img, name, price, descr, category, calories, feature, satiety} = info;

    //ниже условия (если есть определенный элемент массива, то показываем определенный контент, если нет, то ничего)
    const isNew = category.includes('new') ? <span className="pizzablock__isNew">new</span> : null;
    const isHit = category.includes('hit') ?  <span className="pizzablock__isHit">hit</span> : null;
    const isVegan = feature.includes('vegan') ? <span className="pizzablock__special">vegan</span> : null;

    //ниже формируем айди, которое будет создавать в корзине уникальную запись
    const fullId = id + bortIndex + descr.join('');
    //ниже формируем полную цену для отправки уже с бортиком
    const fullPrice = price + borts[bortIndex].price;


    return (
      <>
        <li className="pizzablock__pizza-item"><img className="pizzablock__pizza-img" src={img} alt=""/>
        <div className="pizzablock__more-info">
          <div>  {isNew} {isHit} </div>
          <div> {isVegan} <span
           className="pizzablock__people">{satiety}</span></div>
        </div>
        {/* вывел калории в отдельный компонент, чтобы своим рендером он не затрагивал другие элементы */}
        <PizzaNamePlusCaloriesInfo name={name} calories={calories}/>

        <div className="pizzablock__pizza-descr">{descr.map((item, ind, arr)=>{
          if(ind === arr.length -1){
            //allIngr[item][0] - из-за структуры моей базы данных
            return `${allIngr[item][0]}`
          }
            return `${allIngr[item][0]}, `})}</div>
        <div className="pizzablock__change-ingr">
          
          <span
          onClick={()=>{dispatch(goModify(id))}}
          ><strong>змінити інгредієнти</strong></span></div>

        <div
        ref={ref}
        onClick={()=>{setChooseBortPopUp(!chooseBortPopUp)}} 
        className="pizzablock__choose-bort"><span>Бортик - {borts[bortIndex].title} ▼</span></div>
        {chooseBortPopUp && <div className="bort-popup">
          {
            Object.keys(borts).map(item=>{
              return (
                <span key={item} onClick={()=>{setBortIndex(item); setChooseBortPopUp(false)}}>{borts[item].title}</span>
              )
            })
          }

        </div>}
        
       
        <div className="pizzablock__order-details"><span className="pizzablock__price">{fullPrice} (за од.)</span> 
       {/*    ниже важное условие - для этого мы и получали юзСелектором данные из корзины. Мы спрашиваем, есть ли в корзине айди, которое способен сгенерировать компонент. Если нет, то значит добавления в корзину еще не было и показывается обычная кнопка с экшеном АДТУКАРТ, но если в редакс-стэйте корзины уже есть пицца или группа пицц под соответствующим АЙДИ, то вместо кнопки добавить в корзину у нас появляется счетчик пицц и сообщение об успешно добавленном товаре */}
        {!cartData[fullId] ?
        <button 
        onClick={()=>{dispatch(addToCart({id: fullId, price: fullPrice, name, bortName: borts[bortIndex].title, img, deleted:[], extra: {}}))}}
        className="pizzablock__addCart-btn">В корзину</button>
          :
          <div>
          Товар в корзине&nbsp;&nbsp;
          <button
          onClick={()=>{dispatch(minusToCart(fullId))}}
          >-</button> 
          {/* без проверки работать не будет. Мы отрисовывем количество пицц под данным АЙДИ. */}
          <span>{cartData[fullId] ? cartData[fullId].length : 0}</span> 
          <button
          onClick={()=>{dispatch(plusToCart(fullId))}}
          >+</button>
        </div>
        }
        
    
        </div>
      </li>
      </>
    )
}




export default PizzaItem;