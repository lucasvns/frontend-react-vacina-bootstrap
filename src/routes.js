import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import isAuth from './utils/isAuth';
import { useUser } from "./providers/user"
import Pages from './pages';
import isPrivate from './utils/isPrivate';


function Routes(){
    const PrivateRoute = ({component: Component,onlyAdmin, ...rest})=>(
        <Route {...rest} render ={props =>{
            let token = localStorage.getItem("token")
            return isAuth(token)?(
                isPrivate(onlyAdmin)?(
                    <Component {...props}/>
                ):(
                    <Redirect to ={{pathname:"/home",state:{from: props.location}}}/>
                )
            ):(
                <Redirect to ={{pathname:'/',state:{from: props.location}}}/>
            )
        }}/>
    )
    
    const PublicRoute = ({component: Component,onlyAdmin, ...rest})=>(
        <Route {...rest} render ={props =>{
            let token = localStorage.getItem("token")
            return isAuth(token)?(
                <Redirect to ={{pathname:"/home",state:{from: props.location}}}/>
            ):(
                isPrivate(onlyAdmin)?(
                    <Component {...props}/>
                ):(
                    <Redirect to ={{pathname:"/home",state:{from: props.location}}}/>
                )
            )
        }}/>
    )

                
    const NotFound = () =>(<Redirect to ={{pathname:"/home"}}/>)
    return(
        <BrowserRouter>
            <Switch>
                <PublicRoute exact path="/" component={()=>(<Pages.Login />)}/>
                <PublicRoute exact path="/cadastro" component={()=>(<Pages.Cadastro />)}/>
                <PrivateRoute exact path="/home" component={()=>(<Pages.Home />)}/>
                <PrivateRoute exact path="/adicionar-vacina" onlyAdmin={true} component={()=>(<Pages.AdicionarVacina />)}/>
                <PrivateRoute exact path="/adicionar-registro" component={()=>(<Pages.Registro />)}/>
                <PrivateRoute exact path="/perfil" onlyAdmin={true} component={()=>(<Pages.Perfil />)}/>
                <PrivateRoute exact path="/meus-dados"  component={()=>(<Pages.Dados />)}/>

                <PrivateRoute path='*' component={NotFound}/>
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;