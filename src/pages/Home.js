import React, {useEffect, useState} from "react";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";


const Home = () => {

    const [data, setData] = useState([]);
    const [clave, setClave] = useState("");

    const [pulsaciones, setpulsaciones] = useState([]);
    const [timeBeats, setTimeBeats] = useState([]);

    /*Paginado de la Tabla*/
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const totalPages = currentPage === Math.ceil(data.length / itemsPerPage);

    const currentElements = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }
    const process = () => {
        const tiempoActual = Date.now() / 1000; // convertir a segundos
        const tiempoUltimaPulsacion = pulsaciones.length > 0 ? pulsaciones[pulsaciones.length - 1] : tiempoActual;
        const tiempoEntrePulsacion = tiempoActual - tiempoUltimaPulsacion;
        console.log(tiempoEntrePulsacion);
        setpulsaciones([...pulsaciones, tiempoActual]);
        setTimeBeats([...timeBeats, tiempoEntrePulsacion]);
    };

    const saveTime = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:3009/api/tiempo", {
            t1: timeBeats[0],
            t2: timeBeats[1],
            t3: timeBeats[2],
            t4: timeBeats[3],
            t5: timeBeats[4],
            t6: timeBeats[5],
            t7: timeBeats[6],
            clave: clave,
            fecha: new Date().getTime()
        });
        window.location.reload();
    }
    const handleInputChange = (event) => {
        setClave(event.target.value);
    }

    async function handleExportClick() {
        try {

            const url = "http://localhost:3009/api/tiempo/exportCSV";
            const rpta = await axios.get(url, {responseType: "blob"});
            const archivo = new Blob([rpta.data], {type: "text/csv;charset=utf-8;"});
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(archivo);
            link.download = "data.csv";
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.removeChild(link)
        } catch (err) {
            console.log(err.error())
        }
    }

    useEffect(() => {
        axios.get("http://localhost:3009/api/tiempo")
            .then(response => setData(response.data))
            .catch(error => console.log(error));
    }, [])
    data.sort((a, b) => b.codigo - a.codigo);
    return (
        <div className={"container"}>
            <h2 className={"text-center m-4"}>Registrar Clave</h2>

            <div className={"mb-3"}>
                <label htmlFor="Clave" className={"form-label"}></label>
                <input className={"form-control"}
                       maxLength={8}
                       placeholder={"escriba la clave de 8 digitos"}
                       type="text"
                       id={"txtClave"}
                       name={"clave"}
                       value={clave}
                       onChange={handleInputChange}
                       onKeyDown={process}
                />
            </div>
            <button className={"btn btn-outline-danger mx-3 text-dark"}
                    onClick={saveTime}>Guardar
            </button>

            <div><br/></div>

            <div className={"py-4"}>
                <table className="table border shadow table-striped">
                    <thead className={"table-danger"}>
                    <tr>
                        <th scope={"cols"}>DNI</th>
                        <th scope={"cols"}>Clave</th>
                        <th scope={"cols"}>Fecha</th>
                        <th scope={"cols"}>T1</th>
                        <th scope={"cols"}>T2</th>
                        <th scope={"cols"}>T3</th>
                        <th scope={"cols"}>T4</th>
                        <th scope={"cols"}>T5</th>
                        <th scope={"cols"}>T6</th>
                        <th scope={"cols"}>T7</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        currentElements.map((t) => (
                            <tr>
                                <td><b>{t.codigo}</b></td>
                                <td>{t.clave}</td>
                                <td>{t.fecha}</td>
                                <td>{parseFloat(t.t1).toFixed(2)}</td>
                                <td>{parseFloat(t.t2).toFixed(2)}</td>
                                <td>{parseFloat(t.t3).toFixed(2)}</td>
                                <td>{parseFloat(t.t4).toFixed(2)}</td>
                                <td>{parseFloat(t.t5).toFixed(2)}</td>
                                <td>{parseFloat(t.t6).toFixed(2)}</td>
                                <td>{parseFloat(t.t7).toFixed(2)}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                <br/>
                <div className={"pagination"}>
                    <Pagination.First disabled={currentPage === 1}
                                      onClick={() => handlePageChange(1)}/>
                    <Pagination.Prev disabled={currentPage === 1}
                                     onClick={() => handlePageChange(currentPage - 1)}/>
                    {Array.from({length: totalPages}, (_, index) => (
                        <Pagination.Item key={index} active={index + 1 === currentPage}
                                         onclick={() => handlePageChange(currentPage + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next disabled={currentPage === totalPages}
                                     onClick={() => handlePageChange(currentPage + 1)}/>
                    <Pagination.Last disabled={currentPage === totalPages}
                                     onClick={() => handlePageChange(totalPages)}/>
                </div>

                <button className={"btn btn-outline-primary mx-3 text-dark"}
                        onClick={handleExportClick}
                >Exportar CSV
                </button>
            </div>
        </div>
    );
}

export default Home;