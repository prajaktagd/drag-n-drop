import {Project, Status} from "../models/project";

type Listener<T> = (projects: T[]) => void

abstract class State<T> {
  protected listeners: Listener<T>[] = []

  addListener(listener: Listener<T>) {
    this.listeners.push(listener)
  }
}

class ProjectState extends State<Project> {
  private static instance: ProjectState
  private projects: Project[] = []

  private constructor() {
    super()
  }

  static getInstance() {
    if (this.instance) return this.instance
    this.instance = new ProjectState()
    return this.instance
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      Status.Active
    )
    this.projects.push(newProject)
    this.updateListeners()
  }

  moveProject(projectId: string, newStatus: Status) {
    const project = this.projects.find((project) => project.id === projectId)
    if (project && project.status !== newStatus) {
      project.status = newStatus
      this.updateListeners()
    }
  }

  private updateListeners() {
    for (const listener of this.listeners) {
      listener([...this.projects])
    }
  }
}

export const projectState = ProjectState.getInstance()
