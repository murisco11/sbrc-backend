const { generatePPLA } = require("./printer")
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3000
const FormData = require("form-data")

app.use(cors())
app.use(express.json())


app.post('/receber-array', async (req: any, res: any) => {
  const { arrayFinal } = req.body
  const originalName = arrayFinal[0]
  const formattedName = originalName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")

  if (Array.isArray(arrayFinal)) {
    generatePPLA(arrayFinal, formattedName)

    const filePath = path.join(__dirname, 'files', `${formattedName}.ppla`)

    const formData = new FormData()
    formData.append('file', fs.createReadStream(filePath))

    try {
      const response = await axios.post('http://localhost:1111/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      })
    } catch (error: any) {
      console.error('Erro ao enviar o arquivo:', error.message)
    }
  }

  res.status(200).json({
    message: 'Arquivo enviado para o servidor da impressora!',
    data: arrayFinal,
  })
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})