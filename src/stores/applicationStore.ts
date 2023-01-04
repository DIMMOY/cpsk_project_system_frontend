import { User } from "firebase/auth";
import { makeAutoObservable } from "mobx";

class applicationStore {
    user: User | null = null
    userDisplayName = ''
    isShowNavBar = false
    isAdmin = false
    isAdvisor = false
    isStudent = false
    currentRole = 0
    classroom: string | null = null;
    userId: string | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    setUser(user: User | null) {
        this.user = user as User
    }

    setIsShowNavBar(isShowNavBar: boolean) {
        this.isShowNavBar = isShowNavBar as boolean
    }

    setRole(roles: Array<any>) {
        this.isAdmin = roles.find((e) => e.role == 2) ? true : false as boolean
        this.isAdvisor = roles.find((e) => e.role == 1) ? true : false as boolean
        this.isStudent = roles.find((e) => e.role == 0) ? true : false as boolean

        const currentRole = roles.find((e) => e.currentRole)
        this.currentRole = currentRole.role as number

        if (this.currentRole === 0) this.classroom = 'CPE33'

        this.userId = currentRole.userId as string // สำหรับทดสอบเท่านั้น
    }

    setCurrentRole(currentRole: number) {
        this.currentRole = currentRole as number
    }

    setClassroom(name: string | null) {
        this.classroom = name as string | null
    }
}

export default new applicationStore()