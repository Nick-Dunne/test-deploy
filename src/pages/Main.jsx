
import AsideCart from "../components/aside-cart/AsideCart";

import {Outlet} from 'react-router-dom';

import { useEffect } from "react";

const Main = ()=>{




    return (
        <section className="main">
        <div className="container">
          <div className="main-block">
            {<Outlet/>}
          </div>
          <AsideCart/>
        </div>
      </section>
    )
}

export default Main;