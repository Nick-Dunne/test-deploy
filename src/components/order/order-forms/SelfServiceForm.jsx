import {useState, useEffect} from 'react';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { setHours, setMinutes }from 'date-fns';
import uk from 'date-fns/locale/uk';
import "react-datepicker/dist/react-datepicker.css";

import {useSelector} from 'react-redux';

import {Day, Time} from './DataPickers'




const SelfServiceForm = ()=>{
    //получим конечную стоимость для отображения перед кнопкой заказа
    const totalPrice = useSelector(state=>state.cart.totalPriceCart);
     //если эсФаст тру, значит доставка нужна как можно быстрее, иначе - на конкретное время и дату - появляется соответствующие инпуты (опять же условный рендеринг)
     const [isAsFast, setIsAsFast] = useState(true);

    //ниже решение такое себе...
    //ниже таймЮА - по умолчанию сделал его как время открытия заведения. Здесь у нас создается новый экземпляр объекта ДАТА с кастомными часами и минутами.
    //формат такой: Sun Sep 04 2022 15:45:00 GMT+0300 (Восточная Европа, летнее время)
    //такое поведение понадобится в компонентах РЕАКТ-ДАТАПИКЕРА
    const [timeUa, setTimeUa] = useState(setHours(setMinutes(new Date(), 0), 10))

    //ниже при монтировании компонента я делаю запрос, чтобы получить время по Киеву.
    //получаю объект в ключе DATETIME которого хранится значение: '2022-09-04T13:59:56.063025+03:00'
    //однако РЕАКТ-ДАТАПИКЕР работает, только с таким форматом Sun Sep 04 2022 15:45:00 GMT+0300 (Восточная Европа, летнее время)
    //поєтому мы снова обращаемся к конструтору ДАТЫ и записываем необходимое значение в СТЭЙТ. Теперь изначально указанное время- текущее время.
    //записіваю в СТЭЙТ этого компонента, чтобы затем ПРОПСАМИ передать его в два компонента РЕАКТ-ДАТАПИКЕРА (ТАЙМ и ДЭЙТ)
    useEffect(()=>{
        fetch('http://worldtimeapi.org/api/timezone/Europe/Kiev')
        .then(res=>res.json())
        .then(res=>setTimeUa(new Date(res.datetime)));

        //ниже при монтировании компонента зарегистрировал украинскую локализацию для РЕАКТ-ДАТАПИКЕРА
        registerLocale('uk', uk)
        setDefaultLocale('uk')
    }, [isAsFast])
    //выше решение такое себе...


   

    //далее функционад для понимания - нужно ли перезванивать
    const [wishCall, setWishCall] = useState(true);


    
   

    return (
        <form className="delivery" action="">
            <fieldset className="delivery__contact-fieldset">
            <legend className="delivery__contact-legend">Контактна інформація</legend>
            <input className="delivery__contact-name" name="name" type="text" placeholder="Ім'я"/>
            <input className="delivery__contact-phone" name="phone" type="text" placeholder="Телефон"/>
            </fieldset>


            <fieldset className="delivery__data-fieldset">
                <label className="delivery__data-legend">Час та дата</label>
                <div className="delivery__data-choose-wrapper">
                    {/* использую ниже условный рендеринг для того, чтобы отмечать активный выбор */}
                    <div 
                    onClick={()=>{setIsAsFast(true)}}
                    className='asFast'><span className={isAsFast ? 'custom-radio checked': 'custom-radio'}></span>Якомога швидше</div>
                    <div 
                    onClick={()=>{setIsAsFast(false)}}
                    className='onTheData'><span className={isAsFast ? 'custom-radio' : 'custom-radio checked'}></span>На певний час / дату</div>
                </div>
                {isAsFast 
                ?
                <p style={{marginTop: '15px'}}>*Ми намагатимося привезти ваше замовлення настільки швидко, наскільки це можливо з урахуванням актуальної черги.</p>
                :
                <div style={{marginTop:'15px', display: 'flex'}}>
                <Time timeUa={timeUa}/> 
                <Day timeUa={timeUa}/>
                </div>
                }
            </fieldset>

            <fieldset className="order__add-fieldset">
                <label className='order__add-label'>Додаткова інформація</label>
                <p style={{marginTop: '15px'}}>Передзвонити для уточнення замовлення?</p>
                <div className="delivery__data-choose-wrapper">
                    {/* использую ниже условный рендеринг для того, чтобы отмечать активный выбор */}
                <div 
                    onClick={()=>{setWishCall(true)}}
                    className='asFast'><span className={wishCall ? 'custom-radio checked': 'custom-radio'}></span>Так</div>
                <div 
                    onClick={()=>{setWishCall(false)}}
                    className='onTheData'><span className={!wishCall ? 'custom-radio checked': 'custom-radio'}></span>Ні</div>
                </div>
                <p style={{marginTop: '15px'}}>Коментар</p>
                <textarea className='order__comments' name="comments" placeholder='залиште повідомлення у цьому текстовому полі, якщо бажаєте...'></textarea>
            </fieldset>
            <div className="order__form-totalPrice">Всього до сплати {totalPrice} грн</div>
            <button 
            onClick={(e)=>{e.preventDefault();}}
            className="order__submit-btn">Подтвердить заказ</button>
        </form>
    )
}



export default SelfServiceForm;