import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import speakeasy from 'speakeasy'
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig.js'

const app = express();
express.json()

const dbConfig = new Config("myDatabase", true, false, '/')

const db = new JsonDB(dbConfig)

app.get('/api',(req, res)=>{
    res.json({message: 'Welcome to 2FA'})
})
const PORT = 9000
app.listen(PORT, ()=>console.log(`Server started at port ${PORT}`))