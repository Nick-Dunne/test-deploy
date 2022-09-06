import Header from '../components/header/Header';
import Postheader from '../components/postheader/Postheader';
import Main from '../pages/Main';


import Pizzablock from '../components/pizzablock/Pizzablock';
import ModPizza from '../components/mod-pizza/ModPizza';
import Order from '../components/order/Order';

import {useSelector} from 'react-redux';
import {Routes, Route} from 'react-router-dom';


function App  () {

  const modify = useSelector(state=>state.general.modify);

  return (
    <>
    <Header/>
    <Postheader/>

    <Routes>
      {/* ниже говорим, что главный роут - ведет на страницу Main, на этой странице есть подроутинг (Оутлет). index - корень, будет рендерить пиццаблок./order - рендерим - Order. Но все в рамках МЭЙН, справа будет корзина. */}
      <Route path="/" element={<Main/>}>
        <Route index element={<Pizzablock/>}/>
        <Route path="order" element={<Order/>}/>
      </Route>

    {/*   если ничего не подошло - выбрасываем 404*/}
      <Route path="*" element={<h1>404</h1>}/> 
    </Routes>

      
    {modify ? <ModPizza/> : null}
    </>
  );
}

export default App;
