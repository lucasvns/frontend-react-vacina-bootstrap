import React, { useState, useEffect } from 'react'
//import { Row, Container, Col, Form, Button, Table } from 'react-bootstrap';
import Menu from '../../components/menu';
import Alert from '../../components/alert'
import api from '../../utils/api';
 
const Perfil = () => {
    const [usuarios, setUsuarios] = useState([])
    const [showtable, setShowtable] = useState(false)
    const [alertDiv, setAlertDiv] = useState([])

    api.defaults.headers.Authorization = `Bearer ${localStorage.getItem("token")}`


    const handleMudarPerfil = async (perfil, idusuario) => {
        let data = { perfil: perfil, idusuario: idusuario }
        await api.put("/usuario/update/perfil", data).then((res) => {
            setAlertDiv([<Alert tema="success" conteudo="Perfil atualizado com sucesso." />])
            setTimeout(() => {setAlertDiv([])},4000)
            
            loadUsuarios()
        }).catch(err => {
            let errors = []
            err.response.data.error.forEach(error => {
                errors.push(<Alert tema="danger" conteudo={error} />)
            })
        })

    }

    const loadUsuarios = async () => {
        await api.get("/usuario/usuario-list").then((res) => {
            setUsuarios(res.data.usuarios)
        }).catch((err) => {
            let errors = []
            err.response.data.error.forEach(error => {
                errors.push(<Alert tema="danger" conteudo={error} />)
            }) 
        })
    }

    useEffect(() => {
        loadUsuarios()
    }, [])

    useEffect(() => {
        console.log(usuarios)
        setShowtable(true)
    }, [usuarios])
    
    return (

        <div>
            <Menu />

            <div className="container" id="mudar-perfil" >
                <div className="row">
                    <div className="col-md-12">
                        {alertDiv.map(a => a)}
                        <br />
                        {showtable &&
                            <table id="table-list-usuarios" >
                                <thead>
                                    <tr>
                                        <th>ID do usuario</th>
                                        <th>Email</th>
                                        <th>Perfil</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((usuario) => (
                                        <tr key={usuario.idusuario}>
                                            <td>{usuario.idusuario}</td>
                                            <td>{usuario.mail}</td>
                                            <td>
                                                <center>
                                                    <select id={usuario.idusuario} value={usuario.perfil} onChange={(e) => { handleMudarPerfil(e.target.value, usuario.idusuario) }} aria-label="" name="usuarioPerfil" >
                                                        <option value="admin">Administrador</option>
                                                        <option value="user">Usuário</option>
                                                    </select>
                                                </center>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Perfil
