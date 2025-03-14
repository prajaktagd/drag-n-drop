namespace App {
  export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    private templateEl: HTMLTemplateElement
    private hostEl: T
    protected readonly element: U

    protected constructor(
      templateElId: string,
      hostElId: string,
      insertAtStart: boolean,
      newElId?: string
    ) {
      this.templateEl = document.getElementById(templateElId)! as HTMLTemplateElement
      this.hostEl = document.getElementById(hostElId)! as T

      const importedNode = document.importNode(this.templateEl.content, true)
      this.element = importedNode.firstElementChild as U
      if (newElId) this.element.id = newElId

      this.attach(insertAtStart)
    }

    abstract renderContent(): void

    abstract configure(): void

    private attach(insertAtStart: boolean) {
      this.hostEl.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element)
    }
  }
}