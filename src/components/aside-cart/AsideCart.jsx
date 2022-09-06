import './aside-cart.scss';

import { Link, useLocation} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useRef, useState} from 'react';

import { resetAllCart, minusToCart, plusToCart, deletePositionCart } from '../../features/cartSlice';

const AsideCart = ()=>{
  //useLocation это хук, чтобы получить доступ к урл. Мы его будем использовать для условного рендеринга кнопки "оформить"
  const path = useLocation().pathname;
  const cartData = useSelector(state => state.cart.cart);
  const totalCountCart = useSelector(state => state.cart.totalCountCart);
  const totalPriceCart = useSelector(state=>state.cart.totalPriceCart);

//выбрал компонент ЭСАЙД-КАРТ, который пристально следит за РЕДАКС-СТЭЙТОМ корзины.
//когда данные в корзине обновляются, мы бросаем тот объект в локалСторэйдж.
//при этом мы делаем проверку, чтобы при первом монтировании (по умолчанию РЕДАКС-СТЭЙТ обнуляется), наш локалСторэйдж не обновлялся пустым объектом корзины.
//в то же время в картСлайсе мы установим в качестве инициального значения данные с локалСторэйдж, либо, если их нет, то будет просто пустой объект.
//используем юзРеф, поскольку, оказыается, его можно использовать не только для того, чтобы обращаться к ДОМ эелементами, а и для того, чтобы просто хранить мутабельные данные, изменение которых, однако, не вызывает перерендера.
let wasFirstMount = useRef(false);
  useEffect(()=>{
    if(wasFirstMount.current){localStorage.setItem('cart', JSON.stringify(cartData));}
    wasFirstMount.current = true;  
  }, [cartData])
//корзина в локал сторєйдж - сделано
  const dispath = useDispatch();

  const elements = Object.keys(cartData).length === 0 ? 'Корзина пуста' 
  : Object.keys(cartData).reverse().map(item=>{
    const {name, bortName, price, img, id, deleted, extra} = cartData[item][0];
    return (
     <AsideCartItem key={id} name={name} bortName={bortName} price={price} img={img} id={id} deleted={deleted} extra={extra}/>
    )
  })


    return (
        <aside className="aside-cart">
        <div className="aside-cart__header">
          <div className="aside-cart__plusCount">Кошик ({totalCountCart})<span>▼</span></div>
          <div
          onClick={()=>{dispath(resetAllCart())}} 
          className="aside-cart__reset">очистити</div>
        </div>
        {elements}
        <div className="aside-cart__total">Сума замовлення: <span>{totalPriceCart} грн</span></div>
        {/* показываем "оформить заказ в зависимости от страницы" */}
        {path !== '/order' 
        ?
          <Link to="/order"><button className="aside-cart__do-order">Оформити</button></Link>
        :
        null}
        
      </aside>
    )
}

const AsideCartItem = ({bortName, price, img, name, id, deleted, extra})=>{
  const dispatch = useDispatch();
  const cartData = useSelector(state=>state.cart.cart);
  const ingr = useSelector(state=>state.general.ingr);



  //ниже считаем общую сумму по позиции (пицца одного вида с определенным бортиком и определенными добавками в определенном количестве)
  const thisPizzaTotalPrice = price * cartData[id].length;


  //ingr[item][0] ниже - из-за структуры моей базы данных
  const deletedIngr = deleted.map(item=>{
    return (
      <li key={item}>-{ingr[item][0]}</li>
    )
  }) || null;

  const extraIngr = Object.keys(extra).map((item,index)=>{
    return (
     <li key={item+index+1}>+{ingr[item][0]} ({extra[item].length})</li> 
    )}) || null;

  return (
    <div className="aside-cart__item">
    <div className="aside-cart__body">
      <div className="flex"><img src={img} alt="" className="aside-cart__body-pizza-img"/>
        <div className="aside-cart__pizparam-wrap">
          <div className="aside-cart__body-pizza-title">{name}{deleted.length !== 0 || Object.keys(extra).length !== 0  ? <span>(модифікована)</span> : null}</div>
          <div className="aside-cart__body-params">{bortName} борт</div>
          <ul className="aside-cart__body-extra">{extraIngr}</ul>
          <ul className='aside-cart__body-deleteIngr'>{deletedIngr}</ul>
        </div>
      </div>
      <button
      onClick={()=>{dispatch(deletePositionCart(id))}} 
      className="aside-cart__body-delete">✖</button>
    </div>
    <div className="aside-cart__footer">
      <div className="aside-cart__footer-config-count">
        <button 
        onClick={()=>{dispatch(minusToCart(id))}}
        className="aside-cart__min">-</button> 
        <span
          className="aside-cart__count">{cartData[id] ? cartData[id].length : 0}</span> 
        <button
        onClick={()=>{dispatch(plusToCart(id))}}
        className="aside-cart__plus">+</button></div>
      <div className="aside-cart__price">{thisPizzaTotalPrice} грн</div>
    </div>
  </div>
)
}

export default AsideCart;