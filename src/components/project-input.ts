import {Component} from "./base-component.js";
import {AutoBind} from "../decorators/autobind.js";
import {projectState} from "../state/project.js";
import {validate} from "../utils/validation.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  private titleInputEl: HTMLInputElement
  private descriptionInputEl: HTMLInputElement
  private peopleInputEl: HTMLInputElement

  constructor() {
    super('project-input', 'app', true, 'user-input')

    this.titleInputEl = this.element.querySelector('#title') as HTMLInputElement
    this.descriptionInputEl = this.element.querySelector('#description') as HTMLInputElement
    this.peopleInputEl = this.element.querySelector('#people') as HTMLInputElement

    this.configure()
    this.renderContent()
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler)
  }

  renderContent() {
  }

  private clearInputs() {
    this.titleInputEl.value = ''
    this.descriptionInputEl.value = ''
    this.peopleInputEl.value = ''
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      projectState.addProject(title, desc, people)
      this.clearInputs()
    }
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value
    const enteredDesc = this.descriptionInputEl.value
    const enteredPeople = this.peopleInputEl.value

    const titleValidatable = {value: enteredTitle, required: true}
    const descValidatable = {value: enteredDesc, required: true, minLength: 5}
    const peopleValidatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    }

    if (!validate(titleValidatable) || !validate(descValidatable) || !validate(peopleValidatable)) {
      alert('Invalid input, please try again!')
      return
    }
    return [enteredTitle, enteredDesc, Number(enteredPeople)]
  }
}
