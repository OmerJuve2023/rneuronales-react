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
    const [itemsPerPage] = useState(7);
    const totalPages = currentPage === Math.ceil(data.length / itemsPerPage);

    const currentElements = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }
    const process = () => {
        const tiempoActual = Date.now() / 10; // convertir a milisegundos
        const tiempoUltimaPulsacion = pulsaciones.length > 0 ? pulsaciones[pulsaciones.length - 1] : tiempoActual;
        const tiempoEntrePulsacion = tiempoActual - tiempoUltimaPulsacion;
        console.log(tiempoEntrePulsacion);
        setpulsaciones([...pulsaciones, tiempoActual]);
        setTimeBeats([...timeBeats, tiempoEntrePulsacion]);
    };

    const saveTime = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:3009/api/tiempo", {
            t1: timeBeats[1],
            t2: timeBeats[2],
            t3: timeBeats[3],
            t4: timeBeats[4],
            t5: timeBeats[5],
            t6: timeBeats[6],
            t7: timeBeats[7],
            t8: timeBeats[8],
            clave: clave,
            fecha: new Date().toISOString().split("T")[0]
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
        console.log(new Date().toISOString().split("T")[0])
        axios.get("http://localhost:3009/api/tiempo")
            .then(response => setData(response.data))
            .catch(error => console.log(error));
    }, [])
    data.sort((a, b) => b.codigo - a.codigo);
    return (

        <div className={"container"}>
            <h2 className={"text-center m-4"}>Registrar DNI</h2>
            <div className={"mb-3"}>
                <label htmlFor="Clave" className={"form-label"}></label>
                <input className={"form-control"}
                       maxLength={8}
                       placeholder={"escriba DNI de 8 digitos"}
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
                <table className="table table-bordered rounded border shadow table-striped">
                    <thead className={"table-danger"}>
                    <tr>
                        <th scope={"cols"}>ID</th>
                        <th scope={"cols"}>DNI</th>
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
                                {/*<td>{parseFloat(t.t2).toFixed(2)}</td>*/}
                                <td>{t.t1}</td>
                                <td>{t.t2}</td>
                                <td>{t.t3}</td>
                                <td>{t.t4}</td>
                                <td>{t.t5}</td>
                                <td>{t.t6}</td>
                                <td>{t.t7}</td>

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