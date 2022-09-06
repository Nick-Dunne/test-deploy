import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
    borts:{},
    catOfIngred: {},
    ingr: {},
    pizzas: [],
    pizzaLoadingStatus: 'loading',
    //ниже свойство отвечает за вызов модального окна БУЛИН
    modify: false,
    //сюда будет передаваться АЙДИ пиццы, которую будем модифицировать, чтобы уже потом работать с необходимым объектом пиццы из БД
    modifyId: null
}

//выносим логику за пределы View. Делаем запрос на сервер для получения контента - пицц и ниже ингредиентов.
//к слову, в этих асинхронных ТХАНКАХ можно вызывать ДИСПАТЧ (взаимосвязь с другими срезами-слайсами)
export const fetchPizza = createAsyncThunk(
    //ниже название среза/название экшена
    'general/fetchPizza',
    async ()=>{
       const response = await fetch('http://localhost:4000/pizzas')
        .then(res=>res.json())
        //ниже сделали КЕТЧ, потому что без него у промиса ниже не случится РЕДЖЕКТЕД
        .catch(e=> {throw new Error('Ошибка fetch pizzas')})
   
        return response;
    }
) 

export const fetchBorts = createAsyncThunk(
    'general/fetchBorts',
    async ()=>{
        const response = await fetch('http://localhost:4000/borts')
        .then(res=>res.json())
        .catch(e=>{throw new Error('Ошибка fetch borts')})
       
        return response;
    }
)

export const fetchIngr = createAsyncThunk(
    'general/fetchIngr',
    async ()=>{
        const response = await fetch('http://localhost:4000/ingr')
        .then(res=>res.json())
        .catch(e=>{throw new Error('Ошибка fetch ingr')})
       
        return response;
    }
)
export const fetchCatOfIngred = createAsyncThunk(
    'general/fetchCatOfIngred',
    async ()=>{
        const response = await fetch('http://localhost:4000/catOfIngred')
        .then(res=>res.json())
        .catch(e=>{throw new Error('Ошибка fetch catOfIngred')})
       
        return response;
    }
)

const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
    goModify: (state, action)=>{
        //принципы иммутабельности можем не соблюдать, потому что помогает встроенный ИММЕР
        //action.payload - это полезная нагрузка, все, что передается при диспатчинге экшена
        state.modify = !state.modify;
        state.modifyId = action.payload;
    }
    },
    //для проработки асинхронных экшенов и нужен экстраредъюсер
    //синтаксис любопытный
    extraReducers: (builder) =>{
        builder
        .addCase(fetchBorts.fulfilled, (state, action)=>{
            state.borts = action.payload;
        })
        .addCase(fetchCatOfIngred.fulfilled, (state, action) => {
            state.catOfIngred = action.payload;
        })
        .addCase(fetchIngr.fulfilled, (state, action)=>{
            state.ingr = action.payload;
        })
        .addCase(fetchPizza.pending, state => {state.pizzaLoadingStatus = 'loading'})
        .addCase(fetchPizza.fulfilled, (state, action) => {
            state.pizzas = action.payload;
            state.pizzaLoadingStatus = 'idle';
        })
        .addCase(fetchPizza.rejected, state => {
            state.pizzaLoadingStatus = 'error'
        })
        
    }
})

//экспортируем обычные экшены
export const {goModify} = generalSlice.actions;

//ниже экспортируем редъюсер, чтобы использовать его для формирования стора
export default generalSlice.reducer;