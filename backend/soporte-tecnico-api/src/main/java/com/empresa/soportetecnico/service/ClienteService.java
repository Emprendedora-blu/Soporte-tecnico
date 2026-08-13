package com.empresa.soportetecnico.service;

import com.empresa.soportetecnico.model.Cliente;

import java.util.List;

/*
 Define la logica de negocio disponible para la gestion de clientes.
 Separar la interfaz de su implementacion permite cambiar la forma de
 almacenamiento.
 */
public interface ClienteService {

    List<Cliente> listarTodos();

    Cliente buscarPorId(Long id);

    Cliente crear(Cliente cliente);

    Cliente actualizar(Long id, Cliente clienteActualizado);

    void eliminar(Long id);
}
