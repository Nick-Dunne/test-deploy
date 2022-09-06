import PizzaList from "../pizza-list/PizzaList";

const Pizzablock = ()=>{
    return (
        <div className="pizzablock" id="pizzablock">
              <h2 сlass="pizzablock__title">Піца</h2>
              <div className="pizzablock__filter-sort">
                <ul className="pizzablock__filter-items">
                  <li className="pizzablock__filter-item">Новинка</li>
                  <li className="pizzablock__filter-item">Вегетерианська</li>
                  <li className="pizzablock__filter-item">З куркою</li>
                  <li className="pizzablock__filter-item">З беконом</li>
                  <li className="pizzablock__filter-item">Більше сиру</li>
                  <li className="pizzablock__filter-item">З грибами</li>
                </ul>
                <div className="pizzablock__sort">Більше фільтрів</div>
              </div>
                  <PizzaList/>             
            </div>
    )
}

export default Pizzablock;