import { configureStore } from "@reduxjs/toolkit";
import general from '../features/generalSlice';
import cart from '../features/cartSlice';

//для создания СТОРА РЕДАКСА-тулкита обычно создают отдельный файл
const store = configureStore({
    //указаны все наши редъюсеры, которые я разделил на разные слайсы-срезы для удобства
    reducer: {general, cart},
    //поднимаем все родные мидлВары. Хотя бы для тех же асинхронных экшенов.
    middleware: getDefaultMiddleware => getDefaultMiddleware()
})

export default store;