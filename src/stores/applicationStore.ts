import { User } from "firebase/auth";
import { makeAutoObservable } from "mobx";

class applicationStore {
    user: User | null = null
    userDisplayName: string | null = ''
    projectId: string | null = null
    classroom: any | null = null;
    userId: string | null = null;
    isShowNavBar = false
    isShowSideBar = false
    isShowMenuSideBar = true
    isAdmin = false
    isAdvisor = false
    isStudent = false
    currentRole = 0

    constructor() {
        makeAutoObservable(this)
    }

    setUser(user: User | null) {
        this.user = user as User
    }

    setProjectId(projectId: string) {
        this.projectId = projectId as string
    }

    setIsShowNavBar(isShowNavBar: boolean) {
        this.isShowNavBar = isShowNavBar as boolean
    }

    setIsShowSideBar(isShowSideBar: boolean) {
        this.isShowSideBar = isShowSideBar as boolean
    }

    setIsShowMenuSideBar(isShowMenuSideBar: boolean) {
        this.isShowMenuSideBar = isShowMenuSideBar as boolean
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