import { Router, Response, Request } from 'express'
import umzug from '../../db/migrations'
var router = Router()

router.use('/migrate/up', async (req: Request, res: Response) => {
    try {
        const response = await umzug.up()
        res.send(response)
    }
    catch (err) {
        console.log('migration-up-err', err)
        res.send(err)
    }
})

router.use('/migrate/down', async (req: Request, res: Response) => {
    try {
        const response = await umzug.down()
        res.send(response)
    }
    catch (err) {
        console.log('migration-down-err', err)
        res.send(err)
    }
})
export default router