/// <reference path="base-component.ts" />
/// <reference path="../state/project.ts" />

namespace App {
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    private assignedProjects: Project[]

    constructor(private type: 'active' | 'finished') {
      super('project-list', 'app', false, `${type}-projects`)
      this.assignedProjects = []

      this.configure()
      this.renderContent()
    }

    @AutoBind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault()
        this.element.classList.add('droppable')
      }
    }

    @AutoBind
    dropHandler(event: DragEvent) {
      const projectId = event.dataTransfer!.getData('text/plain')
      projectState.moveProject(projectId, this.type === 'active' ? Status.Active : Status.Finished)
    }

    @AutoBind
    dragLeaveHandler(event: DragEvent) {
      this.element.classList.remove('droppable')
    }

    configure() {
      this.element.addEventListener('dragover', this.dragOverHandler)
      this.element.addEventListener('drop', this.dropHandler)
      this.element.addEventListener('dragleave', this.dragLeaveHandler)
      projectState.addListener((projects: Project[]) => {
        this.assignedProjects = projects.filter(project => this.type === 'active'
          ? project.status === Status.Active
          : project.status === Status.Finished)
        this.renderProjects()
      })
    }

    renderContent() {
      this.element.querySelector('ul')!.id = `${this.type}-projects-list`
      this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`
    }

    private renderProjects() {
      const listId = `${this.type}-projects-list`
      const listEl = document.querySelector(`#${listId}`)! as HTMLUListElement
      listEl.innerHTML = ''
      for (const project of this.assignedProjects) {
        new ProjectItem(listId, project)
      }
    }
  }
}