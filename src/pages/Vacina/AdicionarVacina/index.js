import React, { useState, useEffect } from 'react'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { ImCross } from "react-icons/im"

//import { Row, Container, Col, Form, Button, Table } from 'react-bootstrap';

import Alert from '../../../components/alert'
import Menu from '../../../components/menu'

import api from '../../../utils/api';

import "./index.css"

const AdicionarVacina = () => {
    api.defaults.headers.Authorization = `Bearer ${localStorage.getItem("token")}`

    const [vacina, setVacina] = useState({ nomevacina: "" })
    const [vacinaList, setVacinaList] = useState([])
    const [showModalEditarVacina, setShowModalEditarVacina] = useState(false)
    const [idvacina, setIdVacina] = useState()
    const [alertDiv, setAlertDiv] = useState([])

    const handleShowModalEditarVacina = (v) => {
        setShowModalEditarVacina(true)
        setIdVacina(v)
    }
    const handleCloseModalEditarVacina = () => {
        setShowModalEditarVacina(false)
    }

    const handleUpdateVacina = async (e) => {
        e.preventDefault()
        let data = {
            idvacina:idvacina,
            nomevacina:document.getElementById("nomeVacinaUpdate").value
        }

        await api.put("/vacinas/update-vacina", data).then((res) => {
            handleCloseModalEditarVacina()
            setAlertDiv([<Alert tema="success" conteudo="Vacina atualizada com sucesso." />])
            loadVacinas()
            setTimeout(() => {setAlertDiv([])},4000)

        }).catch(err => {
            let errors = []
            err.response.data.error.forEach(error => {
                errors.push(<Alert tema="danger" conteudo={error} />)
            })
        })
    }

    const handleRemoveVacina = async (idvacina) => {
        let data = { idvacina:idvacina }
        console.log(data)
        await api.delete("/vacinas/delete-vacina",{data:data}).then((res) => {
            setAlertDiv([<Alert tema="success" conteudo="Vacina removida com sucesso." />])
            loadVacinas()
            setTimeout(() => {setAlertDiv([])},4000)
        }).catch(err => {
            let errors = []
            err.response.data.error.forEach(error => {
                errors.push(<Alert tema="danger" conteudo={error} />)
            })
        })
        
    }
    const handleAdicionarVacina = (e) => {
        e.preventDefault()
        api.post("/vacinas/create-vacina", vacina).then((res) => {
            setAlertDiv([<Alert tema="success" conteudo="Vacina criada com sucesso." />])
            loadVacinas()
            setTimeout(() => {setAlertDiv([])},4000)
        }).catch(err => {
            let errors = []
            err.response.data.error.forEach(error => {
                errors.push(<Alert tema="danger" conteudo={error} />)
            })
        })
    }

    const loadVacinas = () => {
        api.get("/vacinas/lista-vacina").then((res) => {
            setVacinaList(res.data.vacinas)
        }).catch(err => {
            let errors = [...err.response.data.error]
            console.log(errors)
        })
    }

    const converterData = (d) => {
        let data = d.split("T")[0].split("-")
        return `${data[2]}/${data[1]}/${data[0]}`
    }

    useEffect(() => {
        loadVacinas()
    }, [])
    
    return (
        <div>
            <Menu />

            <div className="container" id="adicionar-vacina">
                <div className="row">
                    <div className="col-md-12">
                        <form id="adicionar-vacina-form" onSubmit={handleAdicionarVacina}>
                            <label htmlFor="nomevacina" className="form-label">Nome da vacina</label>
                            <input type="text" name="nomevacina" className="form-control" value={vacina.nomevacina} onChange={(e) => { setVacina({ nomevacina: e.target.value }) }} placeholder="Nome da vacina" />
                            <button className="btn btn-primary" type="submit">Adicionar</button>
                        </form>
                        {alertDiv.map(a => a)}
                        <table id="table-list-vacina" striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID da vacina</th>
                                    <th>Nome da vacina</th>
                                    <th>Criada em</th>
                                    <th>Atualizada em</th>
                                    <th>Editar</th>
                                    <th>Excluir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vacinaList.map(vacina => (
                                    <tr key={vacina.idvacina}>
                                        <td>{vacina.idvacina}</td>
                                        <td>{vacina.nomevacina}</td>
                                        <td>{converterData(vacina.createdAt)}</td>
                                        <td>{converterData(vacina.updatedAt)}</td>
                                        <td><center onClick={() => handleShowModalEditarVacina(vacina.idvacina)}><FaEdit id="iconTable" /></center></td>
                                        <td><center onClick={() => handleRemoveVacina(vacina.idvacina)}><FaTrashAlt id="iconTable" /></center></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                        <br />
                        {showModalEditarVacina &&

                            <div className="modal">
                                <div className="modal-content">
                                    <span>
                                        Atualizar Vacina
                                        <span onClick={handleCloseModalEditarVacina} className="close"><ImCross id="icon" /></span>
                                    </span>
                                    <hr />
                                    <form id="update-vacina-form" onSubmit={handleUpdateVacina}>
                                        <label htmlFor="nomeUpdate" className="form-label">Nome da vacina</label>
                                        <input type="text" id="nomeVacinaUpdate" className="form-control" name="nomeUpdate" placeholder="Nome da vacina" />
                                        <button className="btn btn-primary" type="submit">Atualizar</button>
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

export default AdicionarVacina
