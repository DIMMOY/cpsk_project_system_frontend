import { User } from "firebase/auth";
import { makeAutoObservable } from "mobx";

class applicationStore {
    user: User | null = null
    userDisplayName = ''
    isShowNavBar = false
    isAdmin = false
    isTeacher = false
    isStudent = false

    constructor() {
        makeAutoObservable(this)
    }

    setUser(user: User | null) {
        this.user = user as User
    }

    setIsShowNavBar(isShowNavBar: boolean) {
        this.isShowNavBar = isShowNavBar as boolean
    }

    setRole(roles: Array<number>) {
        this.isAdmin = roles.find((e) => e === 2) ? true : false as boolean
        this.isTeacher = roles.find((e) => e === 1) ? true : false as boolean
        this.isStudent = roles.find((e) => e === 0) ? true : false as boolean
    }
}

export default new applicationStore()