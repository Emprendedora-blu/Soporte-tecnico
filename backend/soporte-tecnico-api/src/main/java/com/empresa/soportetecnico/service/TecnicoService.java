package com.empresa.soportetecnico.service;

import com.empresa.soportetecnico.model.Tecnico;

import java.util.List;

/*
Define la logica de negocio disponible para la gestion de tecnicos de soporte.
 */
public interface TecnicoService {

    List<Tecnico> listarTodos();

    Tecnico buscarPorId(Long id);

    Tecnico crear(Tecnico tecnico);

    Tecnico actualizar(Long id, Tecnico tecnicoActualizado);

    void eliminar(Long id);
}
