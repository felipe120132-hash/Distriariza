async function test() {
    try {
        const res = await fetch('http://localhost:5000/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cliente_nombre: 'Usuario de Prueba',
                cliente_telefono: '3001234567',
                cliente_email: 'felipe120132@gmail.com',
                cliente_direccion: 'Calle Falsa 123',
                cliente_ciudad: 'Bogotá',
                total: 10000,
                items: [
                    { id: 1, nombre: 'Acuaprime 30ml', cantidad: 2, precio: 5000 }
                ]
            })
        });
        const data = await res.json();
        console.log('✅ Pedido exitoso:', data);
    } catch (error) {
        console.error('❌ Error en pedido:', error);
    }
}

test();
