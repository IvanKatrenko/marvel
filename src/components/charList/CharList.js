// import { Component } from 'react';
// import PropTypes from 'prop-types';

// import Spinner from '../spinner/Spinner';
// import ErrorMessage from '../errorMessage/ErrorMessage';
// import MarvelService from '../../services/MarvelService';
// import './charList.scss';

// class CharList extends Component {

//     state = {
//         charList: [],
//         loading: true,
//         error: false,
//         newItemLoading: false,
//         offset: 210,
//         charEnded: false
//     }

//     marvelService = new MarvelService();

//     componentDidMount() {
//         this.onRequest();
//     }

//     onRequest = (offset) => { // onRequest отвечает за запрос на сервер, мы его первый раз вызываем когда компанент отрендерился
//         this.onCharListLoading();
//         this.marvelService.getAllCharacters(offset)
//             .then(this.onCharListLoaded)
//             .catch(this.onError)
//     }

//     onCharListLoading = () => {
//         this.setState({
//             newItemLoading: true
//         })
//     }


//     onCharListLoaded = (newCharList) => { // это метод который отвечает за успешную загрузку
//         let ended = false;
//         if (newCharList.length < 9) {
//             ended = true;
//         }

//         this.setState(({ offset, charList }) => ({
//             charList: [...charList, ...newCharList],
//             loading: false,
//             newItemLoading: false,
//             offset: offset + 9,
//             charEnded: ended //фунукционал по дозогрузки

//         }))
//     }

//     onError = () => {
//         this.setState({
//             error: true,
//             loading: false
//         })
//     }

//     itemRefs = [];

//     setRef = (ref) => {
//         this.itemRefs.push(ref);
//     }

//     focusOnItem = (id) => {
//         // Я реализовал вариант чуть сложнее, и с классом и с фокусом
//         // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
//         // На самом деле, решение с css-классом можно сделать, вынеся персонажа
//         // в отдельный компонент. Но кода будет больше, появится новое состояние
//         // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

//         // По возможности, не злоупотребляйте рефами, только в крайних случаях
//         this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
//         this.itemRefs[id].classList.add('char__item_selected');
//         this.itemRefs[id].focus();
//     }

//     // Этот метод создан для оптимизации, 
//     // чтобы не помещать такую конструкцию в метод render
//     renderItems(arr) { // наш интерфейс
//         const items = arr.map((item) => {
//             let imgStyle = { 'objectFit': 'cover' };
//             if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
//                 imgStyle = { 'objectFit': 'unset' };
//             }

//             return (
//                 <li
//                     className="char__item"
//                     tabIndex={0}
//                     ref={this.setRef}
//                     key={item.id}
//                     onClick={() => {
//                         this.props.onCharSelected(item.id);
//                         this.focusOnItem(i);
//                     }}
//                     onKeyPress={(e) => {
//                         if (e.key === ' ' || e.key === "Enter") {
//                             this.props.onCharSelected(item.id);
//                             this.focusOnItem(i);
//                         }
//                     }}>
//                     <img src={item.thumbnail} alt={item.name} style={imgStyle} />
//                     <div className="char__name">{item.name}</div>
//                 </li>
//             )
//         });
//         // А эта конструкция вынесена для центровки спиннера/ошибки
//         return (
//             <ul className="char__grid">
//                 {items}
//             </ul>
//         )
//     }

//     render() {

//         const { charList, loading, error, offset, newItemLoading, charEnded } = this.state;

//         const items = this.renderItems(charList);

//         const errorMessage = error ? <ErrorMessage /> : null;
//         const spinner = loading ? <Spinner /> : null;
//         const content = !(loading || error) ? items : null;

//         return (
//             <div className="char__list">
//                 {errorMessage}
//                 {spinner}
//                 {content}
//                 <button
//                     className="button button__main button__long"
//                     disabled={newItemLoading}
//                     style={{ 'display': charEnded ? 'none' : 'block' }}
//                     onClick={() => this.onRequest(offset)}>
//                     <div className="inner">load more</div>
//                 </button>
//             </div>
//         )
//     }
// }

// CharList.propTypes = {
//     onCharSelected: PropTypes.func.isRequired
// }

// export default CharList;

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
        // eslint-disable-next-line
    }, [])//когда оставляем пустой массив то функция выполниться только один раз при создании жлемента

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)

    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]); // пустой массив

    const focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;