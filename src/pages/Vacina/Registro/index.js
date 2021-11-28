import React, { useState, useEffect } from 'react'
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";

//import { Row, Container, Col, Form, Button, Table } from 'react-bootstrap';

import Menu from '../../../components/menu';
import Alert from '../../../components/alert'

import api from '../../../utils/api';

import "./index.css"

const Registro = () => {
    api.defaults.headers.Authorization = `Bearer ${localStorage.getItem("token")}`

    const [registro, setRegistro] = useState({ data: null, idvacina: null, idregistro: null})
    const [registroList, setRegistroList] = useState([])
    const [vacinaList, setVacinaList] = useState([])
    const [showtable, setShowtable] = useState(false)
    const [idregistro, setIdRegistro] = useState()
    const [alertDiv, setAlertDiv] = useState([])

    const [showModalEditarVacina, setShowModalEditarRegistro] = useState(false)

    const handleShowModalEditarRegistro = (r) => {
        setShowModalEditarRegistro(true)
        setRegistro(r)
    }
    const handleCloseModalEditarRegistro = () => {
        setShowModalEditarRegistro(false)
    }

    const handleUpdateRegistro = async (e) => {
        e.preventDefault()

        await api.put("/registro/registro-update", registro).then((res) => {
            handleCloseModalEditarRegistro()
            setAlertDiv([<Alert tema="success" conteudo="Registro atualizado com sucesso." />])
            loadRegistros()
            setTimeout(() => {setAlertDiv([])},4000)

        }).catch(err => {
            let errors = []
            err.response.data.error.forEach(error => {
                errors.push(<Alert tema="danger" conteudo={error} />)
            })
        })
    }

    const handleRemoveRegistro = async (idregistro) => {
        let data = { idregistro: idregistro }
        await api.delete("registro/registro-delete", { data: data }).then((res) => {
            setAlertDiv([<Alert tema="success" conteudo="Registro removido com sucesso." />])
            loadRegistros()
            setTimeout(() => {setAlertDiv([])},4000)

        }).catch(err => {
            let errors = []
            err.response.data.error.forEach(error => {
                errors.push(<Alert tema="danger" conteudo={error} />)
            })
        })
    }


    const handleAdicionarRegistro = async (e) => {
        e.preventDefault()
        await api.post("/registro/registro-create", registro).then(async (res) => {
            setAlertDiv([<Alert tema="success" conteudo="Registro adicionado com sucesso." />])
            await loadRegistros()
            setTimeout(() => {setAlertDiv([])},4000)

        }).catch(err => {
            let errors = []
            err.response.data.error.forEach(error => {
                errors.push(<Alert tema="danger" conteudo={error} />)
            })
        })
    }

    const loadRegistros = async () => {
        await api.get("/registro/registro-list").then(async (res) => {
            await loadRegistrotable(res.data.registros)
        }).catch(err => {
            let errors = [...err.response.data.error]
        })
    }
    const loadRegistrotable = async (registros) => {
        let registrostable = []
        await registros.forEach(async (registro) => {
            vacinaList.forEach(vacina => {
                if (vacina.idvacina === registro.idvacina) {
                    let r = {
                        idvacina: vacina.idvacina,
                        nomevacina: vacina.nomevacina,
                        idregistro: registro.idregistro,
                        data: registro.data
                    }
                    registrostable.push(r)
                }
            })


        })
        setRegistroList(registrostable)
    }

    const loadVacinas = () => {
        api.get("/vacinas/lista-vacina").then((res) => {
            setVacinaList(res.data.vacinas)
        }).catch(err => {
            let errors = [...err.response.data.error]
        })
    }


    const handleChange = (e) => {
        const value = e.target.value;
        setRegistro({
            ...registro,
            [e.target.name]: value
        })
    }

    const converterData = (d) => {
        let data = d.split("T")[0].split("-")
        return `${data[2]}/${data[1]}/${data[0]}`
    }

    useEffect(() => {
        loadVacinas()

    }, [])

    useEffect(() => {
        loadRegistros()
    }, [vacinaList])

    useEffect(() => {
        setShowtable(true)
    }, [registroList])
    
    return (

        <div>
            <Menu />
            <div className="container" id="adicionar-registro">
                <div className="row">
                    <div className="col-md-12">
                            <form id="adicionar-registro-form" onSubmit={handleAdicionarRegistro}>
                                <label htmlFor="data" className="form-label">Data</label>
                                <input type="date" name="data" className="form-control" value={registro.data} onChange={handleChange} placeholder="Data do registro" />
                                <select aria-label="" name="idvacina" className="form-control" required onChange={handleChange}>
                                    <option disabled selected value="">Selecione uma vacina</option>
                                    {vacinaList.map(vacina => (
                                        <option key={"registro_" + vacina.idvacina} value={vacina.idvacina}>{vacina.nomevacina}</option>
                                    ))}

                                </select>
                                <button className="btn btn-primary" type="submit">Adicionar</button>
                            </form>
                            {alertDiv.map(a => a)}
                            {showtable &&
                                <table id="table-list-registro" >
                                    <thead>
                                        <tr>
                                            <th>ID do registro</th>
                                            <th>Data</th>
                                            <th>Vacina</th>
                                            <th />
                                            <th />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registroList.map((reg) => (
                                            <tr key={"registro_" + reg.idregistro}>
                                                <td>{reg.idregistro}</td>
                                                <td>{converterData(reg.data)}</td>
                                                <td>{reg.nomevacina}</td>
                                                <td><center onClick={() => handleShowModalEditarRegistro(reg)}><FaEdit id="iconTable" /></center></td>
                                                <td><center onClick={() => handleRemoveRegistro(reg.idregistro)}><FaTrashAlt id="iconTable" /></center></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            }
                            {showModalEditarVacina &&

                                <div className="modal">
                                    <div className="modal-content">
                                        <span>
                                            Atualizar Registro
                                            <span onClick={handleCloseModalEditarRegistro} className="close"><ImCross id="icon" /></span>
                                        </span>
                                        <hr />
                                        <form id="update-registro-form" onSubmit={handleUpdateRegistro}>
                                            <label htmlFor="data" className="control-label">Data</label><br />
                                            <input type="date" name="data" className="form-control" value={registro.data} onChange={handleChange} placeholder="Data do registro" />
                                            <select aria-label="" name="idVacina" className="form-control" onChange={handleChange}>
                                                <option disabled selected >Selecione uma vacina</option>
                                                {vacinaList.map(vacina => (
                                                    <option key={"registro_update_" + vacina.idvacina} value={vacina.idvacina}>{vacina.nomevacina}</option>
                                                ))}

                                            </select>
                                            <button className="btn btn-primary" type="submit">Salvar</button>
                                        </form>
                                    </div>

                                </div>
                                }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registro
