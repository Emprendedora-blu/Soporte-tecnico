package com.empresa.soportetecnico.service;

import com.empresa.soportetecnico.exception.RecursoNoEncontradoException;
import com.empresa.soportetecnico.model.Cliente;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Implementacion de ClienteService que simula la persistencia utilizando
 * un Map en memoria. No requiere conexion a base de datos: los datos
 * existen unicamente durante la ejecucion de la aplicacion, tal como lo
 * pide el alcance del proyecto.
 */
@Service
public class ClienteServiceImpl implements ClienteService {

    private final Map<Long, Cliente> clientes = new ConcurrentHashMap<>();
    private final AtomicLong contadorId = new AtomicLong(0);

    @Override
    public List<Cliente> listarTodos() {
        return List.copyOf(clientes.values());
    }

    @Override
    public Cliente buscarPorId(Long id) {
        Cliente cliente = clientes.get(id);
        if (cliente == null) {
            throw new RecursoNoEncontradoException("No se encontro un cliente con id " + id);
        }
        return cliente;
    }

    @Override
    public Cliente crear(Cliente cliente) {
        Long nuevoId = contadorId.incrementAndGet();
        cliente.setId(nuevoId);
        clientes.put(nuevoId, cliente);
        return cliente;
    }

    @Override
    public Cliente actualizar(Long id, Cliente clienteActualizado) {
        Cliente clienteExistente = buscarPorId(id);

        clienteExistente.setNombre(clienteActualizado.getNombre());
        clienteExistente.setCorreo(clienteActualizado.getCorreo());
        clienteExistente.setTelefono(clienteActualizado.getTelefono());
        clienteExistente.setEmpresa(clienteActualizado.getEmpresa());

        clientes.put(id, clienteExistente);
        return clienteExistente;
    }

    @Override
    public void eliminar(Long id) {
        buscarPorId(id); // valida que exista antes de eliminar
        clientes.remove(id);
    }
}
