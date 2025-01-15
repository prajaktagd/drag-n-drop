type Validatable = {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

const validate = (validatable: Validatable) => {
  const { value } = validatable
  if (validatable.required && !value.toString().trim().length)
    return false
  if (validatable.minLength !== undefined && typeof value === 'string'
  && value.length < validatable.minLength)
    return false
  if (validatable.maxLength !== undefined && typeof value === 'string'
    && value.length > validatable.maxLength)
    return false
  if (validatable.min !== undefined && typeof value === 'number'
    && value < validatable.min)
    return false
  return !(validatable.max !== undefined && typeof value === 'number'
    && value > validatable.max)
}

const AutoBind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value
  return {
    configurable: true,
    get() {
      return originalMethod.bind(this)
    }
  }
}

class ProjectInput {
  templateEl: HTMLTemplateElement
  hostEl: HTMLDivElement
  formEl: HTMLFormElement
  titleInputEl: HTMLInputElement
  descriptionInputEl: HTMLInputElement
  peopleInputEl: HTMLInputElement

  constructor() {
    this.templateEl = document.getElementById('project-input')! as HTMLTemplateElement
    this.hostEl = document.getElementById('app')! as HTMLDivElement

    const importedNode = document.importNode(this.templateEl.content, true)
    this.formEl = importedNode.firstElementChild as HTMLFormElement
    this.formEl.id = 'user-input'
    this.titleInputEl = this.formEl.querySelector('#title') as HTMLInputElement
    this.descriptionInputEl = this.formEl.querySelector('#description') as HTMLInputElement
    this.peopleInputEl = this.formEl.querySelector('#people') as HTMLInputElement

    this.formEl.addEventListener('submit', this.submitHandler)
    this.attach()
  }

  private clearInput() {
    this.titleInputEl.value = ''
    this.descriptionInputEl.value = ''
    this.peopleInputEl.value = ''
  }

  private attach() {
    this.hostEl.insertAdjacentElement('afterbegin', this.formEl)
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      console.log(title, desc, people)
    }
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value
    const enteredDesc = this.descriptionInputEl.value
    const enteredPeople = this.peopleInputEl.value

    const titleValidatable = { value: enteredTitle, required: true }
    const descValidatable = { value: enteredDesc, required: true, minLength: 5 }
    const peopleValidatable = { value: +enteredPeople, required: true, min: 1, max: 5 }

    if (validate(titleValidatable) && validate(descValidatable) && validate(peopleValidatable)) {
      this.clearInput()
      return [enteredTitle, enteredDesc, Number(enteredPeople)]
    }
    alert('Invalid input, please try again!')
  }
}

const projectInput = new ProjectInput()