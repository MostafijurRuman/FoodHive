import { useContext } from "react"
import AuthContext from "../Contexts/AuthContext"

export default function useAuth() {
    const authContext = useContext(AuthContext)
    return authContext;
}
