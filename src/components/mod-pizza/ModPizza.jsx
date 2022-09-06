//ниже импортируем экшен для добавления в редакс-стэйт корзины объекта с модифицированной пиццей
import { addToCart } from '../../features/cartSlice';
//передаем экшен из генерального слайса для открытия-закрытия модального окна
import { goModify } from '../../features/generalSlice';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PizzaNamePlusCaloriesInfo from '../pizzaNamePlusCaloriesInfo/PizzaNamePlusCaloriesInfo';
import AddIngredients from './add-ingredients/AddIngredients';


import './modPizza.scss';


//функция для подсчета суммы всех цен добавленных ингриедиентов (подробнее она расписана в картСлайсе) 
   function totalPriceExtrasSum(state){
    if(Object.keys(state).length === 0){
        return 0;
    }
    let arrWithTotalPrices = Object.keys(state).map(item=>state[item].map(item=>item.price));
    const totalPrice = arrWithTotalPrices.reduce((previousValue, currentValue)=>{
        return previousValue.concat(currentValue)
    }).reduce((a,b)=>a+b);
    return totalPrice;
}

const ModPizza = ()=>{
    //здесь используются бортики, поєтому будем формировать их локально
    const [bortIndex, setBortIndex] = useState(0);
    const [chooseBortPopUp, setChooseBortPopUp] = useState(false);

    //для описания пиццы мы используем числовые обозначения, которые в последствии преобразуем в слова, используя объект из базы данных
    const ingr = useSelector(state=>state.general.ingr);
    //получаем борты
    const borts = useSelector(state=>state.general.borts);

    //используем рефы для реализации паттерна (клик во внешний мир)
    const ref = useRef(null);

    const handleClickOutside = (event) =>{
        if (ref.current && !ref.current.contains(event.target)){
           setChooseBortPopUp(false);
       } 
    }
    
    useEffect(()=>{
      if(chooseBortPopUp){
       document.addEventListener('click', handleClickOutside, {passive:true});
       return ()=>{
           document.removeEventListener('click', handleClickOutside, {passive:true});
       }
      }
    }, [chooseBortPopUp]);
    
    //при создании модификационного модального окна, мы записываем в ГЕНЕРАЛ СТЭЙТ АЙДИ необходимой пиццы (здесь его получаем)
    const modifyId = useSelector(state=>state.general.modifyId);
    //используем этот АЙДИ, чтобы из массива объектов с пиццами, получить массив только лишь с одной необходимой пиццей
    const pizzaData = useSelector(state=>state.general.pizzas).filter(item=>item.id === modifyId);
    //деструктурируем и получаем всю необходимую информацию о пицце для верстки
    const [{id, img, name, price, descr, category, calories, feature, satiety}] = pizzaData;



    //ниже создаем локальный РЕАКТ СТЭЙТ, чтобы сюда помещать ингредиенты, которые удалены. Это отдельная информация, которая будет формировать уникальный АЙДИ для объекта в корзине, а также будет использоваться в верстке последней.
    const [deletedIngr, setDeletedIngr] = useState({});
    //ниже создаем локальный РЕАКТ СТЭЙТ, чтобы сюда помещать ингредиенты, которые ДОБАВЛЕНЫ. Это отдельная информация, которая будет формировать уникальный АЙДИ для объекта в корзине, а также будет использоваться в верстке последней.
    const [extraIngr, setExtraIngr] = useState({});
    //ниже мы также создадим стэйт для счетчика количества пицц, которое мы добавим в корзину
    const [countModPizza, setCountModPizza] = useState(1);

    
    //ниже формируем локальный стэйт удаленных ингредиентов, чтобы потом эту информацию использовать для получения уникального айди и отправить все это дело в стэйт корзины. Здесь после нажатия на триггер определенного ингредиента передается его порядковый номер, который я помещаю в объект. Выбрал объект, потому что с ним проще работать в данном случае. Проще в плане удаления, на первый взгляд, на мой взгляд.
    const formStateWithDeletedIngr = (deletedIngrName)=>{
        //если убираемый порядковый номер уже есть в объекте, то мы это свойство удаляем. Получается фактически ТОГЛ
        if(deletedIngrName in deletedIngr){
            let copyObj = {...deletedIngr};
            delete copyObj[deletedIngrName];
            setDeletedIngr(copyObj);
        } else {
            //иначе мы добавляем новое ключ-значение, соблюдая принципы иммутабельности
            setDeletedIngr({...deletedIngr, [deletedIngrName]: deletedIngrName});
        }
    }
 
    //ниже формируем локальный РЕАКТ СТЭЙТ для хранения добавленых ингредиентов. Формируем с помощью функции, которая будет передваваться в качестве пропсов в нижний компонент (addIngredients), там она будет вызываться, принимать необходимые аргументы, подниматься сюда и возвращать нужный стэйт.
    const formStateWithExtraIngr = (idOfIngr, price) =>{
        setExtraIngr(()=>{
            let copyObj = {...extraIngr};
            if(!copyObj[idOfIngr]){
                copyObj[idOfIngr] = [];
            };
            copyObj[idOfIngr].push({idOfIngr, price: price});
            return copyObj;
        })
    };
    //ниже функция для минусования количества дополнительных ингредиентов
    const minusExtraIngr = (id)=>{
        let copyObj = {...extraIngr};
        if(extraIngr[id] && extraIngr[id].length === 1){
            setExtraIngr(()=>{
                delete copyObj[id];
                return copyObj;
            })  }
        else{setExtraIngr(()=>{
            copyObj[id].pop();
            return copyObj;
        })
            }
    }


   
    
    const dispatch = useDispatch();

    //когда открывается модальное окно, мы будем убирать скролл с основной части сайта. При размонтировании скрол будет снова добавляться.
    useEffect(()=>{
        document.body.style.overflow = 'hidden';
        return ()=>{
            document.body.style.overflow = 'auto';
        }
    }, [])

    //ниже работаем с описанием пиццы (порядковые номера), которое будем перебирать и создавать необходимую нам верстку
    const descrElements = descr.map((item, index, arr)=>{
        //класс даем удаленному элементу в зависимости - есть ли такой ингредиент в объекте удаленных объектов (сорри за формулировку)
        let classForDeletedIngr = '';
        if(item in deletedIngr){
            classForDeletedIngr = 'modal__pizza-deleted';
        }
        return (
        <li id={item}
        //при клике на элемент и будет происходить наполение объекта с удаленными ингредиентами
        onClick={(e)=>{formStateWithDeletedIngr(e.currentTarget.id);}}
            key={item+index} >
            <span className={classForDeletedIngr}>
            {/* ingr[item][0] - из-за структуры моей базы данных */}
            {ingr[item][0]}
            </span>  
            <button>{item in deletedIngr ? '⟳': '✖'}</button>
            {index === arr.length-1 ? null : ', '}
        </li>)
    })

    //ниже работаем со списком добавленных ингредиентов, перебор - создание верстки
    const extraElements = Object.keys(extraIngr).map((item, index, arr)=>{
        return (
            <li key={item+index}>
                <span>{ingr[item][0]} ({extraIngr[item].length})</span>
                <button
                onClick={()=>{setExtraIngr(()=>{
                    let copyObj = {...extraIngr};
                    delete copyObj[item];
                    return copyObj;
                })}}>✖</button>
                {index === arr.length-1 ? null : ','}
            </li> 
        )
    })


    //ниже формируем айди, которое будет создавать в корзине уникальную запись, преобразовываем объект в массив, чтобы можно было сортировать. Сортируем для того, чтобы последовательность всегда была одинаковой. Ведь, если из модального окна в корзину дважды будет добавлена пицца без сыра, то в корзине должен быть только один массив с двумя объектами такой пиццы. То есть запись одна, а количество равное двум. **Все єто из-за того, что порядок свойств объекта при переборе может случайным образом измениться - это ведь объект, а не массив. Поэтому может случиться так, что будут добавлены две одинаковые пиццы с одинаковыми дополнительными ингредиентами, однако получат разные айди. Поэтому сортируем.
    const fullId = id + bortIndex + descr.join('') + Object.keys(deletedIngr).sort((a,b)=>a-b).join('') + Object.keys(extraIngr).sort((a,b)=>a-b).join('') + 
    Object.keys(extraIngr).sort((a,b)=>a-b).map(item=>extraIngr[item].length).join('');
    
    //поскольку у нас есть дополнительные ингредиенты и есть счетчик кол-ва пицц, нам нужно модифицировать цену перед отправкой.
    //я захотел, чтобы при каждом рендеринге не просчитывалась сумма цен всех дополнительных ингредиентов, поэтому сделал зависимость от обновления РЕАКТ СТЭЙТА (объекта с добавленными ингредиентами). Когда в него вносятся изменения, будет происходить пересчет суммы. С одной стороны я сделал то, что хотел. Но, с другой стороны, компонент рендерится теперь два раза, потому что меняется стэйт дополнительных ингредиентов (рендер), затем реакт понимает, что произошли изменения и вызывает юзЭффект, где просчитывается сумма и вновь меняется стэйт, но уже extrasPriceSum (рендер). Надо будет обратить на это еще внимание.
    const [extrasPriceSum, setExtrasPriceSum] = useState(0);
    useEffect(()=>{
        setExtrasPriceSum(totalPriceExtrasSum(extraIngr));
    }, [extraIngr])
    const modPrice = (price + extrasPriceSum + borts[bortIndex].price) * countModPizza;
  
 

   
    return (
        <>
        <div
        className="modal"
        //при клике на подложку тоглится модальное окно
        onClick={()=>{dispatch(goModify())}} >
            <div
            className="modal__pizza"
            //c основного контента мы убираем всплытие и, таким образом, при нажатии на него тогла не будет.
            onClick={(e)=>{e.stopPropagation();}} >
            <div className="modal__pizza-wrapper">
                <div className="modal__pizza-col-one">
                    <img className="modal__pizza-img" src={img} alt="" />
                    <div><strong>Видали інгредієнт на свій смак</strong></div>
                    <ul className="modal__pizza-descr"> 
                        {descrElements.length !== 0 ? descrElements :
                        'Из стандартных ингредиентов осталось только тесто... ;)' }
                    </ul>
                   
                    <div className="modal__pizza-excess-ingr">
                   
                    </div>
                    <div className="modal__pizza-added-ingr">
                </div>
                </div>
                <div className="modal__pizza-col-sec">

                <PizzaNamePlusCaloriesInfo name={name} calories={calories}/>
                    
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

                    <div className="modal__pizza-additionally-ingr">ДОБАВИТЬ ИНГРЕДИЕНТЫ</div>
                    <AddIngredients formStateWithExtraIngr={formStateWithExtraIngr} extraIngr={extraIngr} minusExtraIngr={minusExtraIngr}/>

                    {Object.keys(extraIngr).length ?
                    <>
                    <div style={{marginTop: 10}}><strong>Додано наступні інгредієнти:</strong></div>
                    <ul className="modal__pizza-extra">
                    {extraElements}
                    </ul>
                    </>
                    : null
                    }

                    <span className="modal__pizza-price">{modPrice} грн</span>
                    <div className='pizzablock__countOfPizza'>
                        <button
                        onClick={()=>{countModPizza<=1 ? setCountModPizza(1) : setCountModPizza(countModPizza - 1)  }}
                        >-</button> 
                        <span>{countModPizza}</span> 
                        <button
                        onClick={()=>{setCountModPizza(countModPizza + 1)}}
                        >+</button>
                    </div>

                    <button 
                        //записываем в редакс-стэйт корзины все данные. Обработанный айди и удаленные ингредиенты, которые сперва преобразуем в массив для более удобного в дальнейшем использования. Напомню, что в этом массиве хранятся порядковые номера.
                        //используется цикл для добавления пицц в корзину в соответствии с выбранным пользователем количеством
                        onClick={()=>{for(let i = 1; i <= countModPizza; i++){
                            //ниже в ЦЕНЕ я делю общую цену, которую получил для отображение в этом компоненте, на количество выбранных пицц, чтобы передать в корзину цену как за одну пиццу - чтобы в корзине уже нормально работало увеличение и уменьшение количества
                            dispatch(addToCart({id: fullId, price: modPrice / countModPizza, name, bortName: borts[bortIndex].title, img, deleted:  Object.keys({...deletedIngr}), extra: {...extraIngr}  }))};
                            
                            dispatch(goModify())}} 
                        className="pizzablock__addCart-btn">В корзину</button>
                </div>
            </div>    
            </div>
        </div>
        </>
    )
}

export default ModPizza;