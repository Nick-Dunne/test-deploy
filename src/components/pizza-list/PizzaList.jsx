import PizzaItem from "../pizza-item/PizzaItem";

//это скелетон, заглушка, которая будет показываться, когда асинхронный экшен (его промис) будет в состоянии ожидания (генералСлайс)
import Skeleton from "../skeleton/Skeleton";

//асинхронные экшены для получения из базы данных пицц и списка ингредиентов
import { fetchPizza, fetchIngr, fetchBorts } from "../../features/generalSlice";


import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";


const PizzaList=()=>{

 const dispatch = useDispatch();
  //при первом монтировании компонента будут произведены запросы
  useEffect(()=>{
    dispatch(fetchBorts());
    dispatch(fetchIngr());
    dispatch(fetchPizza());
    //ниже из нативного джс, поднимает страницу вверх при монтировании (надо, когда переходим с других роутов)
    window.scrollTo(0, 0);
  }, []);

  //эта переменная из генерального среза будет помогать нам понять, что показывать и как прошел запрос. Толи запрос прошел успешно и выводить списки, толи идет ожидание - скелетон, толи ошибка - ошибка.
  const pizzaLoadingStatus = useSelector(state=>state.general.pizzaLoadingStatus);
  //ниже сам массив с объектами (пиццами)
  const data = useSelector(state => state.general.pizzas)
  

  //если загрузка, то скелетое
  if(pizzaLoadingStatus === 'loading'){
    return (
        <div className="pizzablock__pizza">
        <ul className="pizzablock__pizza-items">
        <Skeleton/><Skeleton/><Skeleton/><Skeleton/><Skeleton/><Skeleton/>
       </ul>
        </div>)
  }
  //если ошибка - ошибка
  else if(pizzaLoadingStatus === 'error'){
    return 'Произошла неизвестная ошибка, попробуйте зайти на сайт позже'
  }
  //два return выше закончат выполнение функции, если нет, то формируем пицца-айтемы, передавая в соответствующие компоненты пропсы в виде объекта с данными конкретной пиццы
  const items = data.map((item,index)=>{
    return <PizzaItem key={data[index].id} info={data[index]}/>
  })


  return (
    <div className="pizzablock__pizza">
        <ul className="pizzablock__pizza-items">
            {items}
    </ul>
    </div>
  )

}

export default PizzaList;