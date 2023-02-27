import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
    return (
        <div className="App">
            <header></header>
            <div><br/></div>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                </Routes>
            </BrowserRouter>
            <footer></footer>
        </div>
    );
}

export default App;
