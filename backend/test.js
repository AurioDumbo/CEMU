const bcrypt = require('bcrypt');

async function generar() {
    const hash = await bcrypt.hash('Admin2025*', 10);
    console.log("Copia este hash exactamente:");
    console.log(hash);
}
generar();