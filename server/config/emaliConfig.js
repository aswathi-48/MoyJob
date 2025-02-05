import NodeMailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars';
import path from 'path'

const transporte = NodeMailer.createTransport({
    service:"gmail",
    auth:{
        user:"k.aswathi.limenzy@gmail.com",
        pass:"hqth gbpl izcr slxk"
    }
});

const handlebarOptions = {
    viewEngine: {
        partialDir: path.resolve('./views/'),
        defaultLayout: false
    },
    viewPath: path.resolve('./views')
}

transporte.use('compile', hbs(handlebarOptions))
export default transporte