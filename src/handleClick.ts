import { Observable } from 'rxjs/Observable'
import * as FileAPI from 'fileapi/dist/FileAPI.html5'

import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/switchMapTo'

export interface HandleClickConfig {
  multiple?: boolean
  accept?: string
  directory?: boolean
}

let globalInputButton

export const handleClick = (clickElement: HTMLElement, config: HandleClickConfig = {}): Observable<File[]> => {

  if (!globalInputButton) {
    globalInputButton = document.createElement('input')
    globalInputButton.type = 'file'
  }

  const file$ = Observable.create((obs) => {
    globalInputButton.accept = config.accept || ''
    globalInputButton.multiple = config.directory || config.multiple || false
    globalInputButton.webkitdirectory = config.directory || false
    globalInputButton.value = null
    globalInputButton.onchange = (e) => {
      const files = FileAPI.getFiles(e)
      files.forEach((file) => {
        file.path = file.webkitRelativePath
      })
      obs.next(files)
      obs.complete()
    }
    globalInputButton.click()
    return () => {
      globalInputButton.value = null
    }
  })

  return Observable.fromEvent(clickElement, 'click')
    .switchMapTo(file$)
}
