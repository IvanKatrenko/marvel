
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AppHeader from "../AppHeader/AppHeader";
import { MainPage, ComicsPage, Page404, SingleComicPage } from '../pages';

const App = () => {



    return (
        <Router>
            <div className="app">
                <AppHeader />
                <main>

                    <Routes>
                        {/* начало первой страницы */}
                        <Route path="/" element={
                            <>
                                <MainPage />
                            </>
                        }>
                        </Route>
                        {/* начало второй страницы */}
                        <Route path="/comics"
                            element={<ComicsPage />}>
                            <Route path="/comics/:comicId"
                                element={<SingleComicPage />} />
                        </Route>

                        <Route path='*' element={
                            <>
                                <Page404 />
                            </>
                        }>
                        </Route>

                    </Routes>

                </main>
            </div>
        </Router>
    )

}

export default App;