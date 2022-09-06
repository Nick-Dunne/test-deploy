import './order.scss';

import SelfServiceForm from './order-forms/SelfServiceForm';
import DeliveryForm from './order-forms/DeliveryForm';

import {useState, useEffect} from 'react';

const Order = ()=>{
    useEffect(()=>{
        //ниже из нативного джс, поднимает страницу вверх при монтировании (надо, когда переходим с других роутов)
    window.scrollTo(0, 0);
    }, [])

    const [isDelivery, setIsDelivery] = useState(true);
    return (
        <>
        <h2>Оформлення замовлення</h2>

        <div className="order__way-to-get">
            <button 
            onClick={()=>{setIsDelivery(true)}}
            className={isDelivery ? 'way-to-get--active' : ''}>Доставка</button>
            <button 
            onClick={()=>{setIsDelivery(false)}}
            className={isDelivery ? 'order__self-service' : 'order__self-service way-to-get--active'}>Самовывоз</button>
        </div>
        {/* дальше будет условный рендеринг */}
        {isDelivery ? <DeliveryForm/> : <SelfServiceForm/>}

        </>
    )
}


export default Order;