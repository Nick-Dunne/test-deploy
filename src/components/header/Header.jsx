
const Header = ()=>{


    return (
        <header>
        <div className="container">
          <div className="header__wrapper">
            <div><a href="tel:+38 099 3965 777">+38 099 3965 777</a> 
            <span className="header__city"
                aria-hidden="true">Добропілля</span></div>
            <ul className="header__menu">
              <li>Акції</li>
              <li>Блог</li>
              <li>Про нас</li>
              <li>Робота</li>
            </ul>
            <div><button 
                  className="header__enter">Вхід</button> <button className="header__lang">Ua</button></div>
          </div>
        </div>
      </header>
    )
}

export default Header;