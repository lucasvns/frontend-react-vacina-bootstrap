const isAuth = (token) => {
    if(token){
        return true
    } else {
        console.log("login")
        return false
    }
}
export default isAuth