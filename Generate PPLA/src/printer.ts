import { Printer, type IConfig, Direction } from 'printer-ppla'
import * as fs from 'fs'
import path from 'path'

export function generatePPLA(strings: string[], nome: string) {
  const string = strings

  const configPrinter: IConfig = {
    width: 80,
    height: 30,
    columns: 1,
    unitMeasurement: 'm',
    printFunction: sendToPrinter,
  }

  const print = new Printer(configPrinter)

  function centerLine(text: string): string {
    const totalSpaces: number = 29 - text.length
    const leftSpaces: number = Math.floor(totalSpaces / 2)
    const rightSpaces: number = totalSpaces - leftSpaces
    return ' '.repeat(leftSpaces) + text + ' '.repeat(rightSpaces)
  }

  function alignText(text: string): string[] {
    const words: string[] = text.split(' ')
    const lines: string[] = []
    let currentLine: string = ''

    words.forEach((word: string) => {
      if ((currentLine + ' ' + word).trim().length <= 25) {
        currentLine += (currentLine === '' ? '' : ' ') + word
      } else {
        lines.push(centerLine(currentLine))
        currentLine = word
      }
    })

    if (currentLine !== '') {
      lines.push(centerLine(currentLine))
    }

    return lines
  }

  function processArray(texts: string[]): string[] {
    const result: string[] = []

    texts.forEach((text: string, index: number) => {
      const lines: string[] = alignText(text)

      result.push(...lines)
      if (index < texts.length - 1) {
        result.push(' '.repeat(29))
      }
    })

    return result
  }

  const finalStrings: string[] = processArray(strings)

  let alturaPapel: number = 15

  for (let i: number = 0; i < finalStrings.length; i++) {
    const tamanho = finalStrings.length - i - 1

    print.addText({
      y: alturaPapel,
      x: 0,
      text: finalStrings[tamanho],
      direction: Direction.PORTRAIT,
    })

    if (finalStrings[tamanho].includes("                  ")) {
      alturaPapel += 15
    } else {
      alturaPapel += 60
    }
  }

  const pplaBuffer = print.build()

  function sendToPrinter(dataBuffer: Buffer) {
    const caminhoArquivo = path.join(__dirname, '..', 'src', 'files', `${nome}.ppla`)
    fs.mkdirSync(path.dirname(caminhoArquivo), { recursive: true })
    fs.writeFileSync(caminhoArquivo, dataBuffer)
  }

  sendToPrinter(pplaBuffer)
}