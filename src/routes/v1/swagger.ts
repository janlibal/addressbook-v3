import {Request, Response} from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
      openapi: "3.0.0",
      info: { 
        title: "AddressBook Backend API", 
        version: "1.0.0" 
    },
    },
    //apis: ["./src/routes/v1/v1docs.yml"],
    apis: ["./config/v1/openapi.yml"],
  }

const swaggerSpec = swaggerJSDoc(options)


const swaggerDocs = (app:any, port:any) => {
  // Route-Handler to visit our docs
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Make our docs in JSON format available
  app.get("/api/v1/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    res.send(swaggerSpec)
  })
  console.log(
    `Version 1 Docs are available on http://localhost:${port}/api/v1/docs`
  )
}

export default swaggerDocs