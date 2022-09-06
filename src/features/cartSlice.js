import { createSlice } from "@reduxjs/toolkit";

//изначально продумали логику РЕДАКС-СТЄЙТА для корзины
//сама корзина представляет собой объект, в котором ключи - уникальные АЙДИШНИКИ, а значения - массивы, в которые помещаются объекты. Каждый объект - это одна единица одной и той же пиццы под одним и тем же АЙДИ.
//ниже в инициализации я изначльно пытаюсь брать данные из локалСторэйдж (лога в ЭсайдКарде)
const initialState = {
    cart: JSON.parse(localStorage.getItem('cart')) || {},
    totalCountCart: totalCountCart(JSON.parse(localStorage.getItem('cart')) || {}),
    totalPriceCart: totalPriceCart(JSON.parse(localStorage.getItem('cart')) || {}),
}

function totalCountCart(cart){
    //нижнее условие - это проверка во избежание ошибки. Если последний ключ удален из корзины, то вернет 0.
    if(Object.keys(cart).length === 0){
        return 0;
    }
    //тут у нас задача получить общее количество пицц (єлементов) под всеми АЙДИ. Для этого мы создаем массив, который содержит в себе совокупность длин всех массивов, который находятся в каждом свойстве под отдельным АЙДИ.
    let arrWithLength = Object.keys(cart).map(item=>cart[item].length);
    //А ниже мы суммируем все значения массива и возвращаем то, что нам нужно
    let totalCount =  arrWithLength.reduce((previousValue, currentValue)=>{
        return +previousValue + +(currentValue)
    })
    return totalCount;
}

function totalPriceCart(cart){
    //нижнее условие - это проверка во избежание ошибки. Если последний ключ удален из корзины, то вернет 0.
    if(Object.keys(cart).length === 0){
        return 0;
    }
    //здесь мы хотим собрать все цены и просуммировать их, чтобы получить общую сумму по корзине
    //ниже мы перебиаем массив ключей объекта, чтобы получить доступ к его значениями (массивам с объектами)
    //как итог - arrWithTotalPrices принимает массивм массивов в ценами, которые нам нужно просуммировать
    let arrWithTotalPrices = Object.keys(cart).map(item=>cart[item].map(item=>item.price));
    //ниже суммируем массив массивов, используя пример из документации по reduce. Возвращаем сумму.
    const totalPrice = arrWithTotalPrices.reduce((previousValue, currentValue)=>{
        return previousValue.concat(currentValue)
    }).reduce((a,b)=>a+b);
    return totalPrice;
}

//создаем слайс-срез
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            //тут нам нужно будет грамотно - под себя сформировать структуру корзины
            const {bortName, price, id, name, img, deleted, extra} = action.payload;
            //если в корзине еще нет свойства с ключем в качестве приходяшего АЙДИ, то мы его создаем. Если есть, то условие игнорируется. И в первом, и во втором случае код идет дальше.
            if(!state.cart[id]){
                state.cart[id] = []
            }
            //пушим данные. Используется иммер, поэтому принципы иммутабельности не соблюдаются.
            state.cart[id].push({bortName, price, name, img, id, deleted, extra});

            //разумеется, что после каждого дополнения в корзину - нам нужно пересчитать общую сумму и общее количество заказанного товара, вывызываем функции, которые вынес за слайс-срез ВЫШЕ.
            state.totalCountCart = totalCountCart(state.cart);
            state.totalPriceCart = totalPriceCart(state.cart);
            },
      
            //ниже мы очищаем корзину полностью
        resetAllCart: (state)=>{
            state.cart = {};
            state.totalCountCart = 0;
            state.totalPriceCart = 0;
        },

        //плюсуем в корзину
        plusToCart: (state, action)=>{
            const id = action.payload;
            //плюсовать априори можно только тогла, когда товар уже есть в корзине, а значит есть соответствующий ключ (свойство).
            //мы просто создаем копию первой пиццы (объекта), которая хранится в массиве под соответствующем АЙДИ, а затем эту копию ПУШИМ в этот самый массив. Используем поверхностное копирование, потому что нет вложенности.
            const copy = Object.assign({}, state.cart[id][0]);
            state.cart[id].push(copy);
            
            //после изменений пересчитываем общую сумму и общее количество заказанного товара
            state.totalCountCart = totalCountCart(state.cart);
            state.totalPriceCart = totalPriceCart(state.cart);
        },

        minusToCart: (state, action)=>{
            const id = action.payload;
            //ниже делаем проверку во избежание ошибки, скажем, что если минусовать уже некуда (1), то будет удалять целое свойство, т.е. ключ по АЙДИ из СТЭЙТА корзины. Если же минусовать есть куда, то просто убираем последнюю единицу из массива.
            if(state.cart[id].length === 1){
                delete state.cart[id];
            }
            else{state.cart[id].pop();}

           
            //после изменений пересчитываем общую сумму и общее количество заказанного товара
            state.totalCountCart = totalCountCart(state.cart);
            state.totalPriceCart = totalPriceCart(state.cart);
          },

        deletePositionCart: (state, action) => {
            //здесь удаляем целое свойство по айди
            const id = action.payload;
            delete state.cart[id];
            
            //после изменений пересчитываем общую сумму и общее количество заказанного товара
            state.totalCountCart = totalCountCart(state.cart);
            state.totalPriceCart = totalPriceCart(state.cart);
        }

    }
})

//экспортируем экшены
export const {addToCart, resetAllCart, plusToCart, minusToCart, deletePositionCart} = cartSlice.actions;

//ниже экспортируем редъюсер, чтобы использовать его для формирования стора
export default cartSlice.reducer;