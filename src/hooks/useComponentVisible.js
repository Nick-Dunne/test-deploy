//этот собственный хук мы не использовали напрямую, но здесь прописан хороший паттерн

import {useState, useEffect, useRef} from 'react';

export default function useComponentVisible(initialIsVisible){
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = (event) =>{
        if (ref.current && !ref.current.contains(event.target)){
            setIsComponentVisible(false);
        }
    }

    useEffect(()=>{
        document.addEventListener('click', handleClickOutside, {passive:true});
        return ()=>{
            document.removeEventListener('click', handleClickOutside, {passive:true});
        }
    }, []);

    return {ref, isComponentVisible, setIsComponentVisible};
}