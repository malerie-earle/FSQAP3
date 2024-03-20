var router = require('express').Router();
const loginsDal = require('../../services/pg.logins.dal')
// const loginsDal = require('../../services/m.logins.dal')

// GET - Read: /logins/
router.get('/', async (req, res) => {
    logger.log('Route: /logins/ GET ' + req.url)
    try {
        let theLogins = await loginsDal.getLogins(); 
        logger.table(theLogins);
        res.json(theLogins);
    } catch {
        logger.error('Service Unavailable', + err);
        res.statusCode = 503;
        res.json({message: 'Service Unavailable', status: 503});
    }
});

// GET - Read: /logins/:id 
router.get('/:id', async (req, res) => {
    logger.log('Route: /logins/:id GET ' + req.url);
    try {
        let aLogin = await loginsDal.getLoginByLoginId(req.params.customer_id); 
        if (aLogin.length === undefined || aLogin.length === 0) {
            res.statusCode = 404;
            res.json({message: 'No record found', status: 404});
            logger.error('No record found');
            res.render('norecord')
        } else {
            res.statusCode = 200;
            res.json(aLogin);
            logger.table(aLogin);
            res.render('login', {aLogin});
        }
    } catch (err) {
        // log this error to an error log file.
        logger.error('Service Unavailable', + err);
        res.render('503');
    }
});

module.exports = router;