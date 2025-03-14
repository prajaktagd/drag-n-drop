import {Component} from "./base-component.js";
import {Draggable} from "../models/drag-drop.js";
import {Project} from "../models/project.js";
import {AutoBind} from "../decorators/autobind.js";

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project

  get people() {
    return this.project.numOfPeople === 1 ? '1 person' : `${this.project.numOfPeople} people`
  }

  constructor(hostElId: string, project: Project) {
    super('single-project', hostElId, false, project.id)
    this.project = project

    this.configure()
    this.renderContent()
  }

  @AutoBind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id)
    event.dataTransfer!.effectAllowed = 'move'
  }

  @AutoBind
  dragEndHandler(_: DragEvent) {
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler)
    this.element.addEventListener('dragend', this.dragEndHandler)
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title
    this.element.querySelector('h3')!.textContent = `${this.people} assigned`
    this.element.querySelector('p')!.textContent = this.project.description
  }
}
