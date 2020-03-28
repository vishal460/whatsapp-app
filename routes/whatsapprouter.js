const express=require('express')
const postcontrollerss=require('../controllers/whatsappcontroller')
const router=express.Router();

router.get('/logout',postcontrollerss.logouts)
router.post('/formpost',postcontrollerss.createprovider)
router.post('/logincheck',postcontrollerss.providerauth)
router.get('/drawchart',postcontrollerss.googlechart)

router.get('/whatsappdatafetch',postcontrollerss.whatsappdatafetch)

router.post('/calendcheck',postcontrollerss.checkcalender)
router.post('/whatsapp',postcontrollerss.whatsapplist)
router.get('/ordercrm',postcontrollerss.orderlist)
router.post('/changepasscheck',postcontrollerss.changepass)


router.post('/breathing',postcontrollerss.breathingdata)
module.exports=router;