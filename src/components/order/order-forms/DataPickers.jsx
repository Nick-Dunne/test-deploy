import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { addDays, setHours, setMinutes }from 'date-fns';

import {useState} from 'react';

import "react-datepicker/dist/react-datepicker.css";


const Time = ({timeUa}) => {
    //ниже - это изначально указанное в окне время
    
    const [startDate, setStartDate] = useState(
        timeUa
    );

    //делаем функцию, которая будет возвращать минимальное время (все другое время будет неактивно)
    //делаем проверку, что если текущий час по Киеву совпадает с нерабочим часом, то возвращается 10-00, иначе вернет текущее время и от него будет отталкиваться для определения минимального.
    const minTime = (timeUa)=>{
        if([18,19,20,21,22,23,24,0,1,2,3,4,5,6,7,8,9].filter(item=>item===startDate.getHours()).length !== 0){
            return setHours(setMinutes(new Date(), 0), 10);
        }
        return timeUa;
    } 
   //ниже настройки из ДОКУМЕНТАЦИИ
    return (
      <DatePicker
        locale='uk'
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        minTime={minTime(timeUa)}
        maxTime={setHours(setMinutes(new Date(), 30), 17)}
        dateFormat="p"
        
      />
    );
  };

  const Day = ({timeUa}) => {
    const [startDate, setStartDate] = useState(null);
    
    return (
      <DatePicker
        locale='uk'
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        minDate={timeUa}
        maxDate={addDays(timeUa, 5)}
        placeholderText="Сьогодні"
      />
    );
  };

  export {Time, Day};