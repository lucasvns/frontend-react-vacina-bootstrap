const isPrivate = (onlyAdmin) => {
    let perfil = localStorage.getItem("perfil")
    console.log(onlyAdmin)
        if(onlyAdmin){
            if(perfil==="admin"){
                return true
            } else {
                return false
            }
        } else {
            return true
        }
}
export default isPrivate