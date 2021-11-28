import React, { useState} from 'react'
import { useHistory } from "react-router-dom";
//import { Button, Form, Container } from 'react-bootstrap';
import Alert from '../../components/alert'
import api from '../../utils/api';
import "./index.css"

const Cadastro = () => {
    const history = useHistory();
    const redirectLogin = () => history.push("/")
    const [usuario, setUsuario] = useState({ mail: "", senha: "", perfil: "" })
    const [alertDiv, setAlertDiv] = useState([])

    const handleChange = (e) => {
        const value = e.target.value;
        setUsuario({
            ...usuario,
            [e.target.name]: value
        })
    }
    const handleCadastro = (e) => {
        e.preventDefault()
        let data = { ...usuario }
        data.perfil = "user"
        api.post("/usuario/create", data).then((res) => {
            if (res.status === 200) {
                setAlertDiv([<Alert tema="success" conteudo="Usuário cadastrado com sucesso." />])
                setTimeout(() => {redirectLogin()},4000)
            }

        }).catch(err => {
            let errors = []

            err.response.data.error.forEach(error => {
                errors.push(<Alert tema="danger" conteudo={error} />)
            })
            setAlertDiv(errors)
        })
    }

    return (
        
        <div className="container" id="cadastro">
            <div className="row">
                <div className="col-md-12">
                    <br/>
                    <form id="cadastro-form" onSubmit={handleCadastro}>
                        <label htmlFor="mail" className="form-label">Email</label><br />
                        <input type="email" className="form-control" name="mail" value={usuario.mail} onChange={handleChange} placeholder="email@email.com" /><br />
                        <label htmlFor="senha">Senha</label><br />
                        <input value={usuario.senha} className="form-control" name="senha" onChange={handleChange} type="password" />
                        {alertDiv.map(a => a)}
                        <br/>
                        <div className="buttonsDiv">
                            <button className="btn btn-primary" type="submit">Cadastrar</button>
                            <button className="btn btn-primary" onClick={redirectLogin}>Voltar para o login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Cadastro
