import express from 'express'
import uuid from 'uuid'
import speakeasy from 'speakeasy'
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'

const app = express();

app.get('/',(req, res)=>{
    res.json({message: 'Welcome to 2FA'})
})
const PORT = 9000
app.listen(PORT, console.log(`Server started at port ${PORT}`))