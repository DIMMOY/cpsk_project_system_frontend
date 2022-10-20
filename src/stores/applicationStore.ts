import { User } from "firebase/auth";
import { makeAutoObservable } from "mobx";

class applicationStore {
    user: User | null = null
    userDisplayName = ''
    isShowNavBar = false

    constructor() {
        makeAutoObservable(this)
    }

    setUser(user: User | null) {
        this.user = user as User
    }

    setIsShowNavBar(isShowNavBar: boolean) {
        this.isShowNavBar = isShowNavBar as boolean
    }
}

export default new applicationStore()